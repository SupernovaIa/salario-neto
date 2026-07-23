export { calculateNet } from "./calculate-net";
export { calculateFamilyMinimum } from "./family-minimum";
export {
  parametersFor,
  AVAILABLE_YEARS,
  DEFAULT_YEAR,
  REGIONS,
  DEFAULT_REGION,
  type Region,
} from "./tax-data";
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

import { DEFAULT_REGION, DEFAULT_YEAR } from "./tax-data";
import type { PersonalCircumstances, SalaryInput } from "./types";

/** Neutral circumstances: leave the minimum at the base personal allowance. */
export const DEFAULT_PERSONAL: PersonalCircumstances = {
  age: 30,
  disability: "none",
  children: 0,
  childrenUnder3: 0,
  sharedCustody: false,
};

/** Default salary input used to seed the form. */
export const DEFAULT_INPUT: SalaryInput = {
  grossAnnual: 30000,
  payments: 14,
  contractType: "permanent",
  year: DEFAULT_YEAR,
  region: DEFAULT_REGION,
  personal: DEFAULT_PERSONAL,
};
