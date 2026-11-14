import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { scenarios } from "../../data/scenarios";
import { evaluate } from "../../domain/evaluate";
import { RuleFlow } from "./RuleFlow";

function scenario(id: string) {
  const found = scenarios.find((item) => item.id === id);
  if (!found) throw new Error(`missing scenario ${id}`);
  return found;
}

function renderFlow(id: string) {
  const selected = scenario(id);
  const day = selected.readings[selected.readings.length - 1]!.day;
  const evaluation = evaluate(selected, day, "MARS");
  render(
    <RuleFlow evaluation={evaluation} scenario={selected} onScenarioChange={() => undefined} />,
  );
  return evaluation;
}

describe("RuleFlow", () => {
  it("shows the correlation path that explains early infection", () => {
    renderFlow("early-infection");
    expect(screen.getByRole("heading", { name: "How ORBI decided" })).toBeInTheDocument();
    expect(screen.getByText("Possible early infection")).toBeInTheDocument();
    expect(screen.getByText("correlation")).toBeInTheDocument();
    expect(screen.getAllByText("Concern").length).toBeGreaterThan(0);
  });

  it("separates a cabin problem from the astronaut", () => {
    renderFlow("cabin-co2");
    expect(screen.getByText("Cabin air, not you")).toBeInTheDocument();
    expect(screen.getByText(/This is the environment, not the astronaut/)).toBeInTheDocument();
  });

  it("shows a clean nominal path when nothing fires", () => {
    renderFlow("nominal");
    expect(screen.getByText("No rule fired today")).toBeInTheDocument();
  });

  it("lets the user jump between cases", () => {
    const onScenarioChange = vi.fn();
    const selected = scenario("nominal");
    const evaluation = evaluate(selected, 148, "MARS");
    render(
      <RuleFlow evaluation={evaluation} scenario={selected} onScenarioChange={onScenarioChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: scenario("cabin-co2").title }));
    expect(onScenarioChange).toHaveBeenCalledWith("cabin-co2");
  });
});
