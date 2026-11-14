import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { CoachProvider } from "../ai/types";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { buildPacket, DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Decision, { DecisionScreen } from "./Decision";

const store = useOrbiStore;

function engine(mission: "ISS" | "MOON" | "MARS" = "MARS") {
  return evaluate(getScenario("early-infection"), DEMO_DAY, mission);
}

describe("Decision", () => {
  beforeEach(() => store.getState().reset());

  it("shows the engine's assessment as is: level, because and actions", () => {
    const top = engine().assessments[0];
    expect(top).toBeDefined();
    render(<Decision />);
    expect(screen.getByRole("heading", { name: top!.title })).toBeInTheDocument();
    for (const line of [...top!.because, ...top!.actions]) {
      expect(screen.getAllByText(line).length).toBeGreaterThan(0);
    }
  });

  it("changes the escalation with the mission without reloading", () => {
    render(<Decision />);
    const mars = engine("MARS").assessments[0]!.escalation;
    const iss = engine("ISS").assessments[0]!.escalation;
    expect(mars.now).not.toBe(iss.now);
    expect(screen.getByText(mars.now)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ISS" }));
    expect(screen.getByText(iss.now)).toBeInTheDocument();
    expect(screen.queryByText(mars.now)).not.toBeInTheDocument();
  });

  it("explains with the deterministic coach", async () => {
    render(<Decision />);
    fireEvent.click(screen.getByRole("button", { name: "Explain" }));
    expect(await screen.findByText("Deterministic coach")).toBeInTheDocument();
    expect(screen.queryByText(/On-device model not used/)).not.toBeInTheDocument();
  });

  it("falls back to the template when the on-device model is unavailable", async () => {
    const offline: CoachProvider = {
      id: "local-llm",
      label: "Local model",
      onDevice: true,
      available: () => false,
      suggest: () => Promise.reject(new Error("not loaded")),
    };
    render(<DecisionScreen coach={offline} />);
    fireEvent.click(screen.getByRole("button", { name: "Explain" }));
    expect(await screen.findByText(/On-device model not used/)).toBeInTheDocument();
    expect(screen.getByText("Deterministic coach")).toBeInTheDocument();
  });

  it("queues the packet on Mars and sends it live on the ISS", () => {
    render(<Decision />);
    fireEvent.click(screen.getByRole("button", { name: "Send to flight surgeon" }));
    expect(screen.getByRole("status")).toHaveTextContent("Queued");
    expect(store.getState().packet).toMatchObject({
      day: DEMO_DAY,
      mission: "MARS",
      delivery: "next-window",
    });
    fireEvent.click(screen.getByRole("button", { name: "ISS" }));
    fireEvent.click(screen.getByRole("button", { name: "Send to flight surgeon" }));
    expect(screen.getByRole("status")).toHaveTextContent("Sent");
    expect(store.getState().packet?.delivery).toBe("live");
  });

  it("keeps reproductive detail private in the packet by default", () => {
    expect(buildPacket(engine()).reproductiveDetail).toBe("private");
    expect(buildPacket(engine(), { shareReproductiveWithGround: true }).reproductiveDetail).toBe(
      "shared",
    );
  });

  it("says there is nothing to act on for a nominal day", () => {
    store.getState().setScenario("nominal");
    render(<Decision />);
    expect(screen.getByRole("heading", { name: "Nothing to act on today" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send to flight surgeon" }),
    ).not.toBeInTheDocument();
  });
});
