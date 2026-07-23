import type { PersonalCircumstances, TaxParameters } from "./types";

/**
 * Descendant minimum, graduated by birth order (1st, 2nd, 3rd, 4th and beyond)
 * with an extra amount per child under 3. When both parents are entitled, the
 * amount is split in half.
 */
function descendantMinimum(
  personal: PersonalCircumstances,
  parameters: TaxParameters,
): number {
  const { descendant, descendantUnder3Extra } = parameters.familyMinimum;
  const children = Math.max(0, Math.floor(personal.children));
  const under3 = Math.min(Math.max(0, Math.floor(personal.childrenUnder3)), children);

  let total = 0;
  for (let order = 1; order <= children; order++) {
    // 5th child and beyond use the 4th-child amount (last bracket).
    total += descendant[Math.min(order, descendant.length) - 1];
  }
  total += under3 * descendantUnder3Extra;

  return personal.sharedCustody ? total / 2 : total;
}

/**
 * Computes the total personal and family minimum: the amount taxed at 0% via
 * the second quota of the withholding calculation.
 */
export function calculateFamilyMinimum(
  personal: PersonalCircumstances,
  parameters: TaxParameters,
): number {
  const fm = parameters.familyMinimum;

  let personalPart = fm.personalBase;
  if (personal.age >= 65) personalPart += fm.ageOver65;
  if (personal.age >= 75) personalPart += fm.ageOver75Extra;

  if (personal.disability === "standard") personalPart += fm.disabilityStandard;
  if (personal.disability === "severe") personalPart += fm.disabilitySevere;

  return personalPart + descendantMinimum(personal, parameters);
}
