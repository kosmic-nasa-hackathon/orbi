import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";

describe("Home", () => {
  it("leads with the daily check and keeps EVA as a secondary demo", () => {
    const onNavigate = vi.fn();
    render(<Home onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Start the daily check/ }));
    expect(onNavigate).toHaveBeenCalledWith("today");
    fireEvent.click(screen.getByRole("button", { name: /Open EVA demo/ }));
    expect(onNavigate).toHaveBeenCalledWith("eva");
  });

  it("points to the pending threshold sources", () => {
    const onNavigate = vi.fn();
    render(<Home onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /sources pending verification/ }));
    expect(onNavigate).toHaveBeenCalledWith("console");
  });
});
