export type Theme = "dark" | "light";
export type ThemePreference = Theme | "system";

/** Shared with public/theme-init.js, which applies the theme before React loads. */
export const THEME_STORAGE_KEY = "orbi-theme";

export const THEME_COLOR: Record<Theme, string> = {
  dark: "#04070b",
  light: "#eef4f7",
};

export function parsePreference(value: string | null | undefined): ThemePreference {
  return value === "dark" || value === "light" ? value : "system";
}

/** Without a stored choice ORBI follows the OS; if the OS gives no answer, it stays dark. */
export function resolveTheme(preference: ThemePreference, systemPrefersLight: boolean): Theme {
  if (preference !== "system") return preference;
  return systemPrefersLight ? "light" : "dark";
}
