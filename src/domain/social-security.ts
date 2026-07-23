import type {
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
