import { describe, expect, it } from "vitest";
import { parsePreference, resolveTheme } from "./theme";

describe("theme", () => {
  it("only accepts dark or light as a stored choice", () => {
    expect(parsePreference("light")).toBe("light");
    expect(parsePreference("dark")).toBe("dark");
    expect(parsePreference("sepia")).toBe("system");
    expect(parsePreference(null)).toBe("system");
  });

  it("follows the OS when there is no stored choice", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
  });

  it("keeps an explicit choice over the OS", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });
});
