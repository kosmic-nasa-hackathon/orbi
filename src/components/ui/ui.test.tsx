import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { LevelBadge } from "./Badge";
import { Button } from "./Button";
import { cn, cnSized } from "./cn";
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

describe("Button", () => {
  it("keeps the variant text colour next to the size", () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="ghost" size="lg" className="px-0">
          Ghost
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass(
      "text-on-accent",
      "text-body",
    );
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveClass(
      "text-ink",
      "text-caption",
    );
    const ghost = screen.getByRole("button", { name: "Ghost" });
    expect(ghost).toHaveClass("text-muted", "text-lead", "px-0");
    expect(ghost).not.toHaveClass("px-5");
  });
});

describe("cnSized", () => {
  it("treats design-system sizes as sizes, unlike cn()", () => {
    expect(cnSized("text-body", "text-on-accent")).toBe("text-body text-on-accent");
    expect(cnSized("text-caption", "text-lead")).toBe("text-lead");
    expect(cn("text-on-accent", "text-body")).toBe("text-body");
  });
});
