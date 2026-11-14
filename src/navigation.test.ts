import { describe, expect, it, vi } from "vitest";
import { goTo, isMissionView, MISSION_VIEWS, readView, viewHref } from "./navigation";

describe("navigation", () => {
  it("opens the home by default", () => {
    expect(readView("")).toBe("home");
    expect(readView("?view=unknown")).toBe("home");
  });

  it("reads the EVA and console routes", () => {
    expect(readView("?view=eva")).toBe("eva");
    expect(readView("?view=console")).toBe("console");
  });

  it("reads every mission screen, including Mission Control as ground", () => {
    for (const view of MISSION_VIEWS) expect(readView(`?view=${view}`)).toBe(view);
    expect(MISSION_VIEWS).toEqual(["today", "body", "decision", "trends", "ground"]);
  });

  it("tells mission screens apart from the site pages", () => {
    expect(isMissionView("body")).toBe(true);
    expect(isMissionView("console")).toBe(false);
  });

  it("keeps legacy ?t deep links on the EVA demo", () => {
    expect(readView("?t=18")).toBe("eva");
  });

  it("builds clean hrefs", () => {
    expect(viewHref("home")).toBe("/");
    expect(viewHref("eva")).toBe("/?view=eva");
    expect(viewHref("console")).toBe("/?view=console");
    expect(viewHref("ground")).toBe("/?view=ground");
  });

  it("moves between screens and tells the app through popstate", () => {
    const listener = vi.fn();
    window.addEventListener("popstate", listener);
    goTo("body");
    window.removeEventListener("popstate", listener);
    expect(window.location.search).toBe("?view=body");
    expect(readView()).toBe("body");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
