import { Vector3 } from "three";
import type { OrbitModel, ViewMode } from "../types";
import type { PlanetData } from "../data/planets";

const AU_SCALE = 12;

export function getSceneDistance(
  body: { displayDistance: number; distanceFromSun: number },
  viewMode: ViewMode
) {
  return viewMode === "distance"
    ? body.distanceFromSun * AU_SCALE
    : body.displayDistance;
}

function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number): number {
  let E = meanAnomaly;
  for (let i = 0; i < 10; i++) {
    const f = E - eccentricity * Math.sin(E) - meanAnomaly;
    const fp = 1 - eccentricity * Math.cos(E);
    E -= f / fp;
  }
  return E;
}

function meanAnomalyAtTime(
  body: Pick<PlanetData, "orbitalPeriod" | "initialPhase">,
  orbitTime: number
) {
  const M0 = body.initialPhase ?? 0;
  return M0 + ((orbitTime / body.orbitalPeriod) * Math.PI * 2);
}

export function getBodyPosition(
  body: PlanetData,
  viewMode: ViewMode,
  orbitTime: number,
  orbitModel: OrbitModel
): Vector3 {
  if (!body.orbitalPeriod) {
    return new Vector3(0, 0, 0);
  }

  const a = getSceneDistance(body, viewMode);

  if (orbitModel === "simple") {
    const angle = meanAnomalyAtTime(body, orbitTime);
    return new Vector3(Math.cos(angle) * a, 0, Math.sin(angle) * a);
  }

  const e = body.eccentricity ?? 0;
  const iRad = ((body.inclinationDeg ?? 0) * Math.PI) / 180;
  const M = meanAnomalyAtTime(body, orbitTime);
  const E = solveEccentricAnomaly(M, e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const r = a * (1 - e * cosE);
  const nu = Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e);

  const xOrb = r * Math.cos(nu);
  const zOrb = r * Math.sin(nu);
  const yOrb = 0;

  const y = yOrb * Math.cos(iRad) - zOrb * Math.sin(iRad);
  const z = yOrb * Math.sin(iRad) + zOrb * Math.cos(iRad);

  return new Vector3(xOrb, y, z);
}

export function sampleOrbitPath(
  body: PlanetData,
  viewMode: ViewMode,
  segments: number
): Vector3[] {
  const a = getSceneDistance(body, viewMode);
  const e = body.eccentricity ?? 0;
  const iRad = ((body.inclinationDeg ?? 0) * Math.PI) / 180;
  const points: Vector3[] = [];

  for (let k = 0; k <= segments; k++) {
    const nu = (k / segments) * Math.PI * 2;
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));
    const xOrb = r * Math.cos(nu);
    const zOrb = r * Math.sin(nu);
    const yOrb = 0;
    const y = yOrb * Math.cos(iRad) - zOrb * Math.sin(iRad);
    const z = yOrb * Math.sin(iRad) + zOrb * Math.cos(iRad);
    points.push(new Vector3(xOrb, y, z));
  }

  return points;
}
