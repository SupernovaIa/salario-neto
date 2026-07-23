import { describe, expect, it } from "vitest";
import { calculateFamilyMinimum } from "../family-minimum";
import { parametersFor } from "../tax-data";
import type { PersonalCircumstances } from "../types";

const params = parametersFor(2025);
const neutral: PersonalCircumstances = {
  age: 30,
  disability: "none",
  children: 0,
  childrenUnder3: 0,
  sharedCustody: false,
};

const min = (p: Partial<PersonalCircumstances>) =>
  calculateFamilyMinimum({ ...neutral, ...p }, params);

describe("calculateFamilyMinimum", () => {
  it("returns the base personal minimum for neutral circumstances", () => {
    expect(min({})).toBe(5550);
  });

  it("graduates the descendant minimum by birth order", () => {
    expect(min({ children: 1 })).toBe(5550 + 2400);
    expect(min({ children: 2 })).toBe(5550 + 2400 + 2700);
    expect(min({ children: 3 })).toBe(5550 + 2400 + 2700 + 4000);
    expect(min({ children: 4 })).toBe(5550 + 2400 + 2700 + 4000 + 4500);
  });

  it("uses the last bracket for the 5th child and beyond", () => {
    expect(min({ children: 5 })).toBe(min({ children: 4 }) + 4500);
  });

  it("adds the under-3 extra per young child", () => {
    expect(min({ children: 2, childrenUnder3: 1 })).toBe(
      5550 + 2400 + 2700 + 2800,
    );
  });

  it("caps under-3 children at the total number of children", () => {
    // childrenUnder3 > children must not add phantom extras.
    expect(min({ children: 1, childrenUnder3: 3 })).toBe(min({ children: 1 }) + 2800);
  });

  it("halves the descendant minimum on shared custody", () => {
    const full = min({ children: 2 }) - 5550; // descendant part only
    expect(min({ children: 2, sharedCustody: true })).toBe(5550 + full / 2);
  });

  it("stacks age brackets (65+ and 75+)", () => {
    expect(min({ age: 66 })).toBe(5550 + 1150);
    expect(min({ age: 80 })).toBe(5550 + 1150 + 1400);
  });

  it("adds the disability minimum by level", () => {
    expect(min({ disability: "standard" })).toBe(5550 + 3000);
    expect(min({ disability: "severe" })).toBe(5550 + 9000);
  });
});
