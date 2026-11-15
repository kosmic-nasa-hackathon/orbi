import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BUILD } from "../version";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the deployed version and the disclaimer", () => {
    render(<SiteFooter onNavigate={() => {}} />);
    expect(screen.getByText(new RegExp(BUILD.label.replace(".", "\\.")))).toBeInTheDocument();
    expect(screen.getByText(/no diagnosis, no treatment/)).toBeInTheDocument();
  });

  it("navigates from its links", () => {
    const onNavigate = vi.fn();
    render(<SiteFooter onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /EVA/ }));
    expect(onNavigate).toHaveBeenCalledWith("eva");
  });
});
