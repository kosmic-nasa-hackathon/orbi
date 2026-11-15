import { useEffect, useState } from "react";
import { ScreenTransition } from "./components/motion/ScreenTransition";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { isMissionView, type MissionView, readView, type View, writeView } from "./navigation";
import Body from "./screens/Body";
import Console from "./screens/Console";
import Decision from "./screens/Decision";
import Eva from "./screens/Eva";
import Home from "./screens/Home";
import MissionControl from "./screens/MissionControl";
import Today from "./screens/Today";
import Trends from "./screens/Trends";

const TITLES: Record<View, string> = {
  home: "ORBI · Health autonomy console",
  eva: "EVA autonomy · ORBI",
  console: "Engine console · ORBI",
  today: "Today · ORBI",
  body: "Body · ORBI",
  decision: "Decision · ORBI",
  trends: "Trends · ORBI",
  ground: "Mission Control · ORBI",
};

const MISSION_SCREENS: Record<MissionView, () => React.JSX.Element> = {
  today: Today,
  body: Body,
  decision: Decision,
  trends: Trends,
  ground: MissionControl,
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
        {isMissionView(view) ? (
          <>
            <ScreenTransition screenKey={view}>
              <MissionScreen view={view} />
            </ScreenTransition>
            <SiteFooter onNavigate={navigate} />
          </>
        ) : (
          // Home, EVA and Console still use dark-only colours; they stay dark until lane E (#16) moves them to tokens.
          <div data-theme="dark" className="orbi-backdrop min-h-full">
            {view === "home" ? (
              <Home onNavigate={navigate} />
            ) : view === "eva" ? (
              <Eva />
            ) : (
              <Console />
            )}
            <SiteFooter onNavigate={navigate} />
          </div>
        )}
      </main>
    </div>
  );
}

function MissionScreen({ view }: { view: MissionView }) {
  const Screen = MISSION_SCREENS[view];
  return <Screen />;
}
