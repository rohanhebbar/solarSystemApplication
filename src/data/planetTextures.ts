/**
 * Diffuse maps are 2K equirectangular JPEGs/PNG from Solar System Scope
 * (genesis-horizon mirror), vendored under /public/textures/planets for
 * reliable loading without third-party CORS issues. License: CC BY 4.0 —
 * see https://www.solarsystemscope.com/textures/
 */
const T = "/textures/planets";

export type PlanetVisualProfile = {
  map: string;
  /** Saturn ring alpha strip (optional) */
  ringMap?: string;
  roughness: number;
  metalness: number;
};

export const PLANET_VISUALS: Record<string, PlanetVisualProfile> = {
  Mercury: { map: `${T}/2k_mercury.jpg`, roughness: 0.92, metalness: 0.02 },
  Venus: { map: `${T}/2k_venus_atmosphere.jpg`, roughness: 0.35, metalness: 0.02 },
  Earth: { map: `${T}/2k_earth_daymap.jpg`, roughness: 0.58, metalness: 0.08 },
  Mars: { map: `${T}/2k_mars.jpg`, roughness: 0.88, metalness: 0.04 },
  Jupiter: { map: `${T}/2k_jupiter.jpg`, roughness: 0.42, metalness: 0.02 },
  Saturn: {
    map: `${T}/2k_saturn.jpg`,
    ringMap: `${T}/2k_saturn_ring_alpha.png`,
    roughness: 0.48,
    metalness: 0.02,
  },
  Uranus: { map: `${T}/2k_uranus.jpg`, roughness: 0.38, metalness: 0.03 },
  Neptune: { map: `${T}/2k_neptune.jpg`, roughness: 0.38, metalness: 0.03 },
};

export const SUN_TEXTURE_MAP = `${T}/2k_sun.jpg`;
