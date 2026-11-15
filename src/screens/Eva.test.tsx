import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Eva from "./Eva";

function autoReturn() {
  return screen.getByRole("checkbox", { name: /Auto-return/ });
}

describe("Eva", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("starts with auto-return off without a deep link", () => {
    window.history.replaceState(null, "", "/?view=eva");
    render(<Eva />);
    expect(autoReturn()).not.toBeChecked();
  });

  it("matches the controls to the state a ?t= deep link pre-advanced", () => {
    window.history.replaceState(null, "", "/?view=eva&t=30");
    render(<Eva />);
    expect(autoReturn()).toBeChecked();
  });
});
