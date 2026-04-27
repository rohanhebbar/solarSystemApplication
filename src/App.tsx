import { useState, useCallback, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import SolarSystem from "./components/SolarSystem";
import InfoPanel from "./components/InfoPanel";
import HUD from "./components/HUD";
import { planets, sunData } from "./data/planets";
import type { ViewMode, ScenePanApi, OrbitSpeed, OrbitModel } from "./types";

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [orbitModel, setOrbitModel] = useState<OrbitModel>("simple");
  const [isOrbitPlaying, setIsOrbitPlaying] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState<OrbitSpeed>(10);
  const [orbitTime, setOrbitTime] = useState(0);
  const [orbitReadyTick, setOrbitReadyTick] = useState(0);
  const panApiRef = useRef<ScenePanApi | null>(null);

  const handleSelectPlanet = useCallback((name: string | null) => {
    setSelectedPlanet(name);
  }, []);

  const handleOrbitControlsReady = useCallback(() => {
    setOrbitReadyTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!isOrbitPlaying) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = (now - last) / 1000;
      last = now;
      setOrbitTime((t) => t + deltaSeconds * orbitSpeed);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOrbitPlaying, orbitSpeed]);

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
          orbitModel={orbitModel}
          orbitTime={orbitTime}
          panApiRef={panApiRef}
          onOrbitControlsReady={handleOrbitControlsReady}
        />
      </Canvas>

      <HUD
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        orbitModel={orbitModel}
        onOrbitModelChange={setOrbitModel}
        isOrbitPlaying={isOrbitPlaying}
        orbitSpeed={orbitSpeed}
        onStartOrbit={() => setIsOrbitPlaying(true)}
        onPauseOrbit={() => setIsOrbitPlaying(false)}
        onResetOrbit={() => {
          setIsOrbitPlaying(false);
          setOrbitTime(0);
        }}
        onOrbitSpeedChange={setOrbitSpeed}
        panApiRef={panApiRef}
        orbitReadyTick={orbitReadyTick}
      />

      <InfoPanel planet={activePlanet} onClose={() => handleSelectPlanet(null)} />
    </div>
  );
}
