import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import { DoubleSide } from "three";
import type { PlanetData } from "../data/planets";

interface PlanetProps {
  data: PlanetData;
  distance: number;
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (name: string) => void;
}

export default function Planet({
  data,
  distance,
  isSelected,
  anySelected,
  onSelect,
}: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      const dir = data.rotationPeriod < 0 ? -1 : 1;
      meshRef.current.rotation.y += dir * delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = 0;
    }
  });

  const emissiveIntensity = hovered ? 0.4 : isSelected ? 0.25 : 0;

  return (
    <group position={[distance, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data.name);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        rotation={[0, 0, (data.tilt * Math.PI) / 180]}
      >
        <sphereGeometry args={[data.displayRadius, 64, 64]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissiveColor ?? data.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {data.hasRings && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2.2, 0, 0]}
        >
          <ringGeometry
            args={[
              data.displayRadius * 1.4,
              data.displayRadius * 2.5,
              64,
            ]}
          />
          <meshStandardMaterial
            color={data.ringColor ?? "#a08050"}
            side={DoubleSide}
            transparent
            opacity={0.55}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      )}

      {/* Hover glow */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[data.displayRadius * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Floating label — hidden when any planet detail is open */}
      {!anySelected && (
        <Html
          position={[0, data.displayRadius + 0.6, 0]}
          center
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: hovered ? "#ffffff" : "rgba(255,255,255,0.7)",
              fontSize: hovered ? "14px" : "12px",
              fontWeight: hovered ? 600 : 400,
              fontFamily: "Inter, system-ui, sans-serif",
              whiteSpace: "nowrap",
              textShadow: "0 0 8px rgba(0,0,0,0.8)",
              transition: "all 0.2s ease",
            }}
          >
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}
