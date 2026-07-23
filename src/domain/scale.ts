import type { Bracket } from "./types";

/**
 * Applies a progressive bracket scale to a base amount.
 *
 * Each bracket is taxed only on the portion of the base that falls within it,
 * not on the whole amount (true progressivity). Returns the total due.
 */
export function applyScale(base: number, scale: Bracket[]): number {
  if (base <= 0) return 0;

  let due = 0;
  let lowerBound = 0;

  for (const bracket of scale) {
    const upperBound = bracket.upTo ?? Infinity;
    if (base <= lowerBound) break;

    const amountInBracket = Math.min(base, upperBound) - lowerBound;
    due += amountInBracket * bracket.rate;
    lowerBound = upperBound;
  }

  return due;
}
