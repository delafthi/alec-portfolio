import fs from "node:fs";
import path from "node:path";
import {
    createPrompter,
    fail,
    loadJson,
    loadTags,
    repoRoot,
    slugify,
    writeJson,
} from "./lib/cli.mjs";

const args = process.argv.slice(2);
const usePrompt = args.includes("--prompt");
const positional = args.filter((arg) => arg !== "--prompt");

if (args.includes("--help")) {
    console.log("Usage: pnpm new-artwork [--prompt] <title> <image-file>");
    process.exit(0);
}
if (positional.length !== 2) {
    fail("Usage: pnpm new-artwork [--prompt] <title> <image-file>");
}

const [title, file] = positional;
if (!fs.existsSync(file)) fail(`File not found: ${file}`);

const slug = slugify(title);
if (!slug) fail(`Cannot derive a slug from title: ${title}`);

const ext = path.extname(file).toLowerCase();
const imageRel = `src/assets/artworks/${slug}${ext}`;
const dataRel = `src/content/artworks/${slug}.json`;
for (const rel of [imageRel, dataRel]) {
    if (fs.existsSync(path.join(repoRoot, rel))) {
        fail(`Already exists: ${rel}`);
    }
}

async function promptForMetadata() {
    const p = createPrompter();
    try {
        const titleDe = await p.ask("Title (de)", title);
        const titleEn = await p.ask("Title (en)", title);
        const year = await p.askInt("Year", { min: 1900, max: 2100 });
        const month = await p.askInt("Month", { min: 1, max: 12 });
        const size = await p.ask("Size (e.g. 70 × 50 cm)");

        const materials = loadJson(
            "src/content/lookups/materials.json",
        ).materials;
        const materialIndex = await p.pick(
            "Materials:",
            materials.map((m) => `${m.label.en} / ${m.label.de} (${m.key})`),
        );

        const availability = loadJson(
            "src/content/lookups/availability.json",
        ).availability;
        const availabilityIndex = await p.pick(
            "Availability:",
            availability.map((a) => `${a.label.en} / ${a.label.de} (${a.key})`),
        );

        const tags = loadTags();
        const tagIndexes = await p.pickMany(
            "Tags:",
            tags.map((t) => `${t.label.en} / ${t.label.de} (${t.id})`),
        );

        const featured = await p.confirm("Featured?");
        const notesDe = await p.ask("Notes (de)");
        const notesEn = await p.ask("Notes (en)");

        return {
            title: { de: titleDe, en: titleEn },
            ...(notesDe || notesEn
                ? { notes: { de: notesDe, en: notesEn } }
                : {}),
            ...(year !== undefined ? { year } : {}),
            ...(month !== undefined ? { month } : {}),
            size,
            materials: materials[materialIndex].key,
            availability: availability[availabilityIndex].key,
            featured,
            tags: tagIndexes.map((i) => tags[i].id),
        };
    } finally {
        p.close();
    }
}

const metadata = usePrompt
    ? await promptForMetadata()
    : {
          title: { de: title, en: title },
          size: "",
          materials: "",
          availability: "",
          featured: false,
          tags: [],
      };

fs.copyFileSync(file, path.join(repoRoot, imageRel));
writeJson(dataRel, {
    $schema: "../schemas/artwork.schema.json",
    title: metadata.title,
    ...(metadata.notes ? { notes: metadata.notes } : {}),
    ...(metadata.year !== undefined ? { year: metadata.year } : {}),
    ...(metadata.month !== undefined ? { month: metadata.month } : {}),
    size: metadata.size,
    materials: metadata.materials,
    availability: metadata.availability,
    image: `../../assets/artworks/${slug}${ext}`,
    featured: metadata.featured,
    tags: metadata.tags,
});

console.log(`Copied ${file} -> ${imageRel}`);
console.log(`Created ${dataRel}`);
if (!usePrompt) {
    console.log("Fill in size, materials, and availability before building.");
}
