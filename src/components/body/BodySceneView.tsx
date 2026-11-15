import { Box, Square } from "lucide-react";
import { Component, lazy, type ReactNode, Suspense, useId, useState } from "react";
import { Tabs, tabPanelProps } from "../ui/Tabs";
import { BodyScene } from "./BodyScene";
import type { BodySceneProps } from "./scene";

/** three.js only downloads when someone opens the 3D view. */
const BodyScene3D = lazy(() => import("./3d/BodyScene3D"));

export type BodyView = "2d" | "3d";

/** Not `view`: that query parameter is the app route (`?view=body`). */
const VIEW_PARAM = "figure";

function readViewFromUrl(): BodyView {
  return new URLSearchParams(window.location.search).get(VIEW_PARAM) === "3d" ? "3d" : "2d";
}

function writeViewToUrl(view: BodyView) {
  const url = new URL(window.location.href);
  if (view === "3d") url.searchParams.set(VIEW_PARAM, "3d");
  else url.searchParams.delete(VIEW_PARAM);
  window.history.replaceState(null, "", url);
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The body scene with an in-place 2D/3D switch. Both views take the same
 * props, so selection, scenario and day survive the swap. The choice is kept
 * in `?figure=3d` so a 3D link can be shared.
 */
export function BodySceneView(props: BodySceneProps) {
  const [webgl] = useState(supportsWebGL);
  const [view, setView] = useState<BodyView>(() => (webgl ? readViewFromUrl() : "2d"));
  const base = useId();

  function changeView(next: BodyView) {
    if (next === "3d" && !webgl) return;
    setView(next);
    writeViewToUrl(next);
  }

  return (
    <div className="relative">
      <Tabs<BodyView>
        label="Body view"
        idBase={base}
        value={view}
        onChange={changeView}
        className="absolute top-0 left-0 z-10"
        items={[
          {
            id: "2d",
            label: (
              <span className="flex items-center gap-1.5">
                <Square className="size-3.5" aria-hidden /> 2D
              </span>
            ),
          },
          {
            id: "3d",
            label: (
              <span
                className="flex items-center gap-1.5"
                title={
                  webgl
                    ? "Rotatable 3D view"
                    : "3D needs WebGL, which this browser does not provide"
                }
              >
                <Box className="size-3.5" aria-hidden /> 3D
              </span>
            ),
          },
        ]}
      />

      <div {...tabPanelProps(base, view)}>
        {view === "3d" && webgl ? (
          <SceneErrorBoundary fallback={<Unavailable onBack={() => changeView("2d")} />}>
            <Suspense fallback={<Loading />}>
              <BodyScene3D {...props} />
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <BodyScene {...props} />
        )}
      </div>
    </div>
  );
}

/** Placeholder box matching the 3D scene (full width, 2D height). */
const SCENE_BOX = { height: "min(78vh, 760px, 120vw)" };

function Loading() {
  return (
    <div className="flex w-full items-center justify-center" style={SCENE_BOX}>
      <span className="font-mono text-label text-faint uppercase">Loading 3D view…</span>
    </div>
  );
}

function Unavailable({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3" style={SCENE_BOX}>
      <span className="text-caption text-muted">The 3D view could not start on this device.</span>
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-line px-3 py-1 text-caption text-ink"
      >
        Back to 2D
      </button>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
