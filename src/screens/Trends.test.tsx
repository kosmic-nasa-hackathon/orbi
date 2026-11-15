import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { REPRODUCTIVE_PREVIEW } from "../content/reproductive";
import { SYSTEM_INFO } from "../content/systems";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_LABEL } from "../domain/levels";
import { buildSeries } from "../domain/series";
import { SYSTEM_IDS } from "../domain/types";
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

  it("offers every body system plus the reproductive preview", () => {
    render(<Trends />);
    for (const id of SYSTEM_IDS) {
      expect(screen.getByRole("tab", { name: SYSTEM_INFO[id].label })).toBeInTheDocument();
    }
    expect(screen.getByRole("tab", { name: "Reproductive" })).toBeInTheDocument();
  });

  it("charts exercise for bones, the budget for radiation and no fake trend for reproductive", () => {
    const evaluation = evaluate(getScenario("early-infection"), DEMO_DAY, "MARS");
    render(<Trends />);
    fireEvent.click(screen.getByRole("tab", { name: SYSTEM_INFO.msk.label }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Resistive exercise");
    fireEvent.click(screen.getByRole("tab", { name: SYSTEM_INFO.radiation.label }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(`${evaluation.estimates.radiationPct}%`);
    fireEvent.click(screen.getByRole("tab", { name: "Reproductive" }));
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent(REPRODUCTIVE_PREVIEW.trend);
    expect(panel).toHaveTextContent(REPRODUCTIVE_PREVIEW.demoTag);
    expect(panel).toHaveTextContent("Short by14pills");
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
