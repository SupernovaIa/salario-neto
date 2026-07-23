/**
 * Tax data versioned by year.
 *
 * These are public parameters (income-tax brackets, contribution rates, social
 * security caps). To update from one year to the next, just add an entry here;
 * the calculation logic stays the same.
 *
 * The income-tax scale is the general reference scale (state + regional band
 * matching the state one). v2 will replace it with each region's own scale.
 */

import type { TaxParameters } from "./types";

const PARAMETERS_2025: TaxParameters = {
  year: 2025,
  // Maximum contribution base: €4,909.50/month × 12.
  maxContributionBaseAnnual: 4909.5 * 12,
  contribution: {
    commonContingencies: 0.047, // 4.70%
    unemploymentPermanent: 0.0155, // 1.55%
    unemploymentTemporary: 0.016, // 1.60%
    vocationalTraining: 0.001, // 0.10%
    mei: 0.0013, // 0.13% (employee share in 2025)
  },
  incomeTaxScale: [
    { upTo: 12450, rate: 0.19 },
    { upTo: 20200, rate: 0.24 },
    { upTo: 35200, rate: 0.3 },
    { upTo: 60000, rate: 0.37 },
    { upTo: 300000, rate: 0.45 },
    { upTo: null, rate: 0.47 },
  ],
  personalAllowance: 5550,
  deductibleExpenses: 2000,
  earnedIncomeReduction: {
    lowerLimit: 14852,
    upperLimit: 19747.5,
    maxReduction: 7302,
    coefficient: 1.75,
  },
};

const PARAMETERS_2026: TaxParameters = {
  ...PARAMETERS_2025,
  year: 2026,
  // The employee MEI share rises 0.02 points each year until 2029.
  contribution: {
    ...PARAMETERS_2025.contribution,
    mei: 0.0015, // 0.15% in 2026
  },
};

const PARAMETERS_BY_YEAR: Record<number, TaxParameters> = {
  2025: PARAMETERS_2025,
  2026: PARAMETERS_2026,
};

/** Most recent year with available parameters (used as the default). */
export const DEFAULT_YEAR = 2026;

/** Available years, newest first. */
export const AVAILABLE_YEARS = Object.keys(PARAMETERS_BY_YEAR)
  .map(Number)
  .sort((a, b) => b - a);

/**
 * Returns the tax parameters for a year. Falls back to the most recent year
 * available if the requested one does not exist.
 */
export function parametersFor(year: number): TaxParameters {
  return PARAMETERS_BY_YEAR[year] ?? PARAMETERS_BY_YEAR[DEFAULT_YEAR];
}
