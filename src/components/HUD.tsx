import { planets } from "../data/planets";

interface HUDProps {
  selectedPlanet: string | null;
  onSelectPlanet: (name: string | null) => void;
}

export default function HUD({ selectedPlanet, onSelectPlanet }: HUDProps) {
  return (
    <>
      {/* Title */}
      <div className="fixed top-5 left-6 z-10 pointer-events-none">
        <h1 className="text-lg font-semibold tracking-tight text-white/80">
          Solar System Explorer
        </h1>
        <p className="text-xs text-white/35 mt-0.5">
          Click a planet to explore &middot; Scroll to zoom &middot; Drag to orbit
        </p>
      </div>

      {/* Planet nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 rounded-full"
        style={{
          background: "rgba(8, 10, 18, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {planets.map((p) => {
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
        Planet sizes are proportional &middot; Distances are compressed
      </div>
    </>
  );
}
