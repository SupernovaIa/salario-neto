/**
 * Type-ahead matching for list widgets: pressing a letter jumps to the next
 * option that answers to it, pressing it again cycles to the following one.
 *
 * Pure and list-agnostic, so it can be unit-tested without rendering anything.
 */

/** Folds accents and case so "Á" matches "a". */
export const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Connectors nobody types when looking for an option. */
const CONNECTORS = new Set(["de", "del", "y"]);

/**
 * Initials a label answers to. Every meaningful word counts, not just the
 * first: most community names lead with a generic word ("Comunidad de Madrid",
 * "Región de Murcia"), and users type the distinctive one. Words are split on
 * anything that is not a letter or digit, so hyphens and parentheses do not
 * end up as initials ("Castilla-La Mancha" → c, l, m).
 */
export const initialsOf = (label: string) =>
  fold(label)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word && !CONNECTORS.has(word))
    .map((word) => word[0]);

/**
 * Index of the next label matching `letter`, searching forwards from `from`
 * and wrapping around, or `null` when nothing matches. `from` itself is never
 * returned, so repeated presses cycle through the matches.
 */
export function findNextMatch(
  labels: string[],
  letter: string,
  from: number,
): number | null {
  const target = fold(letter);
  if (!target || labels.length === 0) return null;

  for (let step = 1; step <= labels.length; step++) {
    const index = (from + step) % labels.length;
    if (initialsOf(labels[index]).includes(target)) return index;
  }

  return null;
}
