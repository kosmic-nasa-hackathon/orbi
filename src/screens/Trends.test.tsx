import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_LABEL } from "../domain/levels";
import { buildSeries } from "../domain/series";
import { DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Trends from "./Trends";

const store = useOrbiStore;

describe("Trends", () => {
  beforeEach(() => store.getState().reset());

  it("opens on the immune system with the engine level and the latest value", () => {
    const evaluation = evaluate(getScenario("early-infection"), DEMO_DAY, "MARS");
    render(<Trends />);
    expect(screen.getByRole("tab", { name: "Immune" })).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Temperature");
    expect(panel).toHaveTextContent(LEVEL_LABEL[evaluation.bySystem.immune]);
    expect(panel).toHaveTextContent("Day 148");
  });

  it("switches the chart when another system is selected", () => {
    render(<Trends />);
    fireEvent.click(screen.getByRole("tab", { name: "Cardiovascular" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Resting heart rate");
    fireEvent.click(screen.getByRole("tab", { name: "Behavioral" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Sleep");
  });

  it("counts mission days outside the ground-training band", () => {
    const series = buildSeries(getScenario("early-infection"), "tempC", DEMO_DAY, { sigmas: 2 });
    const mission = series.points.filter((point) => point.phase === "mission");
    const outside = mission.filter((point) => point.outsideNormal).length;
    render(<Trends />);
    expect(screen.getByText("Days outside normal").parentElement?.parentElement).toHaveTextContent(
      `${outside}of ${mission.length}`,
    );
  });

  it("follows the demo day", () => {
    store.getState().setDay(130);
    render(<Trends />);
    expect(screen.getByText("Last 12 mission days · up to day 130")).toBeInTheDocument();
  });
});
