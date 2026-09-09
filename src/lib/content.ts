import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { getCollection, render } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Lang } from "@i18n/ui";
import { MATERIAL_GROUP_MAP } from "./lookups";

export type ArtworkEntry = CollectionEntry<"artworks">;
export type TagEntry = CollectionEntry<"tags">;
export type ExhibitionEntry = CollectionEntry<"exhibitions">;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Split at build time: an exhibition stays "upcoming" until one day after it
 * ends. Staleness is bounded by the weekly scheduled rebuild (see
 * .github/workflows/scheduled-rebuild.yml).
 */
export function splitExhibitions(exhibitions: ExhibitionEntry[]) {
    const now = Date.now();
    const endOf = (e: ExhibitionEntry) =>
        (e.data.endDate ?? e.data.startDate).getTime() + DAY_MS;
    const upcoming = exhibitions
        .filter((e) => endOf(e) > now)
        .toSorted(
            (a, b) => a.data.startDate.getTime() - b.data.startDate.getTime(),
        );
    const past = exhibitions
        .filter((e) => endOf(e) <= now)
        .toSorted(
            (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
        );
    return { upcoming, past };
}

export async function getArtworks(opts?: { featured?: boolean }) {
    const artworks = await getCollection("artworks");
    const filtered = opts?.featured
        ? artworks.filter((a) => a.data.featured)
        : artworks;
    return filtered.toSorted((a, b) => (b.data.year ?? 0) - (a.data.year ?? 0));
}

export async function getExhibitions() {
    return getCollection("exhibitions");
}

export interface ArtworkLightboxItem {
    id: string;
    title: string;
    image: string;
    url: string;
    tags: string[];
    materialGroup: string;
}

export function artworkDetailBase(lang: Lang): string {
    return getRelativeLocaleUrl(lang, "/artwork").replace(/\/$/, "");
}

export async function toArtworkLightboxItems(
    artworks: Awaited<ReturnType<typeof getArtworks>>,
    lang: Lang,
): Promise<ArtworkLightboxItem[]> {
    const detailBase = artworkDetailBase(lang);
    const items = [];
    for (const a of artworks) {
        const { src } = await getImage({
            src: a.data.image,
            width: Math.min(1600, a.data.image.width),
        });
        items.push({
            id: a.id,
            title: a.data.title[lang],
            image: src,
            url: `${detailBase}/${a.id}/`,
            tags: a.data.tags ?? [],
            materialGroup: MATERIAL_GROUP_MAP[a.data.materials],
        });
    }
    return items;
}

export async function getAboutContent(lang: Lang) {
    const pages = await getCollection("pages");
    const entry = pages.find((p) => p.id === `${lang}/about`);
    if (!entry) return null;
    const { Content } = await render(entry);
    return Content;
}

export async function getContactEmail(): Promise<string> {
    const settings = await getCollection("settings");
    return settings.find((s) => s.id === "contact")?.data.email ?? "";
}

export async function getTags() {
    const tags = await getCollection("tags");
    return tags.toSorted((a, b) => a.id.localeCompare(b.id));
}
