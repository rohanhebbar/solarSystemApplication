import { useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface CameraFlyTarget {
  position: Vector3;
  lookAt: Vector3;
}

export function useCameraFly(controlsRef: React.RefObject<OrbitControlsImpl | null>) {
  const { camera } = useThree();
  const targetRef = useRef<CameraFlyTarget | null>(null);
  const progressRef = useRef(1);
  const startPosRef = useRef(new Vector3());
  const startLookRef = useRef(new Vector3());
  const currentLookRef = useRef(new Vector3());

  useFrame((_state, delta) => {
    if (!targetRef.current || progressRef.current >= 1) return;

    const controls = controlsRef.current;
    if (controls) controls.enabled = false;

    progressRef.current = Math.min(progressRef.current + delta * 1.4, 1);
    const t = easeInOutCubic(progressRef.current);

    camera.position.lerpVectors(startPosRef.current, targetRef.current.position, t);
    currentLookRef.current.lerpVectors(startLookRef.current, targetRef.current.lookAt, t);
    camera.lookAt(currentLookRef.current);

    if (controls) {
      controls.target.copy(currentLookRef.current);
    }

    if (progressRef.current >= 1 && controls) {
      controls.target.copy(targetRef.current.lookAt);
      controls.enabled = true;
      controls.update();
    }
  });

  const flyTo = useCallback((position: Vector3, lookAt: Vector3) => {
    startPosRef.current.copy(camera.position);

    const controls = controlsRef.current;
    if (controls) {
      startLookRef.current.copy(controls.target);
    } else {
      const direction = new Vector3();
      camera.getWorldDirection(direction);
      startLookRef.current.copy(camera.position).add(direction.multiplyScalar(10));
    }

    currentLookRef.current.copy(startLookRef.current);
    targetRef.current = { position, lookAt };
    progressRef.current = 0;
  }, [camera, controlsRef]);

  const isAnimating = useCallback(() => {
    return progressRef.current < 1;
  }, []);

  return { flyTo, isAnimating };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
