import { describe, expect, it } from "vitest";
import { calculateNet } from "../calculate-net";
import { REGIONS } from "../tax-data";
import { REGIONAL_SCALES_2025, REGION_NAMES } from "../regional-scales";
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

describe("regional scales data", () => {
  it("covers the 15 common-regime communities plus the general reference", () => {
    expect(REGION_NAMES).toHaveLength(15);
    expect(REGIONS).toHaveLength(16);
    expect(REGIONS[0].id).toBe("general");
  });

  it("has a well-formed scale for every community", () => {
    for (const [id, scale] of Object.entries(REGIONAL_SCALES_2025)) {
      expect(scale.length, id).toBeGreaterThan(0);
      // Last bracket is open-ended; the rest have ascending upper bounds.
      expect(scale[scale.length - 1].upTo, id).toBeNull();
      const bounds = scale
        .slice(0, -1)
        .map((b) => b.upTo as number);
      const sorted = [...bounds].sort((a, b) => a - b);
      expect(bounds, id).toEqual(sorted);
      // Rates are sane proportions.
      for (const b of scale) {
        expect(b.rate, id).toBeGreaterThan(0);
        expect(b.rate, id).toBeLessThan(0.5);
      }
    }
  });

  it("every selectable region resolves to a scale", () => {
    for (const region of REGIONS) {
      const r = calculateNet({ ...base, region: region.id });
      expect(r.incomeTax.regionalTax, region.id).toBeGreaterThan(0);
    }
  });
});

describe("regional scale effect on withholding (€30,000)", () => {
  const taxFor = (region: string) =>
    calculateNet({ ...base, region }).incomeTax.annualWithholding;

  it("makes Madrid cheaper than the general reference", () => {
    expect(taxFor("madrid")).toBeLessThan(taxFor("general"));
  });

  it("makes Cataluña more expensive than Madrid", () => {
    expect(taxFor("cataluna")).toBeGreaterThan(taxFor("madrid"));
  });

  it("falls back to the general scale for an unknown region", () => {
    expect(taxFor("atlantis")).toBeCloseTo(taxFor("general"), 6);
  });
});
