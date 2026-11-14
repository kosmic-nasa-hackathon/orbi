import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CoachProvider } from "../ai/types";
import { TRAFFIC } from "../components/flow/traffic";
import { getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { buildPacket, DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Decision, { DecisionScreen } from "./Decision";

const store = useOrbiStore;

function engine(mission: "ISS" | "MOON" | "MARS" = "MARS") {
  return evaluate(getScenario("early-infection"), DEMO_DAY, mission);
}

function slide() {
  return screen.getByRole("region", { name: /of 5/ });
}

function showCard(name: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`^Card \\d: ${name}$`) }));
}

function openDemo() {
  fireEvent.click(screen.getByRole("button", { expanded: false, name: /Demo/ }));
}

describe("Decision", () => {
  beforeEach(() => {
    store.getState().reset();
    window.history.replaceState(null, "", "/?view=decision");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("opens on the top finding as a traffic-light card", () => {
    const top = engine().assessments[0]!;
    render(<Decision />);
    expect(slide()).toHaveAccessibleName("1 of 5: How you are");
    expect(within(slide()).getByRole("heading", { name: top.title })).toBeInTheDocument();
    expect(within(slide()).getAllByText(TRAFFIC[top.level].label)[0]).toBeInTheDocument();
    expect(
      screen.getByText(`+${engine().assessments.length - 1} more signals`),
    ).toBeInTheDocument();
  });

  it("walks the cards with the buttons and the arrow keys", () => {
    const top = engine().assessments[0]!;
    render(<Decision />);
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(slide()).toHaveAccessibleName("2 of 5: Why");
    for (const line of top.because.slice(0, 3)) {
      expect(within(slide()).getByText(line)).toBeInTheDocument();
    }
    fireEvent.keyDown(screen.getByRole("region", { name: "What to do" }), { key: "ArrowRight" });
    expect(slide()).toHaveAccessibleName("3 of 5: Do this now");
    fireEvent.keyDown(screen.getByRole("region", { name: "What to do" }), { key: "ArrowLeft" });
    expect(slide()).toHaveAccessibleName("2 of 5: Why");
  });

  it("lets the astronaut tick off the engine's actions", () => {
    const top = engine().assessments[0]!;
    render(<Decision />);
    showCard("Do this now");
    const first = screen.getByRole("checkbox", { name: top.actions[0] });
    fireEvent.click(first);
    expect(first).toBeChecked();
    expect(screen.getByText(`1 of ${top.actions.length} done`)).toBeInTheDocument();
  });

  it("changes who to tell with the mission without leaving the card", () => {
    render(<Decision />);
    const mars = engine("MARS").assessments[0]!.escalation;
    const iss = engine("ISS").assessments[0]!.escalation;
    expect(mars.now).not.toBe(iss.now);
    showCard("Who to tell");
    expect(within(slide()).getByText(mars.now)).toBeInTheDocument();
    openDemo();
    fireEvent.click(screen.getByRole("button", { name: "ISS" }));
    expect(slide()).toHaveAccessibleName("4 of 5: Who to tell");
    expect(within(slide()).getByText(iss.now)).toBeInTheDocument();
  });

  it("queues the packet on Mars and sends it live on the ISS", () => {
    render(<Decision />);
    showCard("Who to tell");
    fireEvent.click(screen.getByRole("button", { name: "Send to flight surgeon" }));
    expect(within(slide()).getByRole("status")).toHaveTextContent("Queued");
    expect(store.getState().packet).toMatchObject({ mission: "MARS", delivery: "next-window" });
    openDemo();
    fireEvent.click(screen.getByRole("button", { name: "ISS" }));
    fireEvent.click(screen.getByRole("button", { name: "Send to flight surgeon" }));
    expect(within(slide()).getByRole("status")).toHaveTextContent("Sent");
    expect(store.getState().packet?.delivery).toBe("live");
    showCard("Done for today");
    expect(within(slide()).getByText("Flight surgeon packet sent")).toBeInTheDocument();
  });

  it("explains with the deterministic coach behind Why?", async () => {
    render(<Decision />);
    showCard("Why");
    fireEvent.click(screen.getByText("Why? Sources and explanation"));
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
    showCard("Why");
    fireEvent.click(screen.getByText("Why? Sources and explanation"));
    fireEvent.click(screen.getByRole("button", { name: "Explain" }));
    expect(await screen.findByText(/On-device model not used/)).toBeInTheDocument();
    expect(screen.getByText("Deterministic coach")).toBeInTheDocument();
  });

  it("ends the flow and leads to Trends", () => {
    render(<Decision />);
    showCard("Done for today");
    fireEvent.click(screen.getByRole("button", { name: /See your trends/ }));
    expect(window.location.search).toBe("?view=trends");
  });

  it("keeps reproductive detail private in the packet by default", () => {
    expect(buildPacket(engine()).reproductiveDetail).toBe("private");
    expect(buildPacket(engine(), { shareReproductiveWithGround: true }).reproductiveDetail).toBe(
      "shared",
    );
  });

  it("shows a single green card on a nominal day", () => {
    store.getState().setScenario("nominal");
    render(<Decision />);
    expect(screen.getByRole("heading", { name: "All good today" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "What to do" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send to flight surgeon" }),
    ).not.toBeInTheDocument();
  });
});
