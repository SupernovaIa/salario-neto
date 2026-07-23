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

```bash
npm run dev     # dev server
npm test        # engine tests (Vitest)
npm run build   # typecheck + production build
```
