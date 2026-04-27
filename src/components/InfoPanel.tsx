import type { PlanetData } from "../data/planets";

interface InfoPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
}

export default function InfoPanel({ planet, onClose }: InfoPanelProps) {
  const isSun = planet?.name === "Sun";

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[380px] z-20 transition-transform duration-500 ease-out ${
        planet ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        background: "rgba(8, 10, 18, 0.85)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {planet && (
        <div className="h-full overflow-y-auto p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {planet.name}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {isSun
                  ? "The star at the center of our solar system"
                  : `${planet.distanceFromSun} AU from the Sun`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors text-2xl leading-none p-1"
            >
              &times;
            </button>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-white/75 mb-6">
            {planet.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCell label="Mass" value={planet.stats.mass} />
            <StatCell label="Gravity" value={planet.stats.gravity} />
            <StatCell label="Avg Temp" value={planet.stats.avgTemp} />
            <StatCell label="Moons" value={String(planet.stats.moons)} />
            <StatCell label="Day Length" value={planet.stats.dayLength} />
            <StatCell label="Year Length" value={planet.stats.yearLength} />
          </div>

          {/* Atmosphere */}
          <div
            className="rounded-lg p-3 mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Atmosphere
            </p>
            <p className="text-sm text-white/80">{planet.stats.atmosphere}</p>
          </div>

          {/* Facts */}
          <div className="flex-1">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">
              Did you know?
            </h3>
            <ul className="space-y-3">
              {planet.facts.map((fact, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/70 leading-relaxed">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Size comparison */}
          <div
            className="mt-6 rounded-lg p-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Size comparison
            </p>
            <p className="text-sm text-white/80">
              Radius: {planet.radius.toLocaleString()} km
              {planet.name !== "Earth" && (
                <span className="text-white/50">
                  {" "}
                  ({(planet.radius / 6371).toFixed(2)}x Earth)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-white/90">{value}</p>
    </div>
  );
}
