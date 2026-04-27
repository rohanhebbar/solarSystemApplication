import { useEffect, useCallback, useRef, type RefObject } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Sun from "./Sun";
import Planet from "./Planet";
import OrbitRing from "./OrbitRing";
import { planets, sunData } from "../data/planets";
import { useCameraFly } from "../hooks/useCameraFly";
import { useThree } from "@react-three/fiber";
import type { ViewMode, ScenePanApi, PanDirection } from "../types";

const OVERVIEW_POS = new Vector3(40, 55, 95);
const OVERVIEW_LOOK = new Vector3(40, 0, 0);
const DISTANCE_OVERVIEW_POS = new Vector3(180, 160, 520);
const DISTANCE_OVERVIEW_LOOK = new Vector3(180, 0, 0);
const AU_SCALE = 12;

interface SolarSystemProps {
  selectedPlanet: string | null;
  onSelectPlanet: (name: string | null) => void;
  viewMode: ViewMode;
  panApiRef: RefObject<ScenePanApi | null>;
  onOrbitControlsReady?: () => void;
}

export default function SolarSystem({
  selectedPlanet,
  onSelectPlanet,
  viewMode,
  panApiRef,
  onOrbitControlsReady,
}: SolarSystemProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { flyTo, isAnimating } = useCameraFly(controlsRef);
  const { camera } = useThree();
  const prevSelectedRef = useRef<string | null>(null);
  const overviewSnapshotRef = useRef<{
    position: Vector3;
    target: Vector3;
  } | null>(null);

  useEffect(() => {
    overviewSnapshotRef.current = null;
  }, [viewMode]);

  useEffect(() => {
    const overviewPosition = getOverviewPosition(viewMode);
    const overviewLook = getOverviewLook(viewMode);
    camera.position.copy(overviewPosition);
    camera.lookAt(overviewLook);
    if (controlsRef.current) {
      controlsRef.current.target.copy(overviewLook);
      controlsRef.current.update();
    }
  }, [camera, viewMode]);

  const handleSelect = useCallback(
    (name: string) => {
      if (isAnimating()) return;
      if (selectedPlanet === name) {
        onSelectPlanet(null);
        return;
      }
      onSelectPlanet(name);
    },
    [selectedPlanet, onSelectPlanet, isAnimating]
  );

  useEffect(() => {
    const prev = prevSelectedRef.current;

    if (prev === null && selectedPlanet !== null && controlsRef.current) {
      overviewSnapshotRef.current = {
        position: camera.position.clone(),
        target: controlsRef.current.target.clone(),
      };
    }

    if (isAnimating()) {
      prevSelectedRef.current = selectedPlanet;
      return;
    }

    if (selectedPlanet) {
      const body =
        selectedPlanet === sunData.name
          ? sunData
          : planets.find((p) => p.name === selectedPlanet);
      if (body) {
        const offset = body.displayRadius * 4 + 2;
        const bodyDistance = getSceneDistance(body, viewMode);
        const target = new Vector3(
          bodyDistance + offset * 0.3,
          offset * 0.5,
          offset * 0.8
        );
        const look = new Vector3(bodyDistance, 0, 0);
        flyTo(target, look);
      }
    } else {
      const snap = overviewSnapshotRef.current;
      if (snap) {
        flyTo(snap.position.clone(), snap.target.clone());
      } else {
        flyTo(getOverviewPosition(viewMode), getOverviewLook(viewMode));
      }
    }

    prevSelectedRef.current = selectedPlanet;
  }, [selectedPlanet, flyTo, isAnimating, viewMode, camera]);

  const shiftHorizontal = useCallback(
    (dir: PanDirection) => {
      if (isAnimating()) return;
      const controls = controlsRef.current;
      if (!controls) return;
      const step = viewMode === "distance" ? 22 : 6;
      const { min, max } = getPanBounds(viewMode);
      const nextTargetX = controls.target.x + dir * step;
      const clamped = Math.min(max, Math.max(min, nextTargetX));
      const dx = clamped - controls.target.x;
      if (Math.abs(dx) < 1e-5) return;
      controls.target.x += dx;
      camera.position.x += dx;
      controls.update();
    },
    [camera, viewMode, isAnimating]
  );

  const canShiftHorizontal = useCallback(
    (dir: PanDirection) => {
      const controls = controlsRef.current;
      if (!controls) return false;
      const step = viewMode === "distance" ? 22 : 6;
      const { min, max } = getPanBounds(viewMode);
      const next = controls.target.x + dir * step;
      return next >= min && next <= max;
    },
    [viewMode]
  );

  panApiRef.current = {
    shift: shiftHorizontal,
    canShift: canShiftHorizontal,
  };

  useEffect(() => {
    return () => {
      panApiRef.current = null;
    };
  }, [panApiRef]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tick = () => {
      if (cancelled || attempts++ > 240) return;
      if (controlsRef.current) {
        onOrbitControlsReady?.();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [viewMode, onOrbitControlsReady]);

  return (
    <>
      <Stars
        radius={300}
        depth={100}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Sun
        isSelected={selectedPlanet === sunData.name}
        anySelected={selectedPlanet !== null}
        onSelect={handleSelect}
      />

      {planets.map((p) => (
        <group key={p.name}>
          <OrbitRing distance={getSceneDistance(p, viewMode)} />
          <Planet
            data={p}
            distance={getSceneDistance(p, viewMode)}
            isSelected={selectedPlanet === p.name}
            anySelected={selectedPlanet !== null}
            onSelect={handleSelect}
          />
        </group>
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={viewMode === "distance" ? 900 : 250}
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
      />
    </>
  );
}

function getSceneDistance(
  body: { displayDistance: number; distanceFromSun: number },
  viewMode: ViewMode
) {
  return viewMode === "distance"
    ? body.distanceFromSun * AU_SCALE
    : body.displayDistance;
}

function getOverviewPosition(viewMode: ViewMode) {
  return viewMode === "distance"
    ? DISTANCE_OVERVIEW_POS.clone()
    : OVERVIEW_POS.clone();
}

function getOverviewLook(viewMode: ViewMode) {
  return viewMode === "distance"
    ? DISTANCE_OVERVIEW_LOOK.clone()
    : OVERVIEW_LOOK.clone();
}

function getPanBounds(viewMode: ViewMode): { min: number; max: number } {
  if (viewMode === "distance") {
    const maxDist = Math.max(...planets.map((p) => p.distanceFromSun * AU_SCALE));
    return { min: -24, max: maxDist + 60 };
  }
  const maxCompact = Math.max(...planets.map((p) => p.displayDistance));
  return { min: -14, max: maxCompact + 32 };
}
