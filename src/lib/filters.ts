import {
    MATERIAL_GROUP_LABELS,
    MATERIAL_GROUP_MAP,
    type MaterialGroup,
    type MaterialKey,
} from "./lookups";

export interface ActiveFilters {
    tag: string | null;
    material: string | null;
}

export function isFiltersEmpty(f: ActiveFilters): boolean {
    return f.tag === null && f.material === null;
}

export function parseActiveFilters(search: string): ActiveFilters {
    const params = new URLSearchParams(search);
    return {
        tag: params.get("tag") || null,
        material: params.get("material") || null,
    };
}

export function matchesActiveFilters(
    tags: string[],
    materialGroup: string,
    f: ActiveFilters,
): boolean {
    if (f.tag !== null && !tags.includes(f.tag)) return false;
    if (f.material !== null && materialGroup !== f.material) return false;
    return true;
}

export function buildActiveFilterUrl(href: string, f: ActiveFilters): string {
    const url = new URL(href);
    if (f.tag) {
        url.searchParams.set("tag", f.tag);
    } else {
        url.searchParams.delete("tag");
    }
    if (f.material) {
        url.searchParams.set("material", f.material);
    } else {
        url.searchParams.delete("material");
    }
    return url.toString();
}

interface ArtworkForFilter {
    data: { tags?: string[]; materials: MaterialKey };
}

interface TagForFilter {
    id: string;
    data: { label: { en: string; de: string } };
}

export function computeFilterOptions(
    artworks: ArtworkForFilter[],
    tags: TagForFilter[],
) {
    const tagCounts = new Map<string, number>();
    for (const artwork of artworks) {
        for (const tag of artwork.data.tags ?? []) {
            tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        }
    }
    const visibleTags = tags
        .filter((tag) => (tagCounts.get(tag.id) ?? 0) >= 1)
        .sort(
            (a, b) => (tagCounts.get(b.id) ?? 0) - (tagCounts.get(a.id) ?? 0),
        );

    const groupCounts = new Map<MaterialGroup, number>();
    for (const artwork of artworks) {
        const group = MATERIAL_GROUP_MAP[artwork.data.materials];
        groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
    }
    const visibleGroups = (
        Object.keys(MATERIAL_GROUP_LABELS) as MaterialGroup[]
    )
        .filter((g) => (groupCounts.get(g) ?? 0) >= 1)
        .sort((a, b) => (groupCounts.get(b) ?? 0) - (groupCounts.get(a) ?? 0));

    return { visibleTags, visibleGroups };
}
