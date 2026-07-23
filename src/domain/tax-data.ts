/**
 * Tax data versioned by year.
 *
 * These are public parameters (income-tax brackets, contribution rates, social
 * security caps). To update from one year to the next, just add an entry here;
 * the calculation logic stays the same.
 *
 * Income tax is split into the state scale (same for everyone) and the regional
 * scale of each community (see regional-scales.ts).
 */

import type { TaxParameters } from "./types";
import { REGIONAL_SCALES_2025, REGION_NAMES } from "./regional-scales";

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
  // Escala general estatal (art. 63 LIRPF): the state half, same for everyone.
  stateScale: [
    { upTo: 12450, rate: 0.095 },
    { upTo: 20200, rate: 0.12 },
    { upTo: 35200, rate: 0.15 },
    { upTo: 60000, rate: 0.185 },
    { upTo: 300000, rate: 0.225 },
    { upTo: null, rate: 0.245 },
  ],
  regionalScales: {
    // General reference scale: mirrors the state scale so that state + regional
    // reproduces the aggregate 19/24/30/37/45/47 rates. Used when no community
    // is selected.
    general: [
      { upTo: 12450, rate: 0.095 },
      { upTo: 20200, rate: 0.12 },
      { upTo: 35200, rate: 0.15 },
      { upTo: 60000, rate: 0.185 },
      { upTo: 300000, rate: 0.225 },
      { upTo: null, rate: 0.225 },
    ],
    ...REGIONAL_SCALES_2025,
  },
  familyMinimum: {
    personalBase: 5550,
    ageOver65: 1150,
    ageOver75Extra: 1400,
    disabilityStandard: 3000,
    disabilitySevere: 9000,
    descendant: [2400, 2700, 4000, 4500],
    descendantUnder3Extra: 2800,
  },
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

/** An autonomous community selectable in the UI. */
export interface Region {
  id: string;
  name: string;
}

/**
 * Selectable communities, in display order. The first is the general reference
 * used when the user does not pick a specific community, followed by the 15
 * common-regime communities.
 */
export const REGIONS: Region[] = [
  { id: "general", name: "General (estatal de referencia)" },
  ...REGION_NAMES,
];

/** Default community id. */
export const DEFAULT_REGION = "general";

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
