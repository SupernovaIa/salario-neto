import { describe, expect, it } from "vitest";
import { REGIONS } from "../../domain";
import { findNextMatch, initialsOf } from "../type-ahead";

const LABELS = [
  "Andalucía",
  "Castilla-La Mancha",
  "Comunidad de Madrid",
  "Región de Murcia",
];

describe("initialsOf", () => {
  it("takes the initial of every meaningful word", () => {
    expect(initialsOf("Castilla-La Mancha")).toEqual(["c", "l", "m"]);
    expect(initialsOf("Principado de Asturias")).toEqual(["p", "a"]);
  });

  it("drops connectors so 'd' does not match 'de'", () => {
    expect(initialsOf("Comunidad de Madrid")).toEqual(["c", "m"]);
  });

  it("ignores punctuation when finding word starts", () => {
    // Without stripping the parenthesis this would yield "(" as an initial and
    // "estatal" would be unreachable.
    expect(initialsOf("General (estatal de referencia)")).toEqual([
      "g",
      "e",
      "r",
    ]);
  });

  it("folds accents and case", () => {
    expect(initialsOf("Aragón")).toEqual(["a"]);
    expect(initialsOf("Illes Balears")).toEqual(["i", "b"]);
    expect(initialsOf("ÁVILA")).toEqual(["a"]);
  });
});

describe("findNextMatch", () => {
  it("matches on a later word, not just the first", () => {
    // "Comunidad de Madrid" answers to "m" through "Madrid".
    expect(findNextMatch(LABELS, "m", 0)).toBe(1); // Castilla-La Mancha
    expect(findNextMatch(LABELS, "m", 1)).toBe(2); // Comunidad de Madrid
  });

  it("cycles through matches and wraps around", () => {
    expect(findNextMatch(LABELS, "m", 2)).toBe(3); // Región de Murcia
    expect(findNextMatch(LABELS, "m", 3)).toBe(1); // back to Mancha
  });

  it("never returns the starting index", () => {
    // "Andalucía" is the only "a", so from itself there is nowhere else to go.
    expect(findNextMatch(["Andalucía", "Cantabria"], "a", 0)).toBe(0);
    expect(findNextMatch(["Andalucía"], "a", 0)).toBe(0);
  });

  it("is accent and case insensitive on the typed letter", () => {
    expect(findNextMatch(LABELS, "Á", 3)).toBe(0);
    expect(findNextMatch(LABELS, "A", 3)).toBe(0);
  });

  it("returns null when nothing matches", () => {
    expect(findNextMatch(LABELS, "z", 0)).toBeNull();
    expect(findNextMatch([], "a", 0)).toBeNull();
    expect(findNextMatch(LABELS, "", 0)).toBeNull();
  });

  it("cycles the real communities: m → Mancha, Madrid, Murcia", () => {
    const labels = REGIONS.map((region) => region.name);
    const first = findNextMatch(labels, "m", 0);
    const second = findNextMatch(labels, "m", first!);
    const third = findNextMatch(labels, "m", second!);

    expect(labels[first!]).toBe("Castilla-La Mancha");
    expect(labels[second!]).toBe("Comunidad de Madrid");
    expect(labels[third!]).toBe("Región de Murcia");
  });

  it("reaches every community by some letter", () => {
    const labels = REGIONS.map((region) => region.name);
    const unreachable = labels.filter((label) => initialsOf(label).length === 0);

    expect(unreachable).toEqual([]);
  });
});
