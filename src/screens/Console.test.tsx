import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SOURCES } from "../domain/rules";
import Console from "./Console";

describe("Console", () => {
  it("switches from the overview to the animated rule flow", () => {
    render(<Console />);

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Rule flow" }));

    const panel = screen.getByRole("tabpanel", { name: "Rule flow" });
    expect(within(panel).getByRole("heading", { name: "How ORBI decided" })).toBeVisible();
    expect(within(panel).getByText("Possible early infection")).toBeInTheDocument();
  });

  it("keeps the coach facts in their own tab", () => {
    render(<Console />);
    expect(screen.queryByRole("heading", { name: "Facts consumed by the coach" })).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: "Facts" }));
    const panel = screen.getByRole("tabpanel", { name: "Facts" });
    expect(
      within(panel).getByRole("heading", { name: "Facts consumed by the coach" }),
    ).toBeVisible();
  });

  it("says how many threshold sources are still pending verification", () => {
    const sources = Object.values(SOURCES);
    const pending = sources.filter((source) => !source.verified).length;
    render(<Console />);
    expect(
      screen.getByText(`${pending} of ${sources.length} sources pending verification`),
    ).toBeInTheDocument();
  });
});
