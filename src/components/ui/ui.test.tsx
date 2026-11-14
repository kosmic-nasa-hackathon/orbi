import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { LevelBadge } from "./Badge";
import { Tabs } from "./Tabs";

describe("LevelBadge", () => {
  it("names the level in text, not only in colour", () => {
    render(<LevelBadge level="CONCERN" />);
    expect(screen.getByText("Concern")).toBeInTheDocument();
  });
});

function TabsHarness() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <Tabs
      label="Systems"
      value={value}
      onChange={setValue}
      items={[
        { id: "a", label: "Alpha" },
        { id: "b", label: "Beta" },
        { id: "c", label: "Gamma" },
      ]}
    />
  );
}

describe("Tabs", () => {
  it("moves the selection with the arrow keys and wraps around", () => {
    render(<TabsHarness />);
    const list = screen.getByRole("tablist", { name: "Systems" });
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveFocus();
    fireEvent.keyDown(list, { key: "End" });
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
  });
});
