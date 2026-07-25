import { describe, expect, it } from "vitest";
import { calculateEmployerCost } from "../social-security";
import { parametersFor } from "../tax-data";
import type { SalaryInput } from "../types";

const base: SalaryInput = {
  grossAnnual: 30000,
  payments: 14,
  contractType: "permanent",
  year: 2025,
  region: "general",
  personal: {
    age: 30,
    disability: "none",
    children: 0,
    childrenUnder3: 0,
    sharedCustody: false,
  },
};

const employerCostFor = (input: Partial<SalaryInput>, year = 2025) =>
  calculateEmployerCost({ ...base, ...input, year }, parametersFor(year));

describe("calculateEmployerCost", () => {
  it("adds up the 2025 employer rates for a permanent contract", () => {
    const cost = employerCostFor({});

    // 23.60 + 5.50 + 0.20 + 0.60 + 0.67 + 1.50 = 32.07% of 30,000.
    expect(cost.commonContingencies).toBeCloseTo(7080, 2);
    expect(cost.unemployment).toBeCloseTo(1650, 2);
    expect(cost.wageGuaranteeFund).toBeCloseTo(60, 2);
    expect(cost.vocationalTraining).toBeCloseTo(180, 2);
    expect(cost.mei).toBeCloseTo(201, 2);
    expect(cost.occupationalRisk).toBeCloseTo(450, 2);

    expect(cost.total).toBeCloseTo(9621, 2);
    expect(cost.totalCost).toBeCloseTo(39621, 2);
    expect(cost.overheadRate).toBeCloseTo(0.3207, 4);
  });

  it("charges the higher unemployment rate on a temporary contract", () => {
    const permanent = employerCostFor({ contractType: "permanent" });
    const temporary = employerCostFor({ contractType: "temporary" });

    // 6.70% instead of 5.50%: 1.20 points more.
    expect(temporary.total - permanent.total).toBeCloseTo(30000 * 0.012, 2);
  });

  it("raises the employer MEI share in 2026", () => {
    const cost2026 = employerCostFor({}, 2026);

    expect(cost2026.mei).toBeCloseTo(225, 2); // 0.75%
    expect(cost2026.overheadRate).toBeCloseTo(0.3215, 4);
  });

  it("caps contributions at the maximum contribution base", () => {
    const parameters = parametersFor(2025);
    const cost = employerCostFor({ grossAnnual: 200000 });

    expect(cost.contributionBase).toBe(parameters.maxContributionBaseAnnual);
    // Contributions stop growing, but the total cost still includes all gross.
    expect(cost.total).toBeCloseTo(
      parameters.maxContributionBaseAnnual * 0.3207,
      2,
    );
    expect(cost.totalCost).toBeCloseTo(200000 + cost.total, 2);
    // The overhead rate falls below the nominal 32.07% above the cap.
    expect(cost.overheadRate).toBeLessThan(0.3207);
  });

  it("returns zeroes for a zero salary", () => {
    const cost = employerCostFor({ grossAnnual: 0 });

    expect(cost.total).toBe(0);
    expect(cost.totalCost).toBe(0);
    expect(cost.overheadRate).toBe(0);
  });
});
