# salario-neto

Gross → net salary calculator for Spain. Enter your annual gross and get the
monthly net, with a Social Security and income-tax (IRPF) breakdown — plus what
the job costs the employer.

**Live demo:** https://salario-neto-phi.vercel.app/

Frontend-only: the whole calculation runs in the browser.

## Stack

React · TypeScript · Vite · Vitest

## Structure

The calculation engine lives in `src/domain/` as pure, tested functions,
separate from the UI. Tax parameters are versioned by year in `tax-data.ts`.

## Commands

```bash
pnpm install
pnpm dev        # dev server
pnpm test       # engine tests
pnpm build      # production build
```

Pushing to `main` deploys to production on Vercel.

## Scope

Approximation. Applies the state IRPF scale plus the regional scale of each of
the 15 common-regime communities, and covers personal circumstances (children,
age, disability) through the personal and family minimum. On the employer side
it adds the company's social security contributions to get the total cost of the
job, with AT/EP estimated at 1.5% (the real rate depends on the activity).

Caveats: 2025 is the last year with confirmed figures — 2026 carries over the
2025 scales, minimums and contribution cap, and only updates the MEI, which the
UI flags. Does not cover País Vasco / Navarra (foral regime), the solidarity
contribution on pay above the contribution cap, or the tax agency's exact
withholding adjustments. Estimates, not a payslip.
