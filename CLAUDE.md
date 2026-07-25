# CLAUDE.md

Gross → net salary calculator for Spain. Frontend-only (React + TypeScript + Vite).

## Conventions

- **Code in English** (identifiers, comments, commits).
- **Spanish only for web-facing content** (UI strings shown to the user).
- Commits follow Conventional Commits, no AI attribution.

## Layout

- `src/domain/` — pure, tested calculation engine (social security + income tax). No React.
- `src/components/` — UI. Spanish user-facing text lives here.
- `src/lib/format.ts` — euro/percent formatting.

Tax parameters are versioned by year in `src/domain/tax-data.ts`. Updating for a
new year means adding an entry there; the logic does not change.

## Commands

Package manager: **pnpm** (pinned via `packageManager` in `package.json`). Do not
use npm or yarn here — a `package-lock.json` would break the pnpm-only setup.

```bash
pnpm dev        # dev server
pnpm test       # engine tests (Vitest)
pnpm build      # typecheck + production build
```
