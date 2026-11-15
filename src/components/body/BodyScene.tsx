import { BodyZones } from "./BodyZones";
import { RadiationHalo } from "./RadiationHalo";
import { SatelliteRing } from "./SatelliteRing";
import { type BodySceneProps, VIEW } from "./scene";

/** The body in orbit: satellite ring, radiation halo and the body zones. Ported from orbiui. */
export function BodyScene({ evaluation, reading, selected, onSelect }: BodySceneProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: an <svg> cannot be a <fieldset>; group keeps the zone buttons reachable (img would hide them).
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="mx-auto h-auto max-h-[78vh] w-full max-w-[640px]"
      role="group"
      aria-label="The astronaut's body with the seven monitored systems in orbit"
    >
      {/* The halo goes first so the satellite nodes sit on top of its line. */}
      <RadiationHalo
        level={evaluation.bySystem.radiation}
        doseMSv={evaluation.estimates.radiationDoseMSv}
        budgetMSv={evaluation.estimates.radiationBudgetMSv}
        pct={evaluation.estimates.radiationPct}
        onSelect={() => onSelect("radiation")}
      />
      <SatelliteRing
        reading={reading}
        bySystem={evaluation.bySystem}
        selected={selected}
        onSelect={onSelect}
      />
      <BodyZones bySystem={evaluation.bySystem} selected={selected} onSelect={onSelect} />
    </svg>
  );
}
