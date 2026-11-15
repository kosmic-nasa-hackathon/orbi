import { describe, expect, it } from "vitest";
import { BUILD, formatVersion, REPO_URL } from "./version";

describe("formatVersion", () => {
  it("shows the version with a linked short commit when git metadata exists", () => {
    expect(formatVersion("0.1.0", "406d515")).toEqual({
      label: "ORBI v0.1.0",
      commit: "406d515",
      commitUrl: `${REPO_URL}/commit/406d515`,
    });
    expect(formatVersion("0.1.0", "406D5151A2B3C4D5").commit).toBe("406d515");
  });

  it("falls back to the version alone without a usable commit (Docker builds have no .git)", () => {
    expect(formatVersion("0.1.0")).toEqual({ label: "ORBI v0.1.0" });
    expect(formatVersion("0.1.0", "")).toEqual({ label: "ORBI v0.1.0" });
    expect(formatVersion("0.1.0", "not-a-sha")).toEqual({ label: "ORBI v0.1.0" });
  });

  it("reads the package.json version injected at build time", async () => {
    const pkg = await import("../package.json");
    expect(BUILD.label).toBe(`ORBI v${pkg.version}`);
  });
});
