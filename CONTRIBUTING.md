# Contributing to CamerTrace (web app)

CamerTrace is the cocoa and coffee traceability platform of the CICC (Conseil Interprofessionnel
du Cacao et du Café, Cameroon). It is a fork of [WHIMO](https://github.com/EuropeanForestInstitute/whimo)
by the European Forest Institute (EFI), under the MIT licence.

Thank you for helping. This page explains where to send a change and what we check before
merging. [`FORK.md`](FORK.md) explains the branch model in more detail.

## Branches

| Branch | What it holds |
|---|---|
| `main` | An exact copy of EFI's `main`. Nobody commits here. |
| `camertrace` | `main` plus the CamerTrace brand and the Cameroon features. This is the default branch and what is deployed. |
| `feat/*`, `fix/*` | Generic work that every WHIMO deployment could use. Starts from `main`. |
| `cm/*` | Cameroon-only work. Starts from `camertrace`. |
| `archive/*` | Old history, read-only. |

## Where to send your change

1. **Is it useful to every WHIMO deployment?** (a bug fix, a generic feature)
   Branch from `main` as `feat/<topic>` or `fix/<topic>`.
   - Prefer opening the pull request **at EFI**: `EuropeanForestInstitute/whimo`, base `main`.
     CamerTrace gets it at the next EFI sync.
   - If CamerTrace needs it sooner, open a second pull request from the same branch against
     `camertrace` here, and mention the EFI one.
2. **Is it only for CamerTrace or Cameroon?** (CICC rules, wording, brand, local integrations)
   Branch from `camertrace` as `cm/<topic>` and open the pull request against `camertrace` here.

Work on your own fork and open pull requests from it. Keep each pull request to one topic.

### First time on a clone

```bash
git remote add upstream https://github.com/EuropeanForestInstitute/whimo.git
scripts/fork-setup.sh   # disables push to EFI, enables rerere and the merge=ours driver
```

## Rules for every change

- **Brand values live in the brand layer only.** For the web that is `src/brand/` (`brand.config.json`, `theme.css`, `assets/`) and `public/` icons.
  Components use semantic names (`primary`, `surface-dark`, …), never CamerTrace colours or names.
- **Status colours are not brand colours.** Traceability and transaction status colours stay
  EFI's values.
- **Text.** New text for a generic feature goes into EFI's locale files, with neutral wording.
  CamerTrace wording goes into the brand layer. Give at least English and French.
- **No secrets and no real personal data**, in code, tests, fixtures, screenshots, or issues.
  A CICC card identifies a farmer: use made-up values shaped like real ones. See [`SECURITY.md`](SECURITY.md).
- **Generic branches must stay clean.** Before opening a `feat/*` or `fix/*` pull request, run:

  ```bash
  git fetch upstream
  scripts/check-upstream-clean.sh <your-branch>
  ```

  It fails if the branch adds a CamerTrace-specific word, and warns if it touches brand files.
  CI runs it too.
- **Commits.** Write a short imperative summary (about 72 characters at most), and say *why* in
  the body. Don't mix formatting changes with real changes.

## Develop and test

Requirements: Node.js 22 (20 works) and npm.

```bash
npm ci
cp .env.local.example .env.local   # point VITE_API_URL at a backend (a local one: see whimo-backend)
npm run dev                         # dev server on the port of VITE_BASE_URL
npm run lint
npm run build                       # type-check and production build
```

- Colours come from Tailwind tokens defined in `src/brand/theme.css`. `theme-reset.css` clears
  Tailwind's palette, so a class that names a missing token produces **no CSS and no warning**:
  check the page, not only the build.
- `vite build` refuses a missing or placeholder `VITE_GOOGLE_CLIENT_ID` or a missing `VITE_BASE_URL`.
- Translations are in `public/locales/<lang>/`.

CI runs the same checks on every pull request. A pull request needs a passing CI and an approval
from a maintainer (`CODEOWNERS`) before it is merged.

## Licence

By contributing, you agree that your contribution is released under the [MIT licence](LICENCE)
of this repository.
