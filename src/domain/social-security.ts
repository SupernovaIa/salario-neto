import type {
  EmployerCostBreakdown,
  SalaryInput,
  SocialSecurityBreakdown,
  TaxParameters,
} from "./types";

/**
 * Calculates the employee's annual social security contribution.
 *
 * The contribution base is capped at the maximum base: above it there are no
 * further contributions (in this simplified model the MEI is capped too).
 */
export function calculateSocialSecurity(
  input: SalaryInput,
  parameters: TaxParameters,
): SocialSecurityBreakdown {
  const { contribution, maxContributionBaseAnnual } = parameters;

  const contributionBase = Math.min(
    input.grossAnnual,
    maxContributionBaseAnnual,
  );

  const unemploymentRate =
    input.contractType === "temporary"
      ? contribution.unemploymentTemporary
      : contribution.unemploymentPermanent;

  const commonContingencies =
    contributionBase * contribution.commonContingencies;
  const unemployment = contributionBase * unemploymentRate;
  const vocationalTraining =
    contributionBase * contribution.vocationalTraining;
  const mei = contributionBase * contribution.mei;

  const total = commonContingencies + unemployment + vocationalTraining + mei;

  return {
    contributionBase,
    commonContingencies,
    unemployment,
    vocationalTraining,
    mei,
    total,
  };
}

/**
 * Calculates what the job costs the employer: gross salary plus the employer's
 * social security contributions.
 *
 * Same capped base as the employee's contribution. The AT/EP rate is a single
 * estimate (see `EmployerContributionRates.occupationalRisk`), and the
 * solidarity contribution on pay above the maximum base is left out, in line
 * with the rest of this simplified model.
 */
export function calculateEmployerCost(
  input: SalaryInput,
  parameters: TaxParameters,
): EmployerCostBreakdown {
  const { employerContribution: rates, maxContributionBaseAnnual } = parameters;

  const grossAnnual = Math.max(0, input.grossAnnual);
  const contributionBase = Math.min(grossAnnual, maxContributionBaseAnnual);

  const unemploymentRate =
    input.contractType === "temporary"
      ? rates.unemploymentTemporary
      : rates.unemploymentPermanent;

  const commonContingencies = contributionBase * rates.commonContingencies;
  const unemployment = contributionBase * unemploymentRate;
  const wageGuaranteeFund = contributionBase * rates.wageGuaranteeFund;
  const vocationalTraining = contributionBase * rates.vocationalTraining;
  const mei = contributionBase * rates.mei;
  const occupationalRisk = contributionBase * rates.occupationalRisk;

  const total =
    commonContingencies +
    unemployment +
    wageGuaranteeFund +
    vocationalTraining +
    mei +
    occupationalRisk;

  return {
    contributionBase,
    commonContingencies,
    unemployment,
    wageGuaranteeFund,
    vocationalTraining,
    mei,
    occupationalRisk,
    total,
    totalCost: grossAnnual + total,
    overheadRate: grossAnnual > 0 ? total / grossAnnual : 0,
  };
}
