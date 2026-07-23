import { applyScale } from "./scale";
import type { IncomeTaxBreakdown, TaxParameters } from "./types";

/**
 * Earned-income reduction (art. 20 LIRPF).
 *
 * - Net income before reduction <= lower limit => full reduction.
 * - Between the lower and upper limits => linearly decreasing reduction.
 * - Above the upper limit => 0.
 */
export function earnedIncomeReduction(
  netIncomeBeforeReduction: number,
  parameters: TaxParameters,
): number {
  const { lowerLimit, upperLimit, maxReduction, coefficient } =
    parameters.earnedIncomeReduction;

  if (netIncomeBeforeReduction <= lowerLimit) return maxReduction;
  if (netIncomeBeforeReduction > upperLimit) return 0;

  const reduction =
    maxReduction - coefficient * (netIncomeBeforeReduction - lowerLimit);
  return Math.max(0, reduction);
}

/**
 * Calculates the annual income-tax withholding.
 *
 * Uses the two-quota method the tax agency applies: the scale is applied to the
 * full taxable base and the quota for the personal allowance is subtracted (so
 * the allowance is effectively taxed at 0% while progressivity is preserved).
 *
 * `socialSecurity` is the employee's annual contribution, a deductible expense
 * of earned income. `personalAndFamilyMinimum` is the amount taxed at 0%,
 * computed from the taxpayer's circumstances. The total tax is the state half
 * plus the regional half of the chosen community.
 */
export function calculateIncomeTax(
  grossAnnual: number,
  socialSecurity: number,
  personalAndFamilyMinimum: number,
  region: string,
  parameters: TaxParameters,
): IncomeTaxBreakdown {
  const { stateScale, regionalScales, deductibleExpenses } = parameters;
  // Fall back to the general reference scale if the region is unknown.
  const regionalScale = regionalScales[region] ?? regionalScales.general;

  // Net income before reduction = income - deductible expenses - contributions.
  const netIncomeBeforeReduction = Math.max(
    0,
    grossAnnual - socialSecurity - deductibleExpenses,
  );

  const reduction = earnedIncomeReduction(
    netIncomeBeforeReduction,
    parameters,
  );

  const taxableBase = Math.max(0, netIncomeBeforeReduction - reduction);

  // Two-quota method, applied to each scale: the personal and family minimum
  // does not shrink the base, it subtracts the quota of its own bracket.
  const cappedMinimum = Math.min(taxableBase, personalAndFamilyMinimum);
  const quota = (scale: typeof stateScale) =>
    Math.max(
      0,
      applyScale(taxableBase, scale) - applyScale(cappedMinimum, scale),
    );

  const stateTax = quota(stateScale);
  const regionalTax = quota(regionalScale);
  const taxDue = stateTax + regionalTax;

  const withholdingRate = grossAnnual > 0 ? taxDue / grossAnnual : 0;

  return {
    netIncomeBeforeReduction,
    earnedIncomeReduction: reduction,
    taxableBase,
    personalAndFamilyMinimum,
    stateTax,
    regionalTax,
    taxDue,
    withholdingRate,
    annualWithholding: taxDue,
  };
}
