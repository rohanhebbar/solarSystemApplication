import { Suspense, useRef, useLayoutEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import type { Mesh } from "three";
import { SRGBColorSpace } from "three";
import { sunData } from "../data/planets";
import { SUN_TEXTURE_MAP } from "../data/planetTextures";

interface SunProps {
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (name: string) => void;
}

export default function Sun(props: SunProps) {
  return (
    <Suspense fallback={<SunColored {...props} />}>
      <SunTextured {...props} />
    </Suspense>
  );
}

function SunColored({ isSelected, anySelected, onSelect }: SunProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

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
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(sunData.name);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
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
      {!anySelected && hovered && (
        <SunLabel yOffset={sunData.displayRadius + 4.1} />
      )}
    </group>
  );
}

function SunTextured({ isSelected, anySelected, onSelect }: SunProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const map = useTexture(SUN_TEXTURE_MAP);

  useLayoutEffect(() => {
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 8;
  }, [map]);

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
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(sunData.name);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[sunData.displayRadius, 96, 96]} />
        <meshStandardMaterial
          map={map}
          color="#ffffff"
          emissive="#ff9933"
          emissiveIntensity={isSelected ? 2.4 : 2}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[sunData.displayRadius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[sunData.displayRadius * 1.35, 32, 32]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.04}
        />
      </mesh>
      {!anySelected && hovered && <SunLabel yOffset={sunData.displayRadius + 4.1} />}
    </group>
  );
}

function SunLabel({ yOffset }: { yOffset: number }) {
  return (
    <Html
      position={[0, yOffset, 0]}
      center
      style={{
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          color: "#fff7ed",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "Inter, system-ui, sans-serif",
          whiteSpace: "nowrap",
          padding: "6px 10px",
          borderRadius: "999px",
          background: "rgba(18, 12, 8, 0.82)",
          border: "1px solid rgba(255,190,120,0.18)",
          backdropFilter: "blur(8px)",
          textShadow: "0 0 8px rgba(0,0,0,0.65)",
        }}
      >
        Sun
      </div>
    </Html>
  );
}
