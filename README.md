# salario-neto

Gross → net salary calculator for Spain. Enter your annual gross and get the
monthly net, with a Social Security and income-tax (IRPF) breakdown.

Frontend-only: the whole calculation runs in the browser.

## Stack

React · TypeScript · Vite · Vitest

## Structure

The calculation engine lives in `src/domain/` as pure, tested functions,
separate from the UI. Tax parameters are versioned by year in `tax-data.ts`.

## Commands

```bash
npm install
npm run dev     # dev server
npm test        # engine tests
npm run build   # production build
```

## Scope

Approximation using the general IRPF scale. Covers personal circumstances
(children, age, disability) via the personal and family minimum, but not yet the
regional scale or the tax agency's exact withholding adjustments. Estimates, not
a payslip.
