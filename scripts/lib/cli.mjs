import fs from "node:fs";
import path from "node:path";
import * as readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const UMLAUTS = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss",
};

export function slugify(text) {
    return text
        .split("")
        .map((c) => UMLAUTS[c] ?? c)
        .join("")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function fail(message) {
    console.error(`Error: ${message}`);
    process.exit(1);
}

export function loadJson(rel) {
    return JSON.parse(fs.readFileSync(path.join(repoRoot, rel), "utf8"));
}

export function loadTags() {
    const dir = path.join(repoRoot, "src/content/tags");
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .map((f) => ({
            id: f.replace(/\.json$/, ""),
            label: loadJson(path.join("src/content/tags", f)).label,
        }));
}

export function writeJson(rel, data) {
    fs.writeFileSync(
        path.join(repoRoot, rel),
        `${JSON.stringify(data, null, 2)}\n`,
    );
}

export function createPrompter() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    const lines = rl[Symbol.asyncIterator]();

    async function readLine(promptText) {
        process.stdout.write(promptText);
        const { value, done } = await lines.next();
        if (done) fail("Unexpected end of input.");
        return value.trim();
    }

    async function ask(label, fallback) {
        const hint = fallback ? ` (${fallback})` : "";
        const answer = await readLine(`${label}${hint}: `);
        return answer || fallback || "";
    }

    async function askInt(label, { min, max } = {}) {
        for (;;) {
            const answer = await ask(label);
            if (answer === "") return undefined;
            if (/^\d+$/.test(answer)) {
                const n = Number.parseInt(answer, 10);
                if (
                    (min === undefined || n >= min) &&
                    (max === undefined || n <= max)
                ) {
                    return n;
                }
            }
            const range =
                min !== undefined && max !== undefined
                    ? ` between ${min} and ${max}`
                    : "";
            console.log(`Please enter a number${range}.`);
        }
    }

    async function askDate(label, fallback) {
        for (;;) {
            const answer = await ask(label, fallback);
            if (answer === "") return undefined;
            if (/^\d{4}-\d{2}-\d{2}$/.test(answer)) return answer;
            console.log("Please enter a date as YYYY-MM-DD.");
        }
    }

    function printOptions(options) {
        for (const [i, option] of options.entries()) {
            console.log(`  ${i + 1}) ${option}`);
        }
    }

    async function pick(label, options, fallbackIndex = 0) {
        console.log(label);
        printOptions(options);
        for (;;) {
            const answer = await ask(
                `Choose 1-${options.length}`,
                String(fallbackIndex + 1),
            );
            const n = Number.parseInt(answer, 10);
            if (n >= 1 && n <= options.length) return n - 1;
            console.log("Invalid choice.");
        }
    }

    async function pickMany(label, options) {
        console.log(label);
        printOptions(options);
        for (;;) {
            const answer = await ask(
                "Choose numbers (comma-separated, empty for none)",
            );
            if (answer === "") return [];
            const indexes = answer.split(",").map((token) => {
                const n = Number.parseInt(token.trim(), 10);
                return n >= 1 && n <= options.length ? n - 1 : -1;
            });
            if (indexes.every((i) => i >= 0)) return [...new Set(indexes)];
            console.log("Invalid choice.");
        }
    }

    async function confirm(label, fallback = false) {
        const hint = fallback ? " (Y/n)" : " (y/N)";
        const answer = (await readLine(`${label}${hint}: `)).toLowerCase();
        if (answer === "") return fallback;
        return answer === "y" || answer === "yes";
    }

    return {
        ask,
        askInt,
        askDate,
        pick,
        pickMany,
        confirm,
        close: () => rl.close(),
    };
}
