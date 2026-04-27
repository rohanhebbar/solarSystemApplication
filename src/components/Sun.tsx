import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { sunData } from "../data/planets";

export default function Sun() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={200}
        decay={0.5}
        color="#fff5e0"
      />
      <ambientLight intensity={0.15} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[sunData.displayRadius, 64, 64]} />
        <meshStandardMaterial
          color={sunData.color}
          emissive={sunData.emissiveColor}
          emissiveIntensity={2}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[sunData.displayRadius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[sunData.displayRadius * 1.35, 32, 32]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.03}
        />
      </mesh>
    </group>
  );
}
