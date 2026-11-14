import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SyncBadge } from "./SyncBadge";

describe("SyncBadge", () => {
  it("shows a clear no-sync state", () => {
    render(<SyncBadge link="LOST" age={18} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("NO SYNC");
    expect(badge).toHaveTextContent("18 s");
  });

  it("shows live sync without an age", () => {
    render(<SyncBadge link="SYNCED" age={0} />);
    expect(screen.getByRole("status")).toHaveTextContent("SYNCED");
    expect(screen.getByRole("status")).toHaveTextContent("live");
  });
});
