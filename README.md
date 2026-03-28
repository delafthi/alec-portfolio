# ALEC Portfolio

Portfolio website for the painter ALEC

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Astro 5 |
| Styling | Tailwind CSS v4 |
| CMS | Decap CMS (browser UI at `/admin`) |
| Hosting | Netlify (auto-deploy on push) |
| CMS auth | Netlify Identity |
| Contact form | Netlify Forms |
| Package manager | Bun |
| Dev environment | Nix flake |

## Development

```sh
direnv reload   # load Nix shell (provides bun, biome, etc.)
bun install
bun dev         # http://localhost:4321
```

To test the CMS locally, run `bunx decap-server` in a second terminal and add
`local_backend: true` at the top of `public/admin/config.yml`. Remove it before
committing.

## Content

All content lives in `src/content/` as Markdown files with YAML frontmatter.

```text
src/content/
  artworks/{de,en}/*.md     — paintings (same slug in both languages)
  exhibitions/{de,en}/*.md  — exhibitions
  pages/about-{de,en}.md   — about page (singleton)
  settings/contact.md       — public contact email
```

Images are stored under `public/images/` and served as static files by Netlify.

## Languages

- German (`/de/`) and English (`/en/`) — both URL-prefixed
- Root `/` redirects by browser language via Netlify redirect rules
- Translation strings live in `src/i18n/ui.ts`

## CI / GitHub Actions

| Workflow | Trigger | What it does |
|---|---|---|
| `format.yml` | push / PR | `nix fmt` — treefmt format check |
| `check.yml` | push / PR | `bun check` — biome + stylelint |
| `build.yml` | push / PR | Astro static build |
| `automerge.yml` | PR opened | enables auto-merge on `cms/*` and `chore/*` PRs |
| `update-flake.yml` | Mon 4:00 UTC / manual | `nix flake update`, opens PR on `chore/flake-update` |
| `update-npm.yml` | after flake update / manual | `bun update`, opens PR on `chore/npm-update` |

## Linting & formatting

```sh
bun fmt      # nix fmt — treefmt: biome + rumdl + nixfmt + deadnix + statix
bun check    # biome check + stylelint
```
