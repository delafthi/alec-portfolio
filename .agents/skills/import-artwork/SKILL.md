---
name: import-artwork
description: Batch-import artworks into this portfolio. Use when the user gives artwork descriptions (usually German, e.g. "Apache 70x50 Pastellkreide Okt 2026 fotokarton") with image files, often from ~/Downloads, and asks to "import", "add", or "importieren". Covers image placement, metadata, lookups, validation, and per-artwork commits.
---

# Import artwork

Batch-import artworks described in free-form German into
`src/content/artworks/`. One artwork = one jpg in `src/assets/artworks/` + one
JSON entry, one commit each.

## Core procedure

For the batch:

1. **Locate images.** Paths may be prefixes like `~/Downloads/image-20261117...`
   — glob for candidates. Filenames can contain typos ("Poschavio") that
   disagree with the description ("Poschiavo"): resolve by globbing near the
   date prefix, not by exact name.
2. **Read each image.** Match it to the described artwork (subject, medium).
   Signatures/dates inside the image can fill missing dates (e.g. "ALEC
   1.11.26" → month 11). Confirm subject before choosing tags.
3. **Parse each description** into: title (de), size, year/month, materials,
   availability, notes. German month names → 1–12 (Okt → 10).

Per artwork:

4. **Place files with the house script**, from the repo root:

   ```sh
   pnpm new-artwork "<Title de>" "<image path>"
   ```

   This slugifies the German title and creates `src/assets/artworks/<slug>.jpg`
   - `src/content/artworks/<slug>.json` with a stub to fill in. If the target
   name already exists, the script fails — check for a duplicate import first.
5. **Fill the JSON stub.** Mirror the shape of existing entries, e.g.
   `src/content/artworks/eisvogel.json`. Fields:
   - `size`: dimension strings as `"<h> × <w> cm"` with real `×` and spaces
     ("70x50" → `"70 × 50 cm"`); notebook sketches use `"A5"` (or `"A4"`…).
   - `materials`: a key from `src/content/lookups/materials.json`. If the
     support (e.g. „Halbkarton") has no entry, ask the user before adding one.
     Adding a material requires BOTH `materials.json` and the `enum` in
     `materials.schema.json` — they must stay in sync or `pnpm check` fails.
   - `availability`: `available` | `not_available` (from
     `src/content/lookups/availability.json`).
   - `tags`: only ids of `src/content/tags/*.json` (animals, nature, nude,
     portrait, sketch, anatomy).
   - `notes`: only when warranted — commissions ("Auftragswerk" /
     "Commissioned work"), joint works ("Gemeinschaftswerk mit X" /
     "Joint work with X").
   - `featured`: `false` unless the user asks.
6. **Fill gaps by asking the user once per batch** (not per field): unknown
   sizes/dates, availability, whether a support needs a new material.
   Defaults when the user doesn't answer: sketchbook page → `A5`,
   `pencil_notebook` (or `pastel_chalk_notebook`), `not_available`.
7. **Validate:** `pnpm check` must pass with 0 errors.
8. **Commit one per artwork** (jj only, never git), while all batch changes
   still sit in `@`:

   ```sh
   jj split <json> <jpg> -m 'artwork: add <Title de>'
   ```

   Repeat for each artwork; the last one stays in `@` — just
   `jj describe -m '...'`. Lookup file changes (`materials*.json`) belong to
   the commit of the artwork that introduced the material. Do not push.
9. **Report**: table of created artworks + every assumption and unanswered
   question (guessed size, availability, English title choice), so the user
   can amend.

## Gotchas

- "Notizbuch"/"sketchbook" artwork still gets an image: the user photographs
  the page; the photo is the artwork image.
- Materials are also defined by groups in
  `src/content/lookups/material-groups.json` — leave the group of a new
  material consistent with the others (charcoal supports → `charcoal`).
- The description may be wrong about the file (user wrote "Poschavio"); the
  image content is the source of truth for subject, medium, and date.
- The slug comes from the German title even when the English title differs
  ("Spiegelungen Lago Poschiavo" → `spiegelungen-lago-poschiavo`).
