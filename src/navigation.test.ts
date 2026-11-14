import { describe, expect, it } from "vitest";
import { readView, viewHref } from "./navigation";

describe("navigation", () => {
  it("opens the home by default", () => {
    expect(readView("")).toBe("home");
    expect(readView("?view=unknown")).toBe("home");
  });

  it("reads the EVA and console routes", () => {
    expect(readView("?view=eva")).toBe("eva");
    expect(readView("?view=console")).toBe("console");
  });

  it("keeps legacy ?t deep links on the EVA demo", () => {
    expect(readView("?t=18")).toBe("eva");
  });

  it("builds clean hrefs", () => {
    expect(viewHref("home")).toBe("/");
    expect(viewHref("eva")).toBe("/?view=eva");
    expect(viewHref("console")).toBe("/?view=console");
  });
});
