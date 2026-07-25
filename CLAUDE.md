# CLAUDE.md

Gross → net salary calculator for Spain. Frontend-only (React + TypeScript + Vite).

## Conventions

- **Code in English** (identifiers, comments, commits).
- **Spanish only for web-facing content** (UI strings shown to the user).
- Commits follow Conventional Commits, no AI attribution.

## Layout

- `src/domain/` — pure, tested calculation engine (social security + income tax
  + employer cost). No React, no DOM.
- `src/components/` — UI. Spanish user-facing text lives here.
- `src/lib/format.ts` — euro/percent formatting (`es-ES` via `Intl`).
- `src/lib/theme.ts` — light/dark preference, persisted in `localStorage`.
- `src/lib/type-ahead.ts` — letter-jump matching for the community listbox.

Tests live next to what they cover, in `__tests__/` (Vitest): the engine in
`src/domain/`, pure UI helpers in `src/lib/`. There are no component tests —
instead, logic that deserves testing gets pulled out of the component into a
pure module, which is why `type-ahead.ts` exists.

Tax parameters are versioned by year in `src/domain/tax-data.ts`. Updating for a
new year means adding an entry there; the logic does not change.

## Deliberate simplifications

These are decisions, not oversights — don't "fix" them without asking:

- Contributions are computed on the **capped** contribution base; the solidarity
  contribution on pay above that cap (in force since 2025) is not applied, for
  the employee or the employer.
- The employer's AT/EP rate is a single 1.5% estimate. The real one comes from
  the yearly premium table and depends on the activity (CNAE), from 1% for
  office work to 6.7% for construction.
- Withholding is the annual figure from the two-quota method, without the tax
  agency's mid-year regularisations.
- **2026 is provisional**: only the MEI is confirmed, everything else is carried
  over from 2025. `TaxParameters.provisional` flags this and the UI surfaces it
  (year selector and a footer note). Clear the flag once nothing is inherited.
- País Vasco and Navarra are out of scope (foral regime, their own income tax).

## Commands

Package manager: **pnpm** (pinned via `packageManager` in `package.json`). Do not
use npm or yarn here — a `package-lock.json` would break the pnpm-only setup.
pnpm settings live in `pnpm-workspace.yaml`, not in `package.json`.

```bash
pnpm dev        # dev server
pnpm test       # engine tests (Vitest)
pnpm build      # typecheck + production build
```

## Releases

Pushing to `main` deploys to production on Vercel automatically (no workflow
file; Vercel's Git integration builds with pnpm). A release is: bump the version
in `package.json`, commit as `chore: release vX.Y.Z`, then an annotated tag with
a short summary in its message.
