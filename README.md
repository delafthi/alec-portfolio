# ALEC Portfolio

The public website of the painter ALEC, in German and English. It covers the
studio's work: a portfolio of paintings with titles, materials, formats, and
availability, an exhibition history, a short biography, and a way to get in
touch.

Under the hood it is a static Astro site deployed to Netlify. Content lives
in this repo as JSON files validated against schemas, so a change to a
painting's data ships through a normal commit and rebuild. That also means
the repo contains the site around the work, not rights to the work itself;
the paintings stay © ALEC (see [License](#license)).

## Development

```sh
direnv reload   # load Nix shell (provides pnpm, biome, etc.)
pnpm install
pnpm dev        # http://localhost:4321
```

## Content

Structured collections (artworks, exhibitions, tags, settings) live in
`src/content/` as JSON files; only the about page remains Markdown.

```text
src/content/
  artworks/*.json          — paintings
  exhibitions/*.json       — exhibitions
  tags/*.json              — tags
  lookups/                 — shared translations
    materials.json             material keys, groups, labels
    material-groups.json       material group labels
    availability.json          availability labels
  schemas/                 — JSON Schemas for validation
    artwork.schema.json        + localized, tag-id
    exhibition.schema.json
    lookups/*.schema.json      per-lookup schemas
  pages/{de,en}/about.md   — about page (singleton, prose)
  settings/contact.json    — public contact email
```

Bilingual fields are nested objects, e.g. artwork `title` is
`{ "en": "Kingfisher", "de": "Eisvogel" }`.

Artwork and exhibition files carry a `$schema` pointer to their JSON Schema
(`src/content/schemas/`), which constrains `materials`, `availability`, and
`tags` to the key lists in `src/content/lookups/` and `src/content/tags/`.
Field keys are the fixed contract in `src/lib/lookups.ts`; labels come from
`src/content/lookups/`. `lookups.ts` validates at build time that the data
keys, the schema enums, and the TS key unions all agree.

Artwork images live in `src/assets/artworks/` and are referenced by relative
path in each artwork's `image` field.

## Languages

- English (`/en/`) and German (`/de/`) — both URL-prefixed, English is the
  default
- Root `/` redirects to the default locale (`/en/`) via Astro i18n
  (`redirectToDefaultLocale`)
- Translation strings live in `src/i18n/ui.ts`

## CI / GitHub Actions

| Workflow | Trigger | What it does |
|---|---|---|
| `format.yml` | push / PR | `nix fmt -- --ci` — treefmt format check |
| `check.yml` | push / PR | `pnpm check` — astro check + biome |
| `build.yml` | push / PR | `pnpm check` + Astro static build |
| `auto-merge.yml` | PR labeled `auto-merge` | enables auto-merge for dependency PRs |
| `update-flake.yml` | Mon 2:00 UTC / manual | `nix flake update`, opens PR labeled `auto-merge` + `dependencies` |
| `update-npm.yml` | after flake update / manual | `pnpm update`, opens PR labeled `auto-merge` + `dependencies` |

## Linting & Formatting

```sh
pnpm fmt      # biome + rumdl + nixfmt + statix + typos + actionlint + tombi
pnpm check    # astro check + biome check
```

## License

Source code is licensed under the MIT License (see [LICENSE](LICENSE)).

Artwork images (`src/assets/artworks/`) are excluded: they
are copyright © ALEC, all rights reserved, and included solely for display on
this site. Reproduction or redistribution requires explicit written permission
from the artist.
