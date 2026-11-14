import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
