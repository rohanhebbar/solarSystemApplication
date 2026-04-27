export type ViewMode = "compact" | "distance";
export type OrbitModel = "simple" | "realistic";

export type PanDirection = -1 | 1;
export type OrbitSpeed = 1 | 10 | 50;

export interface ScenePanApi {
  shift: (direction: PanDirection) => void;
  canShift: (direction: PanDirection) => boolean;
}
