import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import { sunData } from "../data/planets";

interface SunProps {
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (name: string) => void;
}

export default function Sun({ isSelected, anySelected, onSelect }: SunProps) {
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
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sunData.name);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[sunData.displayRadius, 64, 64]} />
        <meshStandardMaterial
          color={sunData.color}
          emissive={sunData.emissiveColor}
          emissiveIntensity={isSelected ? 2.8 : 2}
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
      {!anySelected && (
        <Html
          position={[0, sunData.displayRadius + 0.8, 0]}
          center
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "Inter, system-ui, sans-serif",
              whiteSpace: "nowrap",
              textShadow: "0 0 10px rgba(0,0,0,0.9)",
            }}
          >
            Sun
          </div>
        </Html>
      )}
    </group>
  );
}
