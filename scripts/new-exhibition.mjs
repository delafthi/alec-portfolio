import fs from "node:fs";
import path from "node:path";
import {
    createPrompter,
    fail,
    repoRoot,
    slugify,
    writeJson,
} from "./lib/cli.mjs";

const args = process.argv.slice(2);
const usePrompt = args.includes("--prompt");
const positional = args.filter((arg) => arg !== "--prompt");

if (args.includes("--help")) {
    console.log(
        "Usage: pnpm new-exhibition [--prompt] <title> <start-date (YYYY-MM-DD)>",
    );
    process.exit(0);
}
if (positional.length !== 2) {
    fail(
        "Usage: pnpm new-exhibition [--prompt] <title> <start-date (YYYY-MM-DD)>",
    );
}

const [title, startDate] = positional;
if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    fail(`Invalid start date: ${startDate} (expected YYYY-MM-DD)`);
}

const slug = `${slugify(title)}-${startDate.slice(0, 4)}`;
if (!slugify(title)) fail(`Cannot derive a slug from title: ${title}`);

const dataRel = `src/content/exhibitions/${slug}.json`;
if (fs.existsSync(path.join(repoRoot, dataRel))) {
    fail(`Already exists: ${dataRel}`);
}

async function promptForMetadata() {
    const p = createPrompter();
    try {
        const promptedTitle = await p.ask("Title", title);
        const location = await p.ask("Location (street, zip, city)");
        const promptedStartDate = await p.askDate("Start date", startDate);
        const endDate = await p.askDate("End date");
        const link = await p.ask("Link");
        const juried = await p.confirm("Juried?");

        return {
            title: promptedTitle,
            location,
            startDate: promptedStartDate ?? startDate,
            ...(endDate ? { endDate } : {}),
            ...(link ? { link } : {}),
            ...(juried ? { juried } : {}),
        };
    } finally {
        p.close();
    }
}

const metadata = usePrompt
    ? await promptForMetadata()
    : { title, location: "", startDate };

writeJson(dataRel, {
    $schema: "../schemas/exhibition.schema.json",
    title: metadata.title,
    location: metadata.location,
    startDate: metadata.startDate,
    ...(metadata.endDate ? { endDate: metadata.endDate } : {}),
    ...(metadata.link ? { link: metadata.link } : {}),
    ...(metadata.juried ? { juried: metadata.juried } : {}),
});

console.log(`Created ${dataRel}`);
if (!usePrompt) {
    console.log("Fill in location before building.");
}
