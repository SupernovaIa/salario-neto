export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Initial theme: an explicit choice stored earlier wins; otherwise follow the
 * system preference. Nothing is persisted until the user actually toggles, so a
 * visitor who never touches it keeps following their system.
 */
export function getInitialTheme(): Theme {
  const stored = readStored();
  if (stored) return stored;
  return systemPrefersDark() ? "dark" : "light";
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }
}

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
