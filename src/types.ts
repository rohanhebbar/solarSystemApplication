export type ViewMode = "compact" | "distance";

export type PanDirection = -1 | 1;

export interface ScenePanApi {
  shift: (direction: PanDirection) => void;
  canShift: (direction: PanDirection) => boolean;
}
