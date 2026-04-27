import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import SolarSystem from "./components/SolarSystem";
import InfoPanel from "./components/InfoPanel";
import HUD from "./components/HUD";
import { planets, sunData } from "./data/planets";
import type { ViewMode, ScenePanApi } from "./types";

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [orbitReadyTick, setOrbitReadyTick] = useState(0);
  const panApiRef = useRef<ScenePanApi | null>(null);

  const handleSelectPlanet = useCallback((name: string | null) => {
    setSelectedPlanet(name);
  }, []);

  const handleOrbitControlsReady = useCallback(() => {
    setOrbitReadyTick((t) => t + 1);
  }, []);

  const activePlanet =
    selectedPlanet === sunData.name
      ? sunData
      : planets.find((p) => p.name === selectedPlanet) ?? null;

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000, position: [40, 55, 95] }}
        style={{ background: "#030308" }}
      >
        <SolarSystem
          selectedPlanet={selectedPlanet}
          onSelectPlanet={handleSelectPlanet}
          viewMode={viewMode}
          panApiRef={panApiRef}
          onOrbitControlsReady={handleOrbitControlsReady}
        />
      </Canvas>

      <HUD
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        panApiRef={panApiRef}
        orbitReadyTick={orbitReadyTick}
      />

      <InfoPanel planet={activePlanet} onClose={() => handleSelectPlanet(null)} />
    </div>
  );
}
