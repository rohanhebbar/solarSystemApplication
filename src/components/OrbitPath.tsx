import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { PlanetData } from "../data/planets";
import type { OrbitModel, ViewMode } from "../types";
import { sampleOrbitPath } from "../lib/orbitMath";

interface OrbitPathProps {
  body: PlanetData;
  viewMode: ViewMode;
  orbitModel: OrbitModel;
}

export default function OrbitPath({ body, viewMode, orbitModel }: OrbitPathProps) {
  const points = useMemo(() => {
    if (orbitModel === "simple") {
      const d = viewMode === "distance" ? body.distanceFromSun * 12 : body.displayDistance;
      const pts: [number, number, number][] = [];
      for (let k = 0; k <= 128; k++) {
        const a = (k / 128) * Math.PI * 2;
        pts.push([Math.cos(a) * d, 0, Math.sin(a) * d]);
      }
      return pts;
    }
    return sampleOrbitPath(body, viewMode, 128).map((v) => [v.x, v.y, v.z] as [number, number, number]);
  }, [body, viewMode, orbitModel]);

  return (
    <Line
      points={points}
      color="#ffffff"
      transparent
      opacity={0.1}
      lineWidth={1}
    />
  );
}
