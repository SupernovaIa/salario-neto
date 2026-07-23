/**
 * Domain types for the gross → net calculation.
 * The engine works in annual euros unless the name says otherwise.
 */

/** Contract type: affects the unemployment contribution rate. */
export type ContractType = "permanent" | "temporary";

/** Number of yearly payments (12 or 14). */
export type PaymentCount = 12 | 14;

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
}

/** A progressive-scale bracket. `upTo = null` means "no upper limit". */
export interface Bracket {
  upTo: number | null;
  rate: number; // proportion, e.g. 0.19 = 19%
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
  /** General personal and family allowance. */
  personalAllowance: number;
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
