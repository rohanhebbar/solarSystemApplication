import { useState, useEffect, type RefObject } from "react";
import { planets, sunData } from "../data/planets";
import type { ViewMode, ScenePanApi, OrbitSpeed, OrbitModel } from "../types";

interface HUDProps {
  selectedPlanet: string | null;
  onSelectPlanet: (name: string | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  orbitModel: OrbitModel;
  onOrbitModelChange: (model: OrbitModel) => void;
  isOrbitPlaying: boolean;
  orbitSpeed: OrbitSpeed;
  onStartOrbit: () => void;
  onPauseOrbit: () => void;
  onResetOrbit: () => void;
  onOrbitSpeedChange: (speed: OrbitSpeed) => void;
  panApiRef: RefObject<ScenePanApi | null>;
  orbitReadyTick: number;
}

export default function HUD({
  selectedPlanet,
  onSelectPlanet,
  viewMode,
  onViewModeChange,
  orbitModel,
  onOrbitModelChange,
  isOrbitPlaying,
  orbitSpeed,
  onStartOrbit,
  onPauseOrbit,
  onResetOrbit,
  onOrbitSpeedChange,
  panApiRef,
  orbitReadyTick,
}: HUDProps) {
  const [, setPanTick] = useState(0);
  const bumpPan = () => setPanTick((t) => t + 1);

  useEffect(() => {
    setPanTick((t) => t + 1);
  }, [orbitReadyTick, viewMode]);
  return (
    <>
      {/* Title */}
      <div className="fixed top-5 left-6 z-10 pointer-events-none">
        <h1 className="text-lg font-semibold tracking-tight text-white/80">
          Solar System Explorer
        </h1>
        <p className="text-xs text-white/35 mt-0.5">
          Click the Sun or a planet to explore &middot; Hover to label &middot; Scroll to zoom &middot; Drag to orbit
          <span className="block mt-1 text-white/30">
            In overview, use the side arrows to slide along the system (bounded)
          </span>
        </p>
      </div>

      {/* View mode toggle */}
      <div
        className="fixed top-20 left-6 z-10 flex items-center gap-1 p-1 rounded-full"
        style={{
          background: "rgba(8, 10, 18, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ModeButton
          label="Compact"
          active={viewMode === "compact"}
          onClick={() => onViewModeChange("compact")}
        />
        <ModeButton
          label="True Distance"
          active={viewMode === "distance"}
          onClick={() => onViewModeChange("distance")}
        />
      </div>

      <div
        className="fixed left-6 z-10 flex items-center gap-1 p-1 rounded-full"
        style={{
          top: "6.5rem",
          background: "rgba(8, 10, 18, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ModeButton
          label="Simple orbits"
          active={orbitModel === "simple"}
          onClick={() => onOrbitModelChange("simple")}
        />
        <ModeButton
          label="Realistic orbits"
          active={orbitModel === "realistic"}
          onClick={() => onOrbitModelChange("realistic")}
        />
      </div>

      <div
        className="fixed left-6 z-10 flex items-center gap-1 p-1 rounded-full"
        style={{
          top: "10.25rem",
          background: "rgba(8, 10, 18, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ModeButton
          label={isOrbitPlaying ? "Running" : "Start"}
          active={isOrbitPlaying}
          onClick={onStartOrbit}
        />
        <ModeButton
          label="Pause"
          active={!isOrbitPlaying}
          onClick={onPauseOrbit}
        />
        <ModeButton label="Reset" active={false} onClick={onResetOrbit} />
        <div className="w-px h-5 bg-white/15 mx-1" />
        {[1, 10, 50].map((speed) => (
          <ModeButton
            key={speed}
            label={`${speed}x`}
            active={orbitSpeed === speed}
            onClick={() => onOrbitSpeedChange(speed as OrbitSpeed)}
          />
        ))}
      </div>

      {!selectedPlanet && (
        <>
          <PanEdgeButton
            side="left"
            label="Pan view left along the solar system"
            disabled={!panApiRef.current?.canShift(-1)}
            onClick={() => {
              panApiRef.current?.shift(-1);
              bumpPan();
            }}
          />
          <PanEdgeButton
            side="right"
            label="Pan view right along the solar system"
            disabled={!panApiRef.current?.canShift(1)}
            onClick={() => {
              panApiRef.current?.shift(1);
              bumpPan();
            }}
          />
        </>
      )}

      {/* Planet nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 rounded-full"
        style={{
          background: "rgba(8, 10, 18, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {[sunData, ...planets].map((p) => {
          const isActive = selectedPlanet === p.name;
          return (
            <button
              key={p.name}
              onClick={() => onSelectPlanet(isActive ? null : p.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
              style={
                isActive
                  ? { background: "rgba(255,255,255,0.12)" }
                  : {}
              }
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Reset button (only when a planet is selected) */}
      {selectedPlanet && (
        <button
          onClick={() => onSelectPlanet(null)}
          className="fixed top-5 right-6 z-30 px-4 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-all duration-200"
          style={{
            background: "rgba(8, 10, 18, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Back to Overview
        </button>
      )}

      {/* Scale legend */}
      <div className="fixed bottom-16 right-6 z-10 text-[10px] text-white/25 pointer-events-none">
        {viewMode === "distance"
          ? "Distances are proportional by AU; planet sizes are enlarged"
          : "Planet sizes are proportional; distances are compressed"}
      </div>
    </>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      style={active ? { background: "rgba(255,255,255,0.12)" } : {}}
    >
      {label}
    </button>
  );
}

function PanEdgeButton({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const horizontal = side === "left" ? { left: 8 } : { right: 8 };
  const chevron = side === "left" ? "\u2039" : "\u203A";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="fixed z-[28] flex h-28 w-10 items-center justify-center rounded-lg text-2xl font-light text-white/70 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        ...horizontal,
        background: "rgba(8, 10, 18, 0.55)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {chevron}
    </button>
  );
}
