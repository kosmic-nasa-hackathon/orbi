import { AIRLOCK, type EvaState, SHIP_RADIUS, type Vec2 } from "../../simulation/eva";

function points(points: Vec2[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function headingDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function EvaMap({ state, view }: { state: EvaState; view: "suit" | "central" }) {
  const suitView = view === "suit";
  const marker = suitView ? state.estPos : state.centralPos;
  const trail = suitView ? state.estTrail : state.centralTrail;
  const driftRadius = Math.max(2, Math.min(18, 1.5 + state.drift * 2));
  const returning = state.returnMode === "ACTIVE" || state.returnMode === "COMPLETE";
  const showReturn = suitView && (state.returnMode === "RECOMMENDED" || returning);
  const lost = state.link === "LOST" || state.link === "DEGRADED";

  return (
    <svg
      viewBox="-52 -52 104 104"
      className="h-full w-full"
      role="img"
      aria-label={
        suitView
          ? `Suit map. ${state.link === "LOST" ? "No sync." : "Link active."} Estimated position ${Math.round(state.estPos.x)}, ${Math.round(state.estPos.y)}.`
          : `Central map. Last known position ${Math.round(state.centralPos.x)}, ${Math.round(state.centralPos.y)}.`
      }
    >
      <defs>
        <radialGradient id={`eva-bg-${view}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#0b172a" />
          <stop offset="100%" stopColor="#05070d" />
        </radialGradient>
        <pattern id={`eva-grid-${view}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="rgba(148,163,184,0.09)"
            strokeWidth="0.25"
          />
        </pattern>
        <marker
          id={`eva-arrow-${view}`}
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="#22d3ee" />
        </marker>
        <filter id={`eva-glow-${view}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="-52" y="-52" width="104" height="104" fill={`url(#eva-bg-${view})`} rx="4" />
      <rect x="-52" y="-52" width="104" height="104" fill={`url(#eva-grid-${view})`} rx="4" />

      <line
        x1="0"
        y1={-SHIP_RADIUS}
        x2={AIRLOCK.x}
        y2={AIRLOCK.y}
        stroke="rgba(148,163,184,0.35)"
        strokeWidth="0.7"
      />
      <circle
        cx="0"
        cy="0"
        r={SHIP_RADIUS}
        fill="rgba(8,15,28,0.92)"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="0.6"
      />
      <circle
        cx="0"
        cy="0"
        r={SHIP_RADIUS - 1.4}
        fill="none"
        stroke="rgba(148,163,184,0.16)"
        strokeWidth="0.35"
        strokeDasharray="1 2"
      />
      <rect
        x="-1.7"
        y={AIRLOCK.y - 1.5}
        width="3.4"
        height="3"
        rx="0.7"
        fill="rgba(34,211,238,0.12)"
        stroke="rgba(34,211,238,0.7)"
        strokeWidth="0.4"
        className={returning ? "orbi-pulse" : undefined}
      />
      {showReturn && (
        <line
          x1={state.estPos.x}
          y1={state.estPos.y}
          x2={AIRLOCK.x}
          y2={AIRLOCK.y}
          stroke="#22d3ee"
          strokeWidth="0.7"
          strokeDasharray="2.5 2.5"
          markerEnd={`url(#eva-arrow-${view})`}
          className="orbi-dash"
          opacity="0.85"
        />
      )}

      <polyline
        points={points(trail)}
        fill="none"
        stroke={suitView ? "rgba(251,191,36,0.75)" : "rgba(52,211,153,0.55)"}
        strokeWidth="0.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={suitView ? "1.6 1.8" : undefined}
      />

      {suitView && (
        <>
          <polyline
            points={points(state.trueTrail)}
            fill="none"
            stroke="rgba(34,211,238,0.22)"
            strokeWidth="0.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={state.truePos.x} cy={state.truePos.y} r="1.1" fill="rgba(34,211,238,0.55)" />
          <circle
            cx={state.estPos.x}
            cy={state.estPos.y}
            r={driftRadius}
            fill="rgba(251,191,36,0.05)"
            stroke="rgba(251,191,36,0.32)"
            strokeWidth="0.35"
            strokeDasharray="1.5 2"
          />
        </>
      )}

      <g
        transform={`translate(${marker.x} ${marker.y}) rotate(${headingDegrees(state.heading)})`}
        filter={`url(#eva-glow-${view})`}
      >
        <path d="M 2.8 0 L -1.8 1.6 L -1.8 -1.6 Z" fill={suitView ? "#fbbf24" : "#34d399"} />
      </g>
      <circle
        cx={marker.x}
        cy={marker.y}
        r="2.6"
        fill={suitView ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.18)"}
        stroke={suitView ? "#fbbf24" : "#34d399"}
        strokeWidth="0.45"
      />
      {!suitView && lost && (
        <circle
          cx={marker.x}
          cy={marker.y}
          r="5"
          fill="none"
          stroke="rgba(248,113,113,0.5)"
          strokeWidth="0.4"
          strokeDasharray="1 1.6"
          className="orbi-pulse"
        />
      )}

      {/* Map text is sized in viewBox units: 3.2 ≈ 11 px and 3.6 ≈ 13 px at tablet width. */}
      <text x="0" y="1.2" textAnchor="middle" fontSize="3.2" className="fill-muted">
        HABITAT
      </text>
      <text
        x={AIRLOCK.x}
        y={AIRLOCK.y - 3.6}
        textAnchor="middle"
        fontSize="3.2"
        className="fill-accent"
      >
        AIRLOCK
      </text>
      <text x="-49" y="-45.5" fontSize="3.2" className="fill-faint">
        {suitView ? "SUIT ESTIMATE" : "CENTRAL LAST KNOWN"}
      </text>
      <text x="-49" y="48.5" fontSize="3.6" className="fill-faint">
        {suitView
          ? `drift ±${state.drift.toFixed(1)} m · ${returning ? "return guidance" : "inertial only"}`
          : `age ${Math.round(state.elapsed - state.centralAt)} s · ${lost ? "no live telemetry" : "live"}`}
      </text>
    </svg>
  );
}
