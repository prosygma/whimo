# CamerTrace fork of `whimo`

This repository is **CamerTrace** (traçabilité du cacao et du café au Cameroun),
a fork of [EuropeanForestInstitute/whimo](https://github.com/EuropeanForestInstitute/whimo)
(MIT licence; keep `LICENCE`/`LICENSE` and EFI's copyright notice).

Two goals drive how it is organised:

1. **Keep pulling EFI's work** with as few conflicts as possible.
2. **Contribute back to EFI** with pull requests that contain *no* CamerTrace
   branding, text or configuration.

## Branches

| Branch | Content | Rule |
|---|---|---|
| `main` | exact copy of `upstream/main` | only `git merge --ff-only upstream/main`, never commit here |
| `camertrace` | `main` + brand overlay + Cameroon features | default branch, the one deployed; receives `main` by **merge** |
| `feat/*`, `fix/*` | generic work, candidate for EFI | branch from **`main`**, PR to EFI, then merge into `camertrace` |
| `cm/*` | Cameroon-only work | branch from **`camertrace`**, PR to `prosygma/whimo:camertrace` |
| `archive/*` | history before this model (2026-09-29) | read-only |

## First time on a new clone

```bash
scripts/fork-setup.sh     # upstream remote, push to EFI disabled, rerere, merge=ours driver
```

## Pulling EFI's changes

```bash
git fetch upstream
git switch main && git merge --ff-only upstream/main && git push origin main
git switch camertrace && git merge main          # resolve, build, test
git push origin camertrace
```

`rerere` replays conflict resolutions you already made once. Binary brand files
listed in `.gitattributes` with `merge=ours` always keep the CamerTrace version.
Text brand files (theme, config) are **not** auto-resolved on purpose: when EFI
adds a new token or key, you want to see it and give it a CamerTrace value.

## Sending a change to EFI

```bash
git switch -c feat/my-change main     # from main, NOT from camertrace
# ... work, commit (English, generic wording, EFI's defaults) ...
scripts/check-upstream-clean.sh feat/my-change
git push origin feat/my-change        # open the PR on GitHub: base = EFI main
git switch camertrace && git merge feat/my-change
```

Rules for an upstream-bound change:

- never mention CamerTrace, CICC, prosygma, `camertrace.cm`;
- new user-visible text: add the key to EFI's locale files (en, and fr/es when
  you can) with neutral wording; CamerTrace wording goes in the brand overlay;
- new colour, logo or name: add it to the brand layer with EFI's value as the
  default, then give it the CamerTrace value on `camertrace` only.

`check-upstream-clean.sh` fails on the words in `.fork/forbidden-words` and
warns about paths in `.fork/brand-paths`.

## Where the CamerTrace brand lives

Everything that identifies the product is in **`src/brand/`**; components only
use its semantic tokens, never raw colours or names.

| File | Holds |
|---|---|
| `src/brand/brand.config.json` | name, tagline and hero text (fr/en/es), HTML title, theme colour, web fonts, contact e-mail |
| `src/brand/theme.css` | colour tokens (`primary`, `surface-dark`, `nav-*`, `hero-*`, `accent`) and fonts |
| `src/brand/assets/` | `hero-logo`, `sidebar-logo` (picked up by file name), `logo-horizontal` |
| `public/` | favicons, PWA icons, `manifest.webmanifest`, share image, robots/sitemap |
| `index.html` | SEO metadata; title/fonts/theme colour come from `brand.config.json` |

`src/brand/`, the `%BRAND_*%` placeholders and the semantic tokens come from
the generic `feat/white-label` branch, which is the first candidate PR for EFI.
Status and chart colours (traceability scale…) are NOT brand colours and stay
as EFI defines them (`src/index.css`, `src/constants/chartColors.ts`).

Brand sources (logos, graphic chart, export scripts) are outside the repo, in
`Documents/whimo/logos/camertrace-cicc/` (`charte-graphique.html`,
`render.sh`, `declinaisons/`).
