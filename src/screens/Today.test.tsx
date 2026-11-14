import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getScenario } from "../data/scenarios";
import { DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Today, { TodayScreen } from "./Today";

const store = useOrbiStore;

function glucoseInput() {
  return screen.getByLabelText("Glucose (mg/dL)");
}

describe("Today", () => {
  beforeEach(() => store.getState().reset());

  it("pre-fills the wearable fields of day 148 as read-only values", () => {
    render(<Today />);
    expect(screen.getByText("Mission day 148 · Mars")).toBeInTheDocument();
    const wearable = screen
      .getByRole("heading", { name: "Synced from wearable" })
      .closest("section");
    expect(wearable).not.toBeNull();
    const panel = within(wearable as HTMLElement);
    const reading = getScenario("early-infection").readings.find((r) => r.day === DEMO_DAY)!;
    expect(panel.getByText(reading.sleepHours.toFixed(1))).toBeInTheDocument();
    expect(panel.getByText(String(reading.restingHr))).toBeInTheDocument();
    expect(panel.getByText(reading.tempC.toFixed(1))).toBeInTheDocument();
    expect(panel.getByText(String(reading.spo2))).toBeInTheDocument();
    expect(panel.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getAllByRole("textbox")).toEqual([glucoseInput()]);
  });

  it("pre-fills the manual fields and lets the astronaut edit them", () => {
    render(<Today />);
    expect(glucoseInput()).toHaveValue("87");
    const mood = screen.getByRole("radiogroup", { name: "Mood" });
    expect(within(mood).getByRole("radio", { name: "2 · Low" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    fireEvent.click(within(mood).getByRole("radio", { name: "4 · Good" }));
    expect(within(mood).getByRole("radio", { name: "4 · Good" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    fireEvent.change(glucoseInput(), { target: { value: "110" } });
    expect(glucoseInput()).toHaveValue("110");
  });

  it("confirms the check-in, stores the values and starts the streak", () => {
    render(<Today />);
    expect(screen.getByRole("status")).toHaveTextContent("Not confirmed yet");
    fireEvent.click(
      within(screen.getByRole("radiogroup", { name: "Fatigue" })).getByRole("radio", {
        name: "3 · Tired",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("status")).toHaveTextContent("Check-in confirmed for day 148");
    expect(screen.getByText("1-day streak")).toBeInTheDocument();
    expect(store.getState().checkIn?.manual).toEqual({ mood: 2, fatigue: 3, glucoseMgDl: 87 });
  });

  it("shows the error state for an invalid glucose value", () => {
    render(<Today />);
    fireEvent.change(glucoseInput(), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Glucose must be a whole number");
    expect(glucoseInput()).toHaveAttribute("aria-invalid", "true");
    expect(store.getState().checkIn).toBeNull();
  });

  it("moves to the next day with new data and an empty check-in", () => {
    store.getState().setDay(147);
    render(<Today />);
    expect(glucoseInput()).toHaveValue("105");
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    fireEvent.click(screen.getByRole("button", { name: /Next day/ }));
    expect(screen.getByText("Mission day 148 · Mars")).toBeInTheDocument();
    expect(glucoseInput()).toHaveValue("87");
    expect(screen.getByRole("status")).toHaveTextContent("Not confirmed yet");
  });

  it("writes the cycle-aware switch to the store", () => {
    render(<Today />);
    const toggle = screen.getByRole("switch", { name: "Cycle-aware baseline" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    fireEvent.click(toggle);
    expect(store.getState().cycleAware).toBe(false);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("asks about the period only when the cycle is tracked", () => {
    const { unmount } = render(<TodayScreen cycle="suppressed" />);
    expect(screen.queryByRole("radiogroup", { name: "Period today?" })).not.toBeInTheDocument();
    unmount();
    render(<TodayScreen cycle="tracked" />);
    const period = screen.getByRole("radiogroup", { name: "Period today?" });
    fireEvent.click(within(period).getByRole("radio", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(store.getState().checkIn?.manual.periodToday).toBe(true);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("hides the period field by default until the crew profile exists", () => {
    render(<Today />);
    expect(screen.queryByText("Period today?")).not.toBeInTheDocument();
  });
});
