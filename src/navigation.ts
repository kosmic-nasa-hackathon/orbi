export type View = "home" | "eva" | "console";

const VIEWS: View[] = ["home", "eva", "console"];

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
