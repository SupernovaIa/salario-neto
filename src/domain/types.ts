/**
 * Domain types for the gross → net calculation.
 * The engine works in annual euros unless the name says otherwise.
 */

/** Contract type: affects the unemployment contribution rate. */
export type ContractType = "permanent" | "temporary";

/** Number of yearly payments (12 or 14). */
export type PaymentCount = 12 | 14;

/** Taxpayer disability level (affects the personal minimum). */
export type DisabilityLevel = "none" | "standard" | "severe";

/**
 * Personal and family circumstances that raise the tax-free minimum.
 * Empty circumstances leave the minimum at the base personal allowance.
 */
export interface PersonalCircumstances {
  /** Taxpayer age (65+ and 75+ raise the personal minimum). */
  age: number;
  /** Taxpayer disability: none, 33-65%, or 65%+. */
  disability: DisabilityLevel;
  /** Number of qualifying dependent descendants (under 25, low income). */
  children: number;
  /** How many of those descendants are under 3 (extra minimum). */
  childrenUnder3: number;
  /** Descendant minimum is halved when both parents are entitled to it. */
  sharedCustody: boolean;
}

/** User-provided input. */
export interface SalaryInput {
  /** Gross annual salary in euros. */
  grossAnnual: number;
  /** Number of payments (12 or 14). Only affects the monthly split, not the total. */
  payments: PaymentCount;
  /** Contract type. */
  contractType: ContractType;
  /** Tax year whose parameters apply. */
  year: number;
  /** Personal and family circumstances. */
  personal: PersonalCircumstances;
}

/** A progressive-scale bracket. `upTo = null` means "no upper limit". */
export interface Bracket {
  upTo: number | null;
  rate: number; // proportion, e.g. 0.19 = 19%
}

/** Components of the personal and family minimum (annual euros). */
export interface FamilyMinimumParameters {
  /** Base personal minimum for every taxpayer. */
  personalBase: number;
  /** Extra added when the taxpayer is 65 or older. */
  ageOver65: number;
  /** Further extra added (on top of ageOver65) when 75 or older. */
  ageOver75Extra: number;
  /** Minimum for a 33-65% disability. */
  disabilityStandard: number;
  /** Minimum for a 65%+ disability. */
  disabilitySevere: number;
  /** Minimum per descendant, by order: [1st, 2nd, 3rd, 4th and beyond]. */
  descendant: [number, number, number, number];
  /** Extra minimum per descendant under 3 years old. */
  descendantUnder3Extra: number;
}

/** Employee's social security contribution rates (proportions). */
export interface ContributionRates {
  commonContingencies: number;
  unemploymentPermanent: number;
  unemploymentTemporary: number;
  vocationalTraining: number;
  /** Intergenerational Equity Mechanism (employee share). */
  mei: number;
}

/** Tax parameters for a given year. */
export interface TaxParameters {
  year: number;
  /** Annual maximum contribution base (upper cap). */
  maxContributionBaseAnnual: number;
  contribution: ContributionRates;
  /** General income-tax scale (state + reference regional). */
  incomeTaxScale: Bracket[];
  /** Components of the personal and family minimum (art. 57-61 LIRPF). */
  familyMinimum: FamilyMinimumParameters;
  /** Deductible "other expenses" from earned income (art. 19.2.f LIRPF). */
  deductibleExpenses: number;
  /** Parameters of the earned-income reduction (art. 20 LIRPF). */
  earnedIncomeReduction: {
    lowerLimit: number; // below this => full reduction
    upperLimit: number; // above this => zero reduction
    maxReduction: number;
    coefficient: number; // decrement slope in the intermediate band
  };
}

/** Social security contribution breakdown. */
export interface SocialSecurityBreakdown {
  contributionBase: number;
  commonContingencies: number;
  unemployment: number;
  vocationalTraining: number;
  mei: number;
  total: number;
}

/** Income-tax calculation breakdown. */
export interface IncomeTaxBreakdown {
  netIncomeBeforeReduction: number;
  earnedIncomeReduction: number;
  taxableBase: number;
  /** Personal and family minimum applied (taxed at 0% via the second quota). */
  personalAndFamilyMinimum: number;
  taxDue: number;
  /** Resulting withholding rate (proportion of gross). */
  withholdingRate: number;
  annualWithholding: number;
}

/** Full calculation result. */
export interface Result {
  grossAnnual: number;
  grossMonthly: number;
  socialSecurity: SocialSecurityBreakdown;
  incomeTax: IncomeTaxBreakdown;
  netAnnual: number;
  netMonthly: number;
  /** Proportion of gross the employee keeps. */
  effectiveNetRate: number;
}
