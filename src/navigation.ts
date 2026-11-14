export type MissionView = "today" | "body" | "decision" | "trends" | "ground";
export type View = "home" | "eva" | "console" | MissionView;

/** Screens of the astronaut app, in subnav order. `ground` is Mission Control. */
export const MISSION_VIEWS: MissionView[] = ["today", "body", "decision", "trends", "ground"];

const VIEWS: View[] = ["home", "eva", "console", ...MISSION_VIEWS];

export function isMissionView(view: View): view is MissionView {
  return (MISSION_VIEWS as View[]).includes(view);
}

export function viewHref(view: View): string {
  return view === "home" ? "/" : `/?view=${view}`;
}

export function readView(search?: string): View {
  const query = search ?? (typeof window === "undefined" ? "" : window.location.search);
  const params = new URLSearchParams(query);
  const requested = params.get("view");
  if (requested && VIEWS.includes(requested as View)) return requested as View;
  if (params.has("t")) return "eva";
  return "home";
}

export function writeView(view: View, replace = false): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.search = "";
  if (view !== "home") url.searchParams.set("view", view);
  const method = replace ? "replaceState" : "pushState";
  window.history[method](null, "", url);
}

/** Moves to another view from inside a screen; App picks it up through its popstate listener. */
export function goTo(view: View): void {
  if (typeof window === "undefined") return;
  writeView(view);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "auto" });
}
