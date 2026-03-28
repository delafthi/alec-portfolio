import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const artworkSchema = z.object({
  title: z.string(),
  category: z.enum(["landschaften", "portraits", "tiere", "akt", "diverse"]),
  date: z.coerce.date(),
  size: z.string(),
  materials: z.string(),
  notes: z.string().optional(),
  availability: z.enum(["available", "sold", "not_for_sale"]),
  image: z.string(),
  featured: z.boolean().default(false),
});

const exhibitionSchema = z.object({
  title: z.string(),
  venue: z.string(),
  city: z.string(),
  date_start: z.coerce.date(),
  date_end: z.coerce.date(),
  type: z.enum(["solo", "gruppe"]),
  url: z.string().optional(),
  description: z.string().optional(),
});

export const collections = {
  "artworks-de": defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/artworks/de" }),
    schema: artworkSchema,
  }),
  "artworks-en": defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/artworks/en" }),
    schema: artworkSchema,
  }),
  "exhibitions-de": defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/exhibitions/de" }),
    schema: exhibitionSchema,
  }),
  "exhibitions-en": defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/exhibitions/en" }),
    schema: exhibitionSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: "about-*.md", base: "./src/content/pages" }),
    schema: z.object({
      title: z.string(),
    }),
  }),
  settings: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/settings" }),
    schema: z.object({
      email: z.string(),
    }),
  }),
};
