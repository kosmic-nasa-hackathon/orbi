import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CYCLE_CARD, CYCLE_NOTE } from "../content/cycle";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_ORDER, SYSTEM_IDS } from "../domain/types";
import { DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Body from "./Body";

const store = useOrbiStore;

function figure() {
  return within(screen.getByRole("group", { name: /seven monitored systems/ }));
}

describe("Body", () => {
  beforeEach(() => {
    store.getState().reset();
    window.history.replaceState(null, "", "/?view=body");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("draws the figure with every system reachable", () => {
    render(<Body />);
    for (const name of [
      /Immune system/,
      /^Bones/,
      /^Brain/,
      /^Lungs/,
      /^Heart/,
      /^Abdomen/,
      /^Radiation halo/,
    ]) {
      expect(figure().getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("shows the day's readings on the satellites", () => {
    const reading = getScenario("early-infection").readings.find((r) => r.day === DEMO_DAY)!;
    render(<Body />);
    expect(
      figure().getByRole("button", {
        name: `Resting HR: ${reading.restingHr} bpm — Cardiovascular`,
      }),
    ).toBeInTheDocument();
    expect(
      figure().getByRole("button", { name: `Temp: ${reading.tempC.toFixed(1)} °C — Immune` }),
    ).toBeInTheDocument();
  });

  it("opens the worst system of the day with the engine's reasons", () => {
    const evaluation = evaluate(getScenario("early-infection"), DEMO_DAY, "MARS");
    const flagged = SYSTEM_IDS.filter((id) => evaluation.bySystem[id] !== "NOMINAL");
    const worst = [...SYSTEM_IDS].sort(
      (a, b) => LEVEL_ORDER[evaluation.bySystem[b]] - LEVEL_ORDER[evaluation.bySystem[a]],
    )[0]!;
    const assessment = evaluation.assessments.find((a) => a.system === worst)!;
    render(<Body />);
    expect(screen.getByText(`${flagged.length} of 7 need your attention.`)).toBeInTheDocument();
    const expanded = screen.getAllByRole("button", { expanded: true });
    expect(expanded).toHaveLength(1);
    expect(expanded[0]).toHaveTextContent(assessment.title);
    expect(screen.getByText(assessment.because[0]!)).toBeInTheDocument();
  });

  it("selects a system from the figure", () => {
    render(<Body />);
    fireEvent.click(figure().getByRole("button", { name: /^Heart/ }));
    const expanded = screen.getAllByRole("button", { expanded: true });
    expect(expanded).toHaveLength(1);
    expect(expanded[0]).toHaveTextContent("Cardiovascular");
  });

  it("unfolds the all-good list when the figure selects a quiet system", () => {
    const evaluation = evaluate(getScenario("early-infection"), DEMO_DAY, "MARS");
    expect(evaluation.bySystem.respiratory).toBe("NOMINAL");
    render(<Body />);
    fireEvent.click(figure().getByRole("button", { name: /^Lungs/ }));
    const expanded = screen.getByRole("button", { expanded: true });
    expect(expanded).toHaveTextContent("Respiratory");
    expect(expanded.closest("details")).toHaveAttribute("open");
  });

  it("folds the systems that are all good on a nominal day", () => {
    store.getState().setScenario("nominal");
    render(<Body />);
    expect(screen.getByText("Every system is inside your normal.")).toBeInTheDocument();
    expect(screen.getByText("7 systems all good")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Need attention" })).not.toBeInTheDocument();
  });

  it("leads to the What to do step", () => {
    render(<Body />);
    fireEvent.click(screen.getByRole("button", { name: /See what to do/ }));
    expect(window.location.search).toBe("?view=decision");
  });

  it("puts the cycle next to the body with privacy first and no citations", () => {
    render(<Body />);
    const card = within(screen.getByRole("region", { name: CYCLE_CARD.title }));
    expect(card.getByText(CYCLE_CARD.privacy)).toBeInTheDocument();
    for (const range of CYCLE_CARD.ranges) {
      expect(card.getByText(range.value)).toBeInTheDocument();
    }
    expect(card.queryAllByRole("link")).toHaveLength(0);
    expect(card.getByText("Cycle-aware baseline: on")).toBeInTheDocument();
    act(() => store.getState().setCycleAware(false));
    expect(card.getByText("Cycle-aware baseline: off")).toBeInTheDocument();
  });

  it("adds a one-line cycle note only to the systems the cycle moves", () => {
    render(<Body />);
    expect(screen.getByRole("button", { name: CYCLE_NOTE.immune!.short })).toBeInTheDocument();
    fireEvent.click(figure().getByRole("button", { name: /^Brain/ }));
    expect(screen.queryByRole("button", { name: /Your cycle can raise/ })).not.toBeInTheDocument();
    fireEvent.click(figure().getByRole("button", { name: /^Heart/ }));
    expect(screen.getByRole("button", { name: CYCLE_NOTE.cardio!.short })).toBeInTheDocument();
  });

  it("keeps the cycle card folded until the astronaut opens it", () => {
    render(<Body />);
    const card = document.getElementById("cycle-card");
    expect(card).not.toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: CYCLE_NOTE.immune!.short }));
    expect(card).toHaveAttribute("open");
  });
});
