import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getScenario } from "../data/scenarios";
import { DEMO_DAY, useOrbiStore } from "../store/orbiStore";
import Today, { TodayScreen } from "./Today";

const store = useOrbiStore;

function glucoseInput() {
  return screen.getByLabelText("Glucose (mg/dL)");
}

function openDemo() {
  fireEvent.click(screen.getByRole("button", { expanded: false, name: /Demo/ }));
}

describe("Today", () => {
  beforeEach(() => {
    store.getState().reset();
    window.history.replaceState(null, "", "/?view=today");
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows the first step and the wearable values of day 148 as read-only chips", () => {
    render(<Today />);
    expect(screen.getByText("Day 148 · Mars")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Check-in/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
    const synced = screen
      .getByRole("heading", { name: "Synced from your wearable" })
      .closest("section");
    expect(synced).not.toBeNull();
    const panel = within(synced as HTMLElement);
    const reading = getScenario("early-infection").readings.find((r) => r.day === DEMO_DAY)!;
    expect(panel.getByText(reading.sleepHours.toFixed(1))).toBeInTheDocument();
    expect(panel.getByText(String(reading.restingHr))).toBeInTheDocument();
    expect(panel.getByText(reading.tempC.toFixed(1))).toBeInTheDocument();
    expect(panel.getByText(String(reading.spo2))).toBeInTheDocument();
    expect(panel.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getAllByRole("textbox")).toEqual([glucoseInput()]);
  });

  it("pre-fills mood, fatigue and glucose and lets the astronaut change them", () => {
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
    fireEvent.click(screen.getByRole("button", { name: "Increase glucose" }));
    expect(glucoseInput()).toHaveValue("92");
    fireEvent.click(screen.getByRole("button", { name: "Decrease glucose" }));
    fireEvent.click(screen.getByRole("button", { name: "Decrease glucose" }));
    expect(glucoseInput()).toHaveValue("82");
    fireEvent.change(glucoseInput(), { target: { value: "110" } });
    expect(glucoseInput()).toHaveValue("110");
  });

  it("confirms, stores the values and moves on to the Body step", () => {
    vi.useFakeTimers();
    render(<Today />);
    fireEvent.click(
      within(screen.getByRole("radiogroup", { name: "Fatigue" })).getByRole("radio", {
        name: "3 · Tired",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("status")).toHaveTextContent("Confirmed");
    expect(store.getState().checkIn?.manual).toEqual({ mood: 2, fatigue: 3, glucoseMgDl: 87 });
    expect(store.getState().streak).toBe(1);
    expect(window.location.search).toBe("?view=today");
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(window.location.search).toBe("?view=body");
  });

  it("offers the next step when coming back to a confirmed day", () => {
    store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 90 });
    render(<Today />);
    expect(screen.getByRole("status")).toHaveTextContent("Check-in confirmed");
    expect(screen.getByText("1-day streak")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /See your body/ }));
    expect(window.location.search).toBe("?view=body");
  });

  it("shows the error state for an invalid glucose value and stays on the step", () => {
    render(<Today />);
    fireEvent.change(glucoseInput(), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Glucose must be a whole number");
    expect(glucoseInput()).toHaveAttribute("aria-invalid", "true");
    expect(store.getState().checkIn).toBeNull();
    expect(window.location.search).toBe("?view=today");
  });

  it("keeps the demo controls folded and moves to the next day from them", () => {
    store.getState().setDay(147);
    render(<Today />);
    expect(screen.queryByRole("button", { name: /Next day/ })).not.toBeInTheDocument();
    expect(glucoseInput()).toHaveValue("105");
    openDemo();
    fireEvent.click(screen.getByRole("button", { name: /Next day/ }));
    expect(screen.getByText("Day 148 · Mars")).toBeInTheDocument();
    expect(glucoseInput()).toHaveValue("87");
  });

  it("writes the cycle-aware switch to the store", () => {
    render(<Today />);
    openDemo();
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
