import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import SolarSystem from "./components/SolarSystem";
import InfoPanel from "./components/InfoPanel";
import HUD from "./components/HUD";
import { planets } from "./data/planets";

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const handleSelectPlanet = useCallback((name: string | null) => {
    setSelectedPlanet(name);
  }, []);

  const activePlanet = planets.find((p) => p.name === selectedPlanet) ?? null;

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000, position: [40, 55, 95] }}
        style={{ background: "#030308" }}
      >
        <SolarSystem
          selectedPlanet={selectedPlanet}
          onSelectPlanet={handleSelectPlanet}
        />
      </Canvas>

      <HUD
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
      />

      <InfoPanel planet={activePlanet} onClose={() => handleSelectPlanet(null)} />
    </div>
  );
}
