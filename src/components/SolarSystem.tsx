import { useEffect, useCallback, useRef } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Sun from "./Sun";
import Planet from "./Planet";
import OrbitRing from "./OrbitRing";
import { planets } from "../data/planets";
import { useCameraFly } from "../hooks/useCameraFly";
import { useThree } from "@react-three/fiber";

const OVERVIEW_POS = new Vector3(40, 55, 95);
const OVERVIEW_LOOK = new Vector3(40, 0, 0);

interface SolarSystemProps {
  selectedPlanet: string | null;
  onSelectPlanet: (name: string | null) => void;
}

export default function SolarSystem({
  selectedPlanet,
  onSelectPlanet,
}: SolarSystemProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { flyTo, isAnimating } = useCameraFly(controlsRef);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.copy(OVERVIEW_POS);
    camera.lookAt(OVERVIEW_LOOK);
    if (controlsRef.current) {
      controlsRef.current.target.copy(OVERVIEW_LOOK);
      controlsRef.current.update();
    }
  }, [camera]);

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
    if (isAnimating()) return;

    if (selectedPlanet) {
      const planet = planets.find((p) => p.name === selectedPlanet);
      if (planet) {
        const offset = planet.displayRadius * 4 + 2;
        const target = new Vector3(
          planet.displayDistance + offset * 0.3,
          offset * 0.5,
          offset * 0.8
        );
        const look = new Vector3(planet.displayDistance, 0, 0);
        flyTo(target, look);
      }
    } else {
      flyTo(OVERVIEW_POS.clone(), OVERVIEW_LOOK.clone());
    }
  }, [selectedPlanet, flyTo, isAnimating]);

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

      <Sun />

      {planets.map((p) => (
        <group key={p.name}>
          <OrbitRing distance={p.displayDistance} />
          <Planet
            data={p}
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
        maxDistance={250}
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
      />
    </>
  );
}
