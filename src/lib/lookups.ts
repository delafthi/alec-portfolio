import type { Lang } from "@i18n/ui";
import availability from "../content/lookups/availability.json";
import availabilitySchema from "../content/lookups/availability.schema.json";
import materialGroups from "../content/lookups/material-groups.json";
import materialGroupSchema from "../content/lookups/material-groups.schema.json";
import materials from "../content/lookups/materials.json";
import materialsSchema from "../content/lookups/materials.schema.json";

export const MATERIAL_KEYS = [
    "oil_canvas",
    "oil_canvas_knife",
    "oil_linen",
    "oil_photo",
    "acrylic_canvas",
    "acrylic_linen_knife",
    "pencil",
    "pencil_chalk",
    "charcoal_paper",
    "chalk_charcoal_photo",
    "pastel_photo",
    "pastel_chalk_charcoal_photo",
    "pastel_chalk",
    "pastel_ink",
    "watercolour",
] as const;
export type MaterialKey = (typeof MATERIAL_KEYS)[number];

export const MATERIAL_GROUP_KEYS = [
    "oil",
    "acrylic",
    "pastel",
    "charcoal",
    "pencil",
    "watercolour",
    "smithing",
    "pottery",
    "other",
] as const;
export type MaterialGroup = (typeof MATERIAL_GROUP_KEYS)[number];

export const AVAILABILITY_KEYS = ["available", "not_available"] as const;
export type AvailabilityKey = (typeof AVAILABILITY_KEYS)[number];

function assertKeySets(
    label: string,
    expected: readonly string[],
    actual: readonly { key: string }[],
): void {
    const actualKeys = new Set(actual.map((x) => x.key));
    const missing = expected.filter((k) => !actualKeys.has(k));
    const extra = actual.map((x) => x.key).filter((k) => !expected.includes(k));
    if (missing.length || extra.length) {
        throw new Error(
            `[content/lookups] ${label}: missing ${missing.join(", ")}, unexpected ${extra.join(", ")}`,
        );
    }
}

export function assertSameEnum(
    label: string,
    fromSchema: readonly string[],
    expected: readonly string[],
): void {
    const missing = expected.filter((k) => !fromSchema.includes(k));
    const extra = fromSchema.filter((k) => !expected.includes(k));
    if (missing.length || extra.length) {
        throw new Error(
            `[schema] ${label}: schema missing ${missing.join(", ")}, schema has unexpected ${extra.join(", ")}`,
        );
    }
}

assertKeySets("materials", MATERIAL_KEYS, materials.materials);
assertKeySets(
    "materialGroups",
    MATERIAL_GROUP_KEYS,
    materialGroups.materialGroups,
);
assertKeySets("availability", AVAILABILITY_KEYS, availability.availability);

assertSameEnum(
    "materials.schema.json materialKey",
    materialsSchema.$defs.materialKey.enum,
    MATERIAL_KEYS,
);
assertSameEnum(
    "material-groups.schema.json materialGroupKey",
    materialGroupSchema.$defs.materialGroupKey.enum,
    MATERIAL_GROUP_KEYS,
);
assertSameEnum(
    "availability.schema.json availabilityKey",
    availabilitySchema.$defs.availabilityKey.enum,
    AVAILABILITY_KEYS,
);

const materialsByKey = Object.fromEntries(
    materials.materials.map((m) => [m.key, m]),
) as unknown as Record<
    MaterialKey,
    { group: MaterialGroup; label: { de: string; en: string } }
>;

export const MATERIAL_GROUP_LABELS = Object.fromEntries(
    materialGroups.materialGroups.map((g) => [g.key, g.label]),
) as unknown as Record<MaterialGroup, { de: string; en: string }>;

export const MATERIAL_GROUP_MAP: Record<MaterialKey, MaterialGroup> =
    Object.fromEntries(
        materials.materials.map((m) => [m.key, m.group]),
    ) as unknown as Record<MaterialKey, MaterialGroup>;

const availabilityByKey = Object.fromEntries(
    availability.availability.map((a) => [a.key, a.label]),
) as unknown as Record<AvailabilityKey, { de: string; en: string }>;

export function getMaterialLabel(key: MaterialKey, lang: Lang): string {
    return materialsByKey[key].label[lang];
}

export function getAvailabilityLabel(key: AvailabilityKey, lang: Lang): string {
    return availabilityByKey[key][lang];
}
