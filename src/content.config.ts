import { defineCollection, type SchemaContext, z } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import { glob } from "astro/loaders";
import tagIdSchema from "./content/schemas/tag-id.schema.json";
import {
    AVAILABILITY_KEYS,
    assertSameEnum,
    MATERIAL_KEYS,
} from "./lib/lookups";

const tagDir = path.join(process.cwd(), "src/content/tags");
const tagIds = fs
    .readdirSync(tagDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
assertSameEnum("tag-id.schema.json", tagIdSchema.enum, tagIds);
const TAG_IDS = tagIds as [string, ...string[]];

const localized = z.object({ en: z.string(), de: z.string() });

const artworkSchema = ({ image }: SchemaContext) =>
    z.object({
        title: localized,
        notes: localized.optional(),
        year: z.number().optional(),
        month: z.number().int().min(1).max(12).optional(),
        size: z.string(),
        materials: z.enum(MATERIAL_KEYS),
        availability: z.enum(AVAILABILITY_KEYS),
        image: image(),
        featured: z.boolean().default(false),
        tags: z.array(z.enum(TAG_IDS)).default([]),
    });

const exhibitionSchema = z.object({
    title: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    link: z.string().optional(),
    juried: z.boolean().default(false),
});

const tagSchema = z.object({
    label: localized,
});

export const collections = {
    artworks: defineCollection({
        loader: glob({ pattern: "*.json", base: "./src/content/artworks" }),
        schema: artworkSchema,
    }),
    tags: defineCollection({
        loader: glob({ pattern: "*.json", base: "./src/content/tags" }),
        schema: tagSchema,
    }),
    exhibitions: defineCollection({
        loader: glob({ pattern: "*.json", base: "./src/content/exhibitions" }),
        schema: exhibitionSchema,
    }),
    pages: defineCollection({
        loader: glob({ pattern: "{de,en}/*.md", base: "./src/content/pages" }),
        schema: z.object({ title: z.string() }),
    }),
    settings: defineCollection({
        loader: glob({ pattern: "*.json", base: "./src/content/settings" }),
        schema: z.object({
            email: z.string().email().optional(),
        }),
    }),
};
