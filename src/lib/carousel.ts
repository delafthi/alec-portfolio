export interface CarouselElements {
    slides: HTMLElement[];
    dots: HTMLElement[];
    title: HTMLElement | null;
    /** AbortSignal to remove listeners and stop the timer on teardown. */
    signal?: AbortSignal;
}

export function initCarousel({
    slides,
    dots,
    title,
    signal,
}: CarouselElements): void {
    if (!slides.length) return;

    let current = 0;

    function goTo(index: number) {
        slides[current].style.opacity = "0";
        slides[current].style.pointerEvents = "none";
        slides[current].setAttribute("tabindex", "-1");
        dots[current]?.style.setProperty("opacity", "0.35");

        current = index;

        slides[current].style.opacity = "1";
        slides[current].style.pointerEvents = "auto";
        slides[current].setAttribute("tabindex", "0");
        dots[current]?.style.setProperty("opacity", "1");
        if (title) title.textContent = slides[current].dataset.title ?? "";
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    function resetTimer() {
        clearInterval(timer);
        if (slides.length > 1 && !reduceMotion) {
            timer = setInterval(
                () => goTo((current + 1) % slides.length),
                5000,
            );
        }
    }

    resetTimer();
    signal?.addEventListener("abort", () => clearInterval(timer));

    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) clearInterval(timer);
            else resetTimer();
        },
        { signal },
    );

    dots.forEach((dot) => {
        dot.addEventListener(
            "click",
            () => {
                goTo(Number(dot.dataset.dot));
                resetTimer();
            },
            { signal },
        );
    });

    let touchStartX = 0;
    const container = slides[0]?.parentElement;
    if (container) {
        container.addEventListener(
            "touchstart",
            (e) => {
                touchStartX = e.touches[0].clientX;
            },
            { passive: true, signal },
        );
        container.addEventListener(
            "touchend",
            (e) => {
                const dx = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(dx) < 40) return;
                if (dx < 0) goTo((current + 1) % slides.length);
                else goTo((current - 1 + slides.length) % slides.length);
                resetTimer();
            },
            { signal },
        );
    }
}
