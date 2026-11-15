import { useEffect, useState } from "react";
import type { Level } from "../../../domain/types";

/**
 * Colours for the WebGL scene, read from the same CSS tokens the 2D view uses
 * (`--orbi-nominal`, …). WebGL cannot read CSS variables, so we resolve them
 * and re-read whenever `data-theme` changes on <html>.
 */
export interface Palette {
  dark: boolean;
  level: Record<Level, string>;
  ink: string;
  muted: string;
}

/** Same three-colour traffic light as the 2D view: CONCERN and URGENT share red. */
const LEVEL_VAR: Record<Level, string> = {
  NOMINAL: "--orbi-nominal",
  WATCH: "--orbi-watch",
  CONCERN: "--orbi-urgent",
  URGENT: "--orbi-urgent",
};

function readPalette(): Palette {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    dark: root.dataset.theme !== "light",
    level: {
      NOMINAL: read(LEVEL_VAR.NOMINAL, "#34d399"),
      WATCH: read(LEVEL_VAR.WATCH, "#fbbf24"),
      CONCERN: read(LEVEL_VAR.CONCERN, "#f87171"),
      URGENT: read(LEVEL_VAR.URGENT, "#f87171"),
    },
    ink: read("--orbi-ink", "#e6f1f5"),
    muted: read("--orbi-muted", "#8fa3ad"),
  };
}

export function usePalette(): Palette {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // The theme may have been applied after our first read.
    setPalette(readPalette());
    return () => observer.disconnect();
  }, []);
  return palette;
}
