import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  type BufferGeometry,
  Color,
  DoubleSide,
  FrontSide,
  NormalBlending,
  ShaderMaterial,
} from "three";
import type { SystemId } from "../../../domain/types";

/**
 * "Medical scanner" surface: almost transparent where it faces the camera,
 * bright at the silhouette edge (fresnel rim), with optional horizontal scan
 * lines and a slow scan band. Unlit, so it reads the same in any pose.
 */
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    vY = world.y;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBase;
  uniform float uRim;
  uniform float uLines;
  uniform float uScan;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float rim = pow(1.0 - facing, 2.2);
    float stripe = uLines * smoothstep(0.9, 1.0, sin(vY * 70.0) * 0.5 + 0.5) * 0.07;
    float scanY = mod(uTime * 0.3, 6.0) - 3.0;
    float band = uScan * exp(-pow((vY - scanY) * 6.0, 2.0)) * 0.45;
    float alpha = clamp((uBase + uRim * rim + stripe + band) * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

export interface HoloLook {
  color: string;
  /** Opacity where the surface faces the camera. */
  base: number;
  /** Extra opacity at the silhouette edge. */
  rim: number;
  lines?: boolean;
  scan?: boolean;
  /** Breathing opacity (URGENT). */
  pulse?: boolean;
  /** Additive glow (dark theme) vs normal alpha blending (light theme). */
  additive: boolean;
  doubleSide?: boolean;
}

const noRaycast = () => null;

export function HoloSurface({
  geometries,
  look,
  zone,
  onSelect,
  renderOrder = 0,
}: {
  geometries: BufferGeometry[];
  look: HoloLook;
  /** Zone this surface belongs to; omit for decorative surfaces (not clickable). */
  zone?: SystemId;
  onSelect?: (zone: SystemId) => void;
  renderOrder?: number;
}) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new Color() },
          uOpacity: { value: 1 },
          uBase: { value: 0 },
          uRim: { value: 0 },
          uLines: { value: 0 },
          uScan: { value: 0 },
          uTime: { value: 0 },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const u = material.uniforms;
    (u.uColor!.value as Color).set(look.color);
    u.uBase!.value = look.base;
    u.uRim!.value = look.rim;
    u.uLines!.value = look.lines ? 1 : 0;
    u.uScan!.value = look.scan ? 1 : 0;
    material.blending = look.additive ? AdditiveBlending : NormalBlending;
    material.side = look.doubleSide ? DoubleSide : FrontSide;
    material.needsUpdate = true;
  }, [
    material,
    look.color,
    look.base,
    look.rim,
    look.lines,
    look.scan,
    look.additive,
    look.doubleSide,
  ]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    material.uniforms.uTime!.value = t;
    material.uniforms.uOpacity!.value = look.pulse
      ? 0.7 + 0.3 * Math.sin((t * Math.PI * 2) / 2.4)
      : 1;
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!zone || !onSelect) return;
    // A drag that ends on the body is a rotation, not a selection.
    if (event.delta > 6) return;
    // The body shell encloses the organs: when the ray also hits an organ,
    // let the organ's own handler take the click.
    if (zone === "immune" && event.intersections.some((h) => h.object.userData.inner === true)) {
      return;
    }
    event.stopPropagation();
    onSelect(zone);
  };

  return (
    <group>
      {geometries.map((geometry, index) => (
        // biome-ignore lint/a11y/noStaticElementInteractions: a three.js mesh, not DOM; satellites and the 2D view are the keyboard path.
        <mesh
          // biome-ignore lint/suspicious/noArrayIndexKey: geometries are built once per zone and never reorder.
          key={index}
          geometry={geometry}
          material={material}
          renderOrder={renderOrder}
          userData={{ zone, inner: zone !== undefined && zone !== "immune" }}
          {...(zone ? {} : { raycast: noRaycast })}
          onClick={zone ? handleClick : undefined}
          onPointerOver={
            zone
              ? (event) => {
                  event.stopPropagation();
                  document.body.style.cursor = "pointer";
                }
              : undefined
          }
          onPointerOut={zone ? () => (document.body.style.cursor = "") : undefined}
        />
      ))}
    </group>
  );
}
