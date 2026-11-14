import { ChevronDown, ChevronLeft, ChevronRight, FlaskConical, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { scenarios } from "../data/scenarios";
import type { Mission } from "../domain/types";
import { dayRange, useOrbiStore, useScenario } from "../store/orbiStore";
import { Button } from "./ui/Button";
import { cn } from "./ui/cn";

const MISSIONS: { id: Mission; label: string }[] = [
  { id: "ISS", label: "ISS" },
  { id: "MOON", label: "Moon" },
  { id: "MARS", label: "Mars" },
];

/**
 * Demo controls shared by the mission screens: scenario, mission, day, reset and cycle switch.
 * Folded into a small pill so the astronaut screen stays clean.
 */
export function DemoBar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const scenario = useScenario();
  const day = useOrbiStore((state) => state.day);
  const mission = useOrbiStore((state) => state.mission);
  const cycleAware = useOrbiStore((state) => state.cycleAware);
  const { setScenario, setDay, nextDay, setMission, setCycleAware, reset } =
    useOrbiStore.getState();
  const { first, last } = dayRange(scenario);
  const scenarioId = useId();
  const panelId = useId();
  const missionLabel = MISSIONS.find((item) => item.id === mission)?.label ?? mission;

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong bg-surface px-3 py-1.5 text-caption text-muted transition-colors hover:text-ink"
      >
        <FlaskConical className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <span className="font-mono text-label font-semibold text-accent uppercase">Demo</span>
        <span>
          {scenario.title} · {missionLabel} · Day {day}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <section
          id={panelId}
          aria-label="Demo controls"
          className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-dashed border-line-strong bg-surface px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <label htmlFor={scenarioId} className="font-mono text-label text-faint uppercase">
              Scenario
            </label>
            <select
              id={scenarioId}
              value={scenario.id}
              onChange={(event) => setScenario(event.target.value)}
              className="h-9 rounded-lg border border-line bg-surface-strong px-2 text-caption text-ink"
            >
              {scenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Mission</legend>
            <span aria-hidden="true" className="font-mono text-label text-faint uppercase">
              Mission
            </span>
            <div className="inline-flex gap-1 rounded-xl border border-line bg-surface-strong p-1">
              {MISSIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mission === item.id}
                  onClick={() => setMission(item.id)}
                  className={cn(
                    "h-8 rounded-lg px-3 text-caption font-medium transition-colors",
                    mission === item.id
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Previous day"
              disabled={day <= first}
              onClick={() => setDay(day - 1)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="min-w-20 text-center font-mono text-caption tabular-nums">
              Day {day}
            </span>
            <Button size="sm" variant="secondary" disabled={day >= last} onClick={nextDay}>
              Next day
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={cycleAware}
              aria-label="Cycle-aware baseline"
              onClick={() => setCycleAware(!cycleAware)}
              className={cn(
                "relative h-6 w-10 shrink-0 rounded-full border transition-colors",
                cycleAware ? "border-accent bg-accent" : "border-line-strong bg-surface-strong",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform",
                  cycleAware ? "translate-x-4 bg-on-accent" : "translate-x-0 bg-muted",
                )}
              />
            </button>
            <span className="text-caption">
              Cycle-aware baseline
              <span className="ml-1.5 text-faint">
                · {cycleAware ? "on" : "off"}, engine support pending
              </span>
            </span>
          </div>

          <Button size="sm" variant="ghost" onClick={reset} className="ml-auto">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
        </section>
      )}
    </div>
  );
}
