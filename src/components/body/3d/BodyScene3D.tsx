import { Billboard, CameraControls, CameraControlsImpl, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { clsx } from "clsx";
import { Pause, Play, Radiation } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type KeyboardEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, type Group, LineDashedMaterial, Line as ThreeLine, Vector3 } from "three";
import { SYSTEM_INFO } from "../../../content/systems";
import type { Level, SystemId } from "../../../domain/types";
import {
  type BodySceneProps,
  LEVEL_FILL_OPACITY,
  LEVEL_TEXT,
  SATELLITES,
  slotAngle,
} from "../scene";
import {
  brainWaveLines,
  buildBody,
  buildBones,
  buildBrain,
  buildGut,
  buildHeart,
  buildLungs,
  ellipsoid,
  gutFoldLines,
} from "./bodyGeometry";
import { type HoloLook, HoloSurface } from "./HoloSurface";
import { anchorWorld, toWorld, type Vec3 } from "./space";
import { type Palette, usePalette } from "./usePalette";

const { ACTION } = CameraControlsImpl;

/** Camera: slightly above chest height, looking at the body's centre. */
const CAMERA = { fov: 30, polar: 1.46, target: [0, -0.1, 0] as Vec3 };
const ORBIT = { radius: 2.3, y: toWorld(280, 250)[1], seconds: 90 };
/** What must stay in frame at the default zoom: the body and the whole orbit. */
const FRAME = { halfHeight: 2.75, halfWidth: ORBIT.radius + 0.4 };

/** Camera distance that keeps FRAME visible for a canvas aspect ratio. */
function fitDistance(aspect: number): number {
  const t = Math.tan((CAMERA.fov * Math.PI) / 360);
  return Math.max(FRAME.halfHeight / t, FRAME.halfWidth / (t * aspect));
}
const DOSE_RING = { radius: 1.1, y: toWorld(280, 516)[1] };
const AUTO_ROTATE_SPEED = 0.28; // rad/s
const KEY_STEP = Math.PI / 12;

type Preset = "front" | "side" | "back";
const PRESET_AZIMUTH: Record<Preset, number> = { front: 0, side: Math.PI / 2, back: Math.PI };

/**
 * The 3D view: the same figure, zones, satellites and radiation budget as the
 * 2D view, as a rotatable "medical scanner" hologram. Same props as
 * BodyScene, so the screen swaps them without moving any state.
 */
export default function BodyScene3D(props: BodySceneProps) {
  const palette = usePalette();
  const reduced = useReducedMotion() ?? false;
  const controls = useRef<CameraControlsImpl | null>(null);
  /** Default zoom for the current canvas size (set by FitCamera). */
  const fit = useRef(fitDistance(1));
  const [autoRotate, setAutoRotate] = useState(!reduced);
  /** Satellite buttons live in the DOM (focusable, crisp text); the scene positions them. */
  const satelliteEls = useRef<(HTMLButtonElement | null)[]>([]);
  const { evaluation, reading, selected, onSelect } = props;
  const radiationLevel = evaluation.bySystem.radiation;

  function rotateToPreset(preset: Preset) {
    const c = controls.current;
    if (!c) return;
    setAutoRotate(false);
    c.normalizeRotations();
    // Shortest way round to the preset azimuth.
    const target = PRESET_AZIMUTH[preset];
    const turns = Math.round((c.azimuthAngle - target) / (Math.PI * 2));
    void c.rotateTo(target + turns * Math.PI * 2, CAMERA.polar, !reduced);
    if (preset === "front") void c.dollyTo(fit.current, !reduced);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const c = controls.current;
    if (!c || event.target !== event.currentTarget) return;
    const animate = !reduced;
    switch (event.key) {
      case "ArrowLeft":
        c.rotate(-KEY_STEP, 0, animate);
        break;
      case "ArrowRight":
        c.rotate(KEY_STEP, 0, animate);
        break;
      case "ArrowUp":
        c.rotate(0, -KEY_STEP / 2, animate);
        break;
      case "ArrowDown":
        c.rotate(0, KEY_STEP / 2, animate);
        break;
      case "+":
      case "=":
        c.dolly(1, animate);
        break;
      case "-":
        c.dolly(-1, animate);
        break;
      default:
        return;
    }
    event.preventDefault();
    setAutoRotate(false);
  }

  return (
    <div
      className="relative w-full rounded-2xl"
      style={{ height: SCENE_HEIGHT }}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the 3D canvas wrapper takes arrow keys to rotate and +/− to zoom, so it must be focusable.
      tabIndex={0}
      aria-label="3D view of the astronaut's body with the seven monitored systems. Drag or use the arrow keys to rotate, + and − to zoom."
      onKeyDown={onKeyDown}
    >
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: CAMERA.fov, near: 0.1, far: 100, position: [0, 0, fit.current] }}
        className="touch-none"
        onPointerMissed={() => (document.body.style.cursor = "")}
      >
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={6}
          maxDistance={22}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.62}
          smoothTime={0.35}
          mouseButtons={{
            left: ACTION.ROTATE,
            middle: ACTION.NONE,
            right: ACTION.NONE,
            wheel: ACTION.DOLLY,
          }}
          touches={{ one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY, three: ACTION.NONE }}
          onStart={() => setAutoRotate(false)}
        />
        <FitCamera controls={controls} fit={fit} />
        <AutoRotate controls={controls} enabled={autoRotate} />

        <BodyAndZones {...props} palette={palette} reduced={reduced} />
        <SatelliteRing3D
          {...props}
          palette={palette}
          reduced={reduced}
          moving={autoRotate}
          elements={satelliteEls}
        />
        <RadiationHalo3D
          level={radiationLevel}
          pct={evaluation.estimates.radiationPct}
          palette={palette}
          onSelect={() => onSelect("radiation")}
        />
      </Canvas>

      {/* Satellites: one button per check-in reading, projected from the orbit */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {SATELLITES.map((satellite, index) => (
          <SatelliteNode
            key={satellite.field}
            nodeRef={(el) => {
              satelliteEls.current[index] = el;
            }}
            label={satellite.label}
            zone={satellite.zone}
            Icon={satellite.icon}
            value={reading ? satellite.format(satellite.pick(reading)) : "—"}
            selected={selected === satellite.zone}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Radiation budget readout (the 2D halo label) */}
      <button
        type="button"
        onClick={() => onSelect("radiation")}
        className={clsx(
          "absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-caption whitespace-nowrap text-muted hover:text-ink",
          selected === "radiation" && "text-ink",
        )}
        aria-label={`Radiation — ${Math.round(evaluation.estimates.radiationPct)}% of the mission budget`}
      >
        <Radiation className={clsx("size-3.5", LEVEL_TEXT[radiationLevel])} aria-hidden />
        {evaluation.estimates.radiationDoseMSv.toFixed(0)} /{" "}
        {evaluation.estimates.radiationBudgetMSv} mSv ·{" "}
        {Math.round(evaluation.estimates.radiationPct)}%
      </button>

      {/* View presets and auto-rotate */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
        <fieldset
          className="m-0 flex min-w-0 items-center rounded-full border border-line bg-surface/80 p-1 backdrop-blur"
          aria-label="Camera view"
        >
          {(["front", "side", "back"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => rotateToPreset(preset)}
              className="h-7 rounded-full px-3 font-mono text-label font-semibold text-muted uppercase transition-colors hover:bg-surface-strong hover:text-ink"
            >
              {preset}
            </button>
          ))}
        </fieldset>
        <button
          type="button"
          onClick={() => setAutoRotate((on) => !on)}
          aria-pressed={autoRotate}
          aria-label={autoRotate ? "Pause motion" : "Play motion"}
          title={autoRotate ? "Pause rotation and orbit" : "Play rotation and orbit"}
          className={clsx(
            "flex size-9 items-center justify-center rounded-full border border-line bg-surface/80 backdrop-blur transition-colors",
            autoRotate ? "text-accent" : "text-muted hover:text-ink",
          )}
        >
          {autoRotate ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
        </button>
      </div>

      <p className="pointer-events-none absolute top-1 right-1 font-mono text-label text-faint uppercase">
        Drag to rotate
      </p>
    </div>
  );
}

/** Same height as the 2D scene; the 3D view uses the card's full width. */
const SCENE_HEIGHT = "min(78vh, 760px, 120vw)";

// ---------------------------------------------------------------------------
// Camera helpers

/** Frames the body and orbit on mount, and re-frames when the canvas resizes. */
function FitCamera({
  controls,
  fit,
}: {
  controls: RefObject<CameraControlsImpl | null>;
  fit: RefObject<number>;
}) {
  const size = useThree((state) => state.size);
  const placed = useRef(false);
  useEffect(() => {
    const c = controls.current;
    if (!c || size.height === 0) return;
    fit.current = fitDistance(size.width / size.height);
    if (placed.current) {
      void c.dollyTo(fit.current, false);
      return;
    }
    placed.current = true;
    const [tx, ty, tz] = CAMERA.target;
    const y = ty + fit.current * Math.cos(CAMERA.polar);
    const z = tz + fit.current * Math.sin(CAMERA.polar);
    void c.setLookAt(tx, y, z, tx, ty, tz, false);
  }, [controls, fit, size.width, size.height]);
  return null;
}

function AutoRotate({
  controls,
  enabled,
}: {
  controls: RefObject<CameraControlsImpl | null>;
  enabled: boolean;
}) {
  useFrame((_, delta) => {
    const c = controls.current;
    if (!enabled || !c) return;
    // Clamp delta so a backgrounded tab does not jump on return.
    void c.rotate(Math.min(delta, 0.05) * AUTO_ROTATE_SPEED, 0, false);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Body, organs and bones

type SceneProps = BodySceneProps & { palette: Palette; reduced: boolean };

/** Organ look for a level, mirroring the 2D fills (nominal stays quiet, urgent fills more). */
function organLook(level: Level, palette: Palette, selected: boolean, reduced: boolean): HoloLook {
  const boost = selected ? 0.14 : 0;
  const quiet = level === "NOMINAL" ? 0.8 : 1;
  return {
    color: palette.level[level],
    base: (0.12 + LEVEL_FILL_OPACITY[level] * 1.6 + boost) * quiet,
    rim: (0.75 + boost) * quiet,
    pulse: level === "URGENT" && !reduced,
    additive: palette.dark,
    doubleSide: true,
  };
}

function BodyAndZones({ evaluation, selected, onSelect, palette, reduced }: SceneProps) {
  const { bySystem } = evaluation;
  const geometry = useMemo(() => {
    const body = buildBody();
    return {
      body: body.parts,
      bones: buildBones(body.torsoHalfDepth),
      lungs: buildLungs(),
      heart: [buildHeart()],
      gut: buildGut(),
      brain: [buildBrain()],
      waves: brainWaveLines(),
      folds: gutFoldLines(),
    };
  }, []);
  useEffect(
    () => () => {
      const { body, bones, lungs, heart, gut, brain } = geometry;
      for (const g of [...body, ...bones, ...lungs, ...heart, ...gut, ...brain]) g.dispose();
    },
    [geometry],
  );

  const immune = bySystem.immune;
  const bodyLook: HoloLook = {
    color: palette.level[immune],
    base: palette.dark ? 0.035 : 0.07,
    rim: palette.dark ? 0.95 : 1.3,
    lines: true,
    scan: !reduced,
    pulse: immune === "URGENT" && !reduced,
    additive: palette.dark,
  };
  const look = (system: SystemId) =>
    organLook(bySystem[system], palette, selected === system, reduced);
  const lineOpacity = (system: SystemId) => (bySystem[system] === "NOMINAL" ? 0.7 : 0.95);

  return (
    <group>
      <HoloSurface
        geometries={geometry.body}
        look={bodyLook}
        zone="immune"
        onSelect={onSelect}
        renderOrder={1}
      />

      <HoloSurface geometries={geometry.bones} look={look("msk")} zone="msk" onSelect={onSelect} />
      <HoloSurface
        geometries={geometry.lungs}
        look={look("respiratory")}
        zone="respiratory"
        onSelect={onSelect}
      />
      <HoloSurface
        geometries={geometry.heart}
        look={look("cardio")}
        zone="cardio"
        onSelect={onSelect}
        renderOrder={2}
      />
      <HoloSurface
        geometries={geometry.gut}
        look={look("metabolic")}
        zone="metabolic"
        onSelect={onSelect}
      />
      <HoloSurface
        geometries={geometry.brain}
        look={look("behavioral")}
        zone="behavioral"
        onSelect={onSelect}
      />

      {geometry.waves.map((points, i) => (
        <Line
          // biome-ignore lint/suspicious/noArrayIndexKey: static geometry built once; the order never changes.
          key={`w${i}`}
          points={points}
          color={palette.level[bySystem.behavioral]}
          lineWidth={1.6}
          transparent
          opacity={lineOpacity("behavioral")}
        />
      ))}
      {geometry.folds.map((points, i) => (
        <Line
          // biome-ignore lint/suspicious/noArrayIndexKey: static geometry built once; the order never changes.
          key={`f${i}`}
          points={points}
          color={palette.level[bySystem.metabolic]}
          lineWidth={1.4}
          transparent
          opacity={lineOpacity("metabolic")}
        />
      ))}

      {selected && selected !== "radiation" && (
        <SelectionMarker
          position={anchorWorld(selected)}
          color={palette.level[bySystem[selected]]}
        />
      )}
    </group>
  );
}

/** Camera-facing dashed ring at the selected zone (the 2D selection halo). */
function SelectionMarker({ position, color }: { position: Vec3; color: string }) {
  const points = useMemo(() => circlePoints(0.26, 64), []);
  return (
    <Billboard position={position}>
      <Line
        points={points}
        color={color}
        lineWidth={1.4}
        dashed
        dashSize={0.035}
        gapSize={0.05}
        depthTest={false}
        renderOrder={10}
      />
    </Billboard>
  );
}

// ---------------------------------------------------------------------------
// Satellites

const tmp = new Vector3();

function SatelliteRing3D({
  evaluation,
  reading,
  selected,
  palette,
  reduced,
  moving,
  elements,
}: SceneProps & { moving: boolean; elements: RefObject<(HTMLButtonElement | null)[]> }) {
  const ring = useRef<Group>(null);
  const anchors = useRef<(Group | null)[]>([]);
  const guide = useMemo(() => circlePoints(ORBIT.radius, 128, ORBIT.y), []);
  const size = useThree((state) => state.size);

  useFrame(({ camera }, delta) => {
    // The play/pause button stops the camera and the satellite orbit together.
    if (ring.current && moving && !reduced) {
      ring.current.rotation.y += (Math.min(delta, 0.05) * Math.PI * 2) / ORBIT.seconds;
    }
    const len = Math.hypot(camera.position.x, camera.position.z) || 1;
    anchors.current.forEach((anchor, i) => {
      const el = elements.current[i];
      if (!anchor || !el) return;
      anchor.getWorldPosition(tmp);
      // -1 behind the body … 1 in front of it, as seen from the camera.
      const facing = (tmp.x * camera.position.x + tmp.z * camera.position.z) / len / ORBIT.radius;
      const front = Math.min(1, Math.max(0, (facing + 0.6) / 1.2));
      tmp.project(camera);
      const x = ((tmp.x + 1) / 2) * size.width;
      const y = ((1 - tmp.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.82 + 0.18 * front})`;
      // Satellites behind the body fade so the front reads first.
      el.style.opacity = String(0.3 + 0.7 * front);
      el.style.zIndex = String(Math.round(10 + 10 * front));
    });
  });

  return (
    <group>
      <Line
        points={guide}
        color={palette.muted}
        lineWidth={1}
        dashed
        dashSize={0.03}
        gapSize={0.11}
        transparent
        opacity={0.45}
      />
      <group ref={ring}>
        {SATELLITES.map((satellite, index) => {
          const angle = (slotAngle(index) * Math.PI) / 180;
          const position: Vec3 = [
            ORBIT.radius * Math.sin(angle),
            ORBIT.y,
            ORBIT.radius * Math.cos(angle),
          ];
          const level = evaluation.bySystem[satellite.zone];
          return (
            <group
              key={satellite.field}
              position={position}
              ref={(node) => {
                anchors.current[index] = node;
              }}
            >
              {selected === satellite.zone && reading && (
                <Connector target={anchorWorld(satellite.zone)} color={palette.level[level]} />
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

function SatelliteNode({
  nodeRef,
  label,
  zone,
  Icon,
  value,
  selected,
  onSelect,
}: {
  nodeRef: (el: HTMLButtonElement | null) => void;
  label: string;
  zone: SystemId;
  Icon: (typeof SATELLITES)[number]["icon"];
  value: string;
  selected: boolean;
  onSelect: (zone: SystemId) => void;
}) {
  return (
    <button
      ref={nodeRef}
      type="button"
      onClick={() => onSelect(zone)}
      aria-label={`${label}: ${value} — ${SYSTEM_INFO[zone].label}`}
      title={`${label}: ${value} — feeds ${SYSTEM_INFO[zone].label}`}
      className={clsx(
        // Positioned every frame by SatelliteRing3D; hidden until the first frame.
        "pointer-events-auto absolute top-0 left-0 flex flex-col items-center justify-center rounded-full border-ink bg-surface-strong text-ink opacity-0",
        selected ? "size-[52px] border-2" : "size-[46px] border",
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      <span className="mt-0.5 font-mono text-[9px] leading-none font-medium whitespace-nowrap">
        {value}
      </span>
    </button>
  );
}

/** Dashed line from a satellite (this group's origin) to its zone anchor. */
function Connector({ target, color }: { target: Vec3; color: string }) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]);
    const material = new LineDashedMaterial({
      dashSize: 0.06,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.55,
      depthTest: false,
    });
    return new ThreeLine(geometry, material);
  }, []);
  useEffect(() => {
    (line.material as LineDashedMaterial).color.set(color);
  }, [line, color]);
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineDashedMaterial).dispose();
    },
    [line],
  );
  const world = useMemo(() => new Vector3(...target), [target]);

  useFrame(() => {
    const parent = line.parent;
    if (!parent) return;
    // Target in the satellite's local space (the ring keeps rotating).
    tmp.copy(world);
    parent.worldToLocal(tmp);
    const positions = line.geometry.attributes.position!;
    positions.setXYZ(1, tmp.x, tmp.y, tmp.z);
    positions.needsUpdate = true;
    line.computeLineDistances();
  });

  return <primitive object={line} renderOrder={9} />;
}

// ---------------------------------------------------------------------------
// Radiation

/** A faint shield shell around the body plus the dose-budget ring at the feet. */
function RadiationHalo3D({
  level,
  pct,
  palette,
  onSelect,
}: {
  level: Level;
  pct: number;
  palette: Palette;
  onSelect: () => void;
}) {
  const shell = useMemo(() => [ellipsoid([280, 290, 0], [128, 250, 95])], []);
  useEffect(
    () => () => {
      for (const g of shell) g.dispose();
    },
    [shell],
  );
  const color = palette.level[level];
  const fill = Math.min(100, Math.max(0, pct)) / 100;
  const track = useMemo(() => circlePoints(DOSE_RING.radius, 128, DOSE_RING.y), []);
  const arc = useMemo(
    () => arcPoints(DOSE_RING.radius, DOSE_RING.y, Math.max(fill, 0.001)),
    [fill],
  );

  return (
    <group>
      <HoloSurface
        geometries={shell}
        look={{ color, base: 0, rim: palette.dark ? 0.16 : 0.12, additive: palette.dark }}
      />
      <Line
        points={track}
        color={color}
        lineWidth={1.2}
        dashed
        dashSize={0.06}
        gapSize={0.1}
        transparent
        opacity={0.5}
      />
      <Line points={arc} color={color} lineWidth={3} transparent opacity={0.9} />
      {/* Generous invisible hit target for the ring */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: a three.js mesh, not DOM; the dose button below is the keyboard path. */}
      <mesh
        position={[0, DOSE_RING.y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(event) => {
          if (event.delta > 6) return;
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <torusGeometry args={[DOSE_RING.radius, 0.09, 8, 64]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Point helpers

function circlePoints(radius: number, segments: number, y?: number): Vec3[] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    // Horizontal ring when y is given, otherwise a ring in the XY plane.
    return y === undefined
      ? ([radius * Math.cos(a), radius * Math.sin(a), 0] as Vec3)
      : ([radius * Math.sin(a), y, radius * Math.cos(a)] as Vec3);
  });
}

/** Arc on a horizontal ring, starting at the front (toward the default camera). */
function arcPoints(radius: number, y: number, fraction: number): Vec3[] {
  const segments = Math.max(2, Math.round(128 * fraction));
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * fraction * Math.PI * 2;
    return [radius * Math.sin(a), y, radius * Math.cos(a)] as Vec3;
  });
}
