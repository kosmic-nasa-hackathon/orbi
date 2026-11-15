import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getScenario } from "../../data/scenarios";
import { evaluate } from "../../domain/evaluate";
import { DEMO_DAY } from "../../store/orbiStore";
import { BodySceneView } from "./BodySceneView";

const scenario = getScenario("early-infection");
const props = {
  evaluation: evaluate(scenario, DEMO_DAY, "MARS"),
  reading: scenario.readings.find((reading) => reading.day === DEMO_DAY),
  selected: "immune" as const,
  onSelect: () => {},
};

function figure2d() {
  return screen.queryByRole("group", { name: /seven monitored systems in orbit/ });
}

describe("BodySceneView", () => {
  beforeEach(() => window.history.replaceState(null, "", "/?view=body"));
  afterEach(() => vi.restoreAllMocks());

  it("opens on the 2D figure and keeps the app route", () => {
    render(<BodySceneView {...props} />);
    expect(screen.getByRole("tab", { name: /2D/ })).toHaveAttribute("aria-selected", "true");
    expect(figure2d()).toBeInTheDocument();
    expect(window.location.search).toBe("?view=body");
  });

  it("stays on 2D when the device has no WebGL", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    render(<BodySceneView {...props} />);
    fireEvent.click(screen.getByRole("tab", { name: /3D/ }));
    expect(screen.getByRole("tab", { name: /2D/ })).toHaveAttribute("aria-selected", "true");
    expect(figure2d()).toBeInTheDocument();
    expect(window.location.search).toBe("?view=body");
  });

  it("falls back to 2D when the 3D view cannot start", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<BodySceneView {...props} />);
    fireEvent.click(screen.getByRole("tab", { name: /3D/ }));
    expect(window.location.search).toBe("?view=body&figure=3d");
    fireEvent.click(await screen.findByRole("button", { name: "Back to 2D" }, { timeout: 5000 }));
    expect(figure2d()).toBeInTheDocument();
    expect(window.location.search).toBe("?view=body");
  });
});
