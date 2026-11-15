import { BODY_OUTLINE, DETAILS, HEAD } from "./geometry";

/**
 * Anatomical silhouette drawn as one continuous contour, like a medical
 * body chart: shoulders, arms with volume, hands, waist, hips, knees,
 * calves and feet. The whole outline is the Immune zone, so its stroke takes
 * the immune level colour (temperature = the body itself).

 */
export function BodyFigure({ onSelect }: { onSelect: () => void }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG group cannot be a <button>; it gets role, tabIndex and Enter/Space handling.
    <g
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label="Whole body outline — Immune system"
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
    >
      <title>Whole body — Immune system</title>

      {/* Body mass: a faint fill makes it read as a figure, not a wireframe */}
      <path d={BODY_OUTLINE} fill="currentColor" fillOpacity={0.06} />
      <path d={HEAD} fill="currentColor" fillOpacity={0.06} />

      <g strokeWidth={1.2} opacity={0.45}>
        {DETAILS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Ground hint */}
      <ellipse
        cx={280}
        cy={516}
        rx={70}
        ry={9}
        fill="none"
        className="stroke-line"
        strokeWidth={1}
        strokeDasharray="3 6"
      />
    </g>
  );
}
