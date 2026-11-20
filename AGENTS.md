# AGENTS.md

## Toolchain

- Tooling comes from the Nix flake via direnv (`use flake` in `.envrc`). Run
  `direnv allow` / `direnv reload` first; don't use a system `pnpm`/`node`.

## Commands

- `pnpm dev` — dev server on localhost:4321
- `pnpm check` — verification gate: `astro check` + `biome check .`. There is
  no test suite; this plus `pnpm build` is the way to verify changes.
- `pnpm fmt` — `nix fmt` (treefmt: biome, nixfmt, rumdl, statix, typos,
  actionlint, tombi, keep-sorted, deadnix). CI runs `nix fmt -- --ci`.
- `pnpm new-artwork "Titel" image.jpg` / `pnpm new-exhibition "Titel" date` —
  content scaffolding; use these instead of hand-creating files.
- `pnpm audit:site` — Lighthouse via Unlighthouse. Runs against the plain
  static build: Netlify Image CDN URLs 404 locally, so performance scores
  skew low; a11y/SEO/best-practices are the meaningful numbers.

## Content pipeline (build-time validated)

Content is JSON in `src/content/`, validated by Astro content collections
(`src/content.config.ts`). Several things must stay in sync or `pnpm check`
fails at build:

- Material keys: `src/content/lookups/materials.json` ↔ the `enum` in
  `materials.schema.json` ↔ `MATERIAL_KEYS` in `src/lib/lookups.ts`.
- Tag ids: `src/content/tags/*.json` **filenames** ↔ the `enum` in
  `tag-id.schema.json` (checked in `content.config.ts`).
- Availability: `availability.json` ↔ `availability.schema.json` ↔
  `lookups.ts`.

Bilingual fields are `{ "en": ..., "de": ... }`. Type aliases are
`@lib/*`, `@components/*`, `@i18n/*`, etc. (`tsconfig.json`).

## Commit / deploy coupling

`scripts/netlify-ignore.sh` (used by `netlify.toml`) skips Netlify builds
when every new commit matches `^(flake: update|deps: update npm packages|ci:
bump)`. Don't use those prefixes for anything but automated dependency
commits, or a content change could silently skip deploy. Dependency-update
PRs get the `auto-merge` label (see `.github/workflows/`).

## Do not touch

- `src/assets/artworks/` images are © ALEC, not MIT-licensed. Never copy or
  redistribute them outside this repo's deploy.
