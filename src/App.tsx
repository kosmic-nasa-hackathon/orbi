import { useEffect, useState } from "react";
import { SiteNav } from "./components/SiteNav";
import { readView, type View, writeView } from "./navigation";
import Console from "./screens/Console";
import Eva from "./screens/Eva";
import Home from "./screens/Home";

const TITLES: Record<View, string> = {
  home: "ORBI · Health autonomy console",
  eva: "EVA autonomy · ORBI",
  console: "Engine console · ORBI",
};

export default function App() {
  const [view, setView] = useState<View>(() => readView());

  useEffect(() => {
    function onPopState() {
      setView(readView());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = TITLES[view];
  }, [view]);

  function navigate(next: View) {
    if (next !== view) {
      writeView(next);
      setView(next);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav current={view} onNavigate={navigate} />
      <main className="flex-1">
        {view === "home" ? <Home onNavigate={navigate} /> : view === "eva" ? <Eva /> : <Console />}
      </main>
    </div>
  );
}
