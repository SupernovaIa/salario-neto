import { describe, expect, it } from "vitest";
import { calculateNet } from "../calculate-net";
import type { SalaryInput } from "../types";

const base: SalaryInput = {
  grossAnnual: 30000,
  payments: 14,
  contractType: "permanent",
  year: 2025,
};

describe("calculateNet", () => {
  it("computes a reference case (€30,000, permanent, 2025)", () => {
    const r = calculateNet(base);

    // Social security: 6.48% of 30,000 = 1,944.
    expect(r.socialSecurity.total).toBeCloseTo(1944, 2);
    expect(r.socialSecurity.contributionBase).toBe(30000);

    // Income tax: annual withholding via the two-quota method.
    expect(r.incomeTax.annualWithholding).toBeCloseTo(4927.8, 1);
    expect(r.incomeTax.withholdingRate).toBeCloseTo(0.16426, 4);

    // Net.
    expect(r.netAnnual).toBeCloseTo(23128.2, 1);
    expect(r.netMonthly).toBeCloseTo(1652.01, 1);
    expect(r.effectiveNetRate).toBeCloseTo(0.7709, 3);
  });

  it("splits the same net annual amount across 12 or 14 payments", () => {
    const with14 = calculateNet({ ...base, payments: 14 });
    const with12 = calculateNet({ ...base, payments: 12 });

    expect(with14.netAnnual).toBeCloseTo(with12.netAnnual, 6);
    expect(with12.netMonthly).toBeGreaterThan(with14.netMonthly);
    expect(with14.netMonthly * 14).toBeCloseTo(with14.netAnnual, 6);
    expect(with12.netMonthly * 12).toBeCloseTo(with12.netAnnual, 6);
  });

  it("caps the contribution base at the maximum base", () => {
    const r = calculateNet({ ...base, grossAnnual: 80000 });
    expect(r.socialSecurity.contributionBase).toBeCloseTo(58914, 2);
    // Even though gross rises, the contribution is capped.
    expect(r.socialSecurity.total).toBeCloseTo(58914 * 0.0648, 2);
  });

  it("applies a more expensive unemployment rate on temporary contracts", () => {
    const permanent = calculateNet(base);
    const temporary = calculateNet({ ...base, contractType: "temporary" });
    expect(temporary.socialSecurity.unemployment).toBeGreaterThan(
      permanent.socialSecurity.unemployment,
    );
  });

  it("applies no income tax to low incomes (full earned-income reduction)", () => {
    const r = calculateNet({ ...base, grossAnnual: 15000 });
    expect(r.incomeTax.annualWithholding).toBeCloseTo(0, 2);
    expect(r.netAnnual).toBeCloseTo(15000 - 972, 2);
  });

  it("increases withholding with gross (progressivity)", () => {
    const rates = [20000, 40000, 80000].map(
      (grossAnnual) =>
        calculateNet({ ...base, grossAnnual }).incomeTax.withholdingRate,
    );
    expect(rates[0]).toBeLessThan(rates[1]);
    expect(rates[1]).toBeLessThan(rates[2]);
  });

  it("is robust against zero or negative inputs", () => {
    const zero = calculateNet({ ...base, grossAnnual: 0 });
    expect(zero.netAnnual).toBe(0);
    expect(zero.effectiveNetRate).toBe(0);

    const negative = calculateNet({ ...base, grossAnnual: -5000 });
    expect(negative.netAnnual).toBe(0);
  });

  it("uses the 2026 MEI when that year is requested", () => {
    const r2025 = calculateNet({ ...base, year: 2025 });
    const r2026 = calculateNet({ ...base, year: 2026 });
    // The employee MEI share rises from 0.13% to 0.15%.
    expect(r2026.socialSecurity.mei).toBeGreaterThan(r2025.socialSecurity.mei);
  });
});
