import { describe, expect, it } from "vitest";
import { applyScale } from "../scale";
import type { Bracket } from "../types";

const scale: Bracket[] = [
  { upTo: 100, rate: 0.1 },
  { upTo: 200, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

describe("applyScale", () => {
  it("returns 0 for non-positive bases", () => {
    expect(applyScale(0, scale)).toBe(0);
    expect(applyScale(-50, scale)).toBe(0);
  });

  it("applies only the first bracket within its limit", () => {
    expect(applyScale(50, scale)).toBeCloseTo(5); // 50 * 0.1
  });

  it("applies bracket progressivity, not a flat rate", () => {
    // 100*0.1 + 50*0.2 = 10 + 10 = 20
    expect(applyScale(150, scale)).toBeCloseTo(20);
  });

  it("applies the last bracket with no upper limit", () => {
    // 100*0.1 + 100*0.2 + 100*0.3 = 10 + 20 + 30 = 60
    expect(applyScale(300, scale)).toBeCloseTo(60);
  });

  it("taxes exactly at a bracket boundary", () => {
    expect(applyScale(100, scale)).toBeCloseTo(10);
    expect(applyScale(200, scale)).toBeCloseTo(30);
  });
});
