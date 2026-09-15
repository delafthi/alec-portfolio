import { navigate } from "astro:transitions/client";
import type { ArtworkLightboxItem } from "./content";
import { matchesActiveFilters, parseActiveFilters } from "./filters";

export interface LightboxElements {
    lightbox: HTMLElement;
    img: HTMLImageElement;
    title: HTMLElement;
    prev: HTMLButtonElement;
    next: HTMLButtonElement;
    close: HTMLElement;
    trigger: HTMLElement;
    // Aborted on re-init (ClientRouter swap): drops the document-level
    // listener. Element listeners die with the swapped-out DOM on their own.
    signal?: AbortSignal;
}

function applyTint(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;
        let r = 0,
            g = 0,
            b = 0;
        const n = 40 * 40;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        const mix = 0.3;
        const tr = Math.round(r * mix + 0xf7 * (1 - mix));
        const tg = Math.round(g * mix + 0xf5 * (1 - mix));
        const tb = Math.round(b * mix + 0xf2 * (1 - mix));
        document.documentElement.style.setProperty(
            "--color-background",
            `rgb(${tr},${tg},${tb})`,
        );
        document.body.style.backgroundColor = `rgb(${tr},${tg},${tb})`;
    } catch (_) {
        /* cross-origin */
    }
}

function resetTint() {
    document.documentElement.style.removeProperty("--color-background");
    document.body.style.removeProperty("background-color");
}

export function initLightbox({
    lightbox,
    img: lbImg,
    title: lbTitle,
    prev: lbPrev,
    next: lbNext,
    close: lbClose,
    trigger,
    signal,
}: LightboxElements): void {
    const allArtworks: ArtworkLightboxItem[] = JSON.parse(
        lightbox.dataset.artworks ?? "[]",
    );

    const activeFilter = parseActiveFilters(window.location.search);
    const artworks = allArtworks.filter((a) =>
        matchesActiveFilters(
            a.tags,
            a.materialGroup,
            a.availability,
            activeFilter,
        ),
    );

    const currentId =
        allArtworks[parseInt(lightbox.dataset.current ?? "0", 10)]?.id;
    let idx = artworks.findIndex((a) => a.id === currentId);
    if (idx === -1) idx = 0;

    const filterSuffix = window.location.search;

    // Tint only once the current src has actually decoded; a no-op src
    // assignment fires no load event and a blank image tints wrong.
    function tintWhenReady() {
        if (lbImg.complete && lbImg.naturalWidth > 0) applyTint(lbImg);
        else
            lbImg.addEventListener("load", () => applyTint(lbImg), {
                once: true,
            });
    }

    function updateNav() {
        const prevHidden = idx <= 0;
        const nextHidden = idx >= artworks.length - 1;
        lbPrev.style.visibility = prevHidden ? "hidden" : "visible";
        lbNext.style.visibility = nextHidden ? "hidden" : "visible";
        // Mirrors visibility for the focus-trap selector; inline styles are
        // unreliable to sniff.
        lbPrev.toggleAttribute("data-nav-hidden", prevHidden);
        lbNext.toggleAttribute("data-nav-hidden", nextHidden);
    }

    function showSlide(index: number) {
        idx = index;
        const a = artworks[idx];
        lbImg.src = a.image;
        lbImg.alt = a.title;
        lbTitle.textContent = a.title;
        history.replaceState(history.state, "", a.url + filterSuffix);
        updateNav();
        tintWhenReady();
    }

    let previousFocus: HTMLElement | null = null;
    // Snapshot of the slide shown on open, so close() can tell whether the
    // user moved to a different image.
    let openedIdx = -1;

    function open() {
        openedIdx = idx;
        previousFocus = document.activeElement as HTMLElement | null;
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
        updateNav();
        tintWhenReady();
        lbClose.focus();
    }

    function close() {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
        resetTint();
        previousFocus?.focus();
        // Land on the detail page of the last-viewed slide instead of back
        // on the page the lightbox opened from.
        if (idx !== openedIdx && idx >= 0) {
            navigate(artworks[idx].url + filterSuffix, { history: "replace" });
        }
    }

    trigger.addEventListener("click", open);
    lbClose.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
    });

    lbPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        if (idx > 0) showSlide(idx - 1);
    });
    lbNext.addEventListener("click", (e) => {
        e.stopPropagation();
        if (idx < artworks.length - 1) showSlide(idx + 1);
    });

    // document persists across transitions; scope its listener to this init.
    document.addEventListener(
        "keydown",
        (e) => {
            if (lightbox.style.display !== "flex") return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft" && idx > 0) showSlide(idx - 1);
            if (e.key === "ArrowRight" && idx < artworks.length - 1)
                showSlide(idx + 1);
            if (e.key === "Tab") {
                const focusable = lightbox.querySelectorAll<HTMLElement>(
                    "button:not([data-nav-hidden])",
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        { signal },
    );

    // ClientRouter can swap the page while the lightbox is open; drop the
    // tint along with the rest of this init's teardown.
    signal?.addEventListener("abort", resetTint, { once: true });

    let touchStartX = 0;
    lightbox.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.touches[0].clientX;
        },
        { passive: true },
    );
    lightbox.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) < 40) return;
        if (dx < 0 && idx < artworks.length - 1) showSlide(idx + 1);
        if (dx > 0 && idx > 0) showSlide(idx - 1);
    });
}
