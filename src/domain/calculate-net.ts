import { calculateFamilyMinimum } from "./family-minimum";
import { calculateIncomeTax } from "./income-tax";
import { calculateSocialSecurity } from "./social-security";
import { parametersFor } from "./tax-data";
import type { SalaryInput, Result } from "./types";

/**
 * Calculates net salary from gross.
 *
 * Engine entry point: orchestrates the social security contribution and the
 * income-tax withholding, then splits the net annual amount across the number
 * of payments.
 *
 * NOTE: this is an approximation. It does not account for the regional tax
 * scale or the tax agency's exact withholding adjustments. It is meant to
 * estimate, not to match a payslip to the cent.
 */
export function calculateNet(input: SalaryInput): Result {
  const parameters = parametersFor(input.year);
  const grossAnnual = Math.max(0, input.grossAnnual);

  const socialSecurity = calculateSocialSecurity(
    { ...input, grossAnnual },
    parameters,
  );

  const personalAndFamilyMinimum = calculateFamilyMinimum(
    input.personal,
    parameters,
  );

  const incomeTax = calculateIncomeTax(
    grossAnnual,
    socialSecurity.total,
    personalAndFamilyMinimum,
    parameters,
  );

  const netAnnual =
    grossAnnual - socialSecurity.total - incomeTax.annualWithholding;

  return {
    grossAnnual,
    grossMonthly: grossAnnual / input.payments,
    socialSecurity,
    incomeTax,
    netAnnual,
    netMonthly: netAnnual / input.payments,
    effectiveNetRate: grossAnnual > 0 ? netAnnual / grossAnnual : 0,
  };
}
