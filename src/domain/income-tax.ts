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
 * computed from the taxpayer's circumstances.
 */
export function calculateIncomeTax(
  grossAnnual: number,
  socialSecurity: number,
  personalAndFamilyMinimum: number,
  parameters: TaxParameters,
): IncomeTaxBreakdown {
  const { incomeTaxScale, deductibleExpenses } = parameters;

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

  // Two-quota method: the personal and family minimum does not shrink the base,
  // it subtracts the quota that would correspond to its bracket.
  const baseQuota = applyScale(taxableBase, incomeTaxScale);
  const minimumQuota = applyScale(
    Math.min(taxableBase, personalAndFamilyMinimum),
    incomeTaxScale,
  );
  const taxDue = Math.max(0, baseQuota - minimumQuota);

  const withholdingRate = grossAnnual > 0 ? taxDue / grossAnnual : 0;

  return {
    netIncomeBeforeReduction,
    earnedIncomeReduction: reduction,
    taxableBase,
    personalAndFamilyMinimum,
    taxDue,
    withholdingRate,
    annualWithholding: taxDue,
  };
}
