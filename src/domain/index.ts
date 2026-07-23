export { calculateNet } from "./calculate-net";
export { calculateFamilyMinimum } from "./family-minimum";
export { parametersFor, AVAILABLE_YEARS, DEFAULT_YEAR } from "./tax-data";
export type {
  SalaryInput,
  Result,
  ContractType,
  PaymentCount,
  DisabilityLevel,
  PersonalCircumstances,
  SocialSecurityBreakdown,
  IncomeTaxBreakdown,
} from "./types";

import type { PersonalCircumstances } from "./types";

/** Neutral circumstances: leave the minimum at the base personal allowance. */
export const DEFAULT_PERSONAL: PersonalCircumstances = {
  age: 30,
  disability: "none",
  children: 0,
  childrenUnder3: 0,
  sharedCustody: false,
};
