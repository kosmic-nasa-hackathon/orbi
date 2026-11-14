import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SYSTEM_INFO } from "../content/systems";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Body from "./Body";

const store = useOrbiStore;

describe("Body", () => {
  beforeEach(() => {
    store.getState().reset();
    window.history.replaceState(null, "", "/?view=body");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("lists the flagged systems first, with the engine level as a traffic light", () => {
    const evaluation = evaluate(getScenario("early-infection"), DEMO_DAY, "MARS");
    const flagged = Object.entries(evaluation.bySystem).filter(([, level]) => level !== "NOMINAL");
    render(<Body />);
    expect(screen.getByText(`${flagged.length} of 7 need your attention.`)).toBeInTheDocument();
    const lines = within(screen.getByRole("list", { name: "Need attention" })).getAllByRole(
      "listitem",
    );
    expect(lines).toHaveLength(flagged.length);
    expect(lines[0]).toHaveTextContent(evaluation.assessments[0]!.title);
    expect(within(lines[0]!).getByText(/Act now|Urgent|Keep an eye on it/)).toBeInTheDocument();
  });

  it("folds the systems that are all good", () => {
    store.getState().setScenario("nominal");
    render(<Body />);
    expect(screen.getByText("Every system is inside your normal.")).toBeInTheDocument();
    expect(screen.getByText("7 systems all good")).toBeInTheDocument();
    expect(screen.getByText(SYSTEM_INFO.cardio.label)).toBeInTheDocument();
  });

  it("leads to the What to do step", () => {
    render(<Body />);
    expect(screen.getByRole("button", { name: /Body/ })).toHaveAttribute("aria-current", "step");
    fireEvent.click(screen.getByRole("button", { name: /See what to do/ }));
    expect(window.location.search).toBe("?view=decision");
  });
});
