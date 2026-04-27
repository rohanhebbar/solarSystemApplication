import { Suspense, useRef, useState, useLayoutEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import type { Mesh } from "three";
import { DoubleSide, SRGBColorSpace } from "three";
import type { Texture } from "three";
import type { PlanetData } from "../data/planets";
import { PLANET_VISUALS } from "../data/planetTextures";

interface PlanetProps {
  data: PlanetData;
  distance: number;
  isSelected: boolean;
  anySelected: boolean;
  onSelect: (name: string) => void;
}

export default function Planet(props: PlanetProps) {
  const hasTexture = Boolean(PLANET_VISUALS[props.data.name]);
  if (!hasTexture) {
    return <PlanetColored {...props} />;
  }
  return (
    <Suspense fallback={<PlanetColored {...props} />}>
      <PlanetTextured {...props} />
    </Suspense>
  );
}

function PlanetColored({
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
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(data.name);
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
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
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

      {hovered && (
        <mesh rotation={[0, 0, (data.tilt * Math.PI) / 180]}>
          <sphereGeometry args={[data.displayRadius * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

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

function PlanetTextured({
  data,
  distance,
  isSelected,
  anySelected,
  onSelect,
}: PlanetProps) {
  const profile = PLANET_VISUALS[data.name];
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const textureUrls = useMemo(
    () =>
      profile.ringMap ? [profile.map, profile.ringMap] : [profile.map],
    [profile]
  );

  const loaded = useTexture(textureUrls);
  const bodyMap: Texture = Array.isArray(loaded) ? loaded[0] : loaded;
  const ringMap: Texture | undefined = Array.isArray(loaded)
    ? loaded[1]
    : undefined;

  useLayoutEffect(() => {
    const tune = (t: Texture) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 8;
    };
    tune(bodyMap);
    if (ringMap) tune(ringMap);
  }, [bodyMap, ringMap]);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      const dir = data.rotationPeriod < 0 ? -1 : 1;
      meshRef.current.rotation.y += dir * delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = 0;
    }
  });

  const emissiveIntensity = hovered ? 0.1 : isSelected ? 0.06 : 0;

  const meshHandlers = {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(data.name);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "auto";
    },
  };

  return (
    <group position={[distance, 0, 0]}>
      <mesh
        ref={meshRef}
        {...meshHandlers}
        rotation={[0, 0, (data.tilt * Math.PI) / 180]}
      >
        <sphereGeometry args={[data.displayRadius, 96, 96]} />
        <meshStandardMaterial
          map={bodyMap}
          color="#ffffff"
          roughness={profile.roughness}
          metalness={profile.metalness}
          emissive="#ffffff"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {data.name === "Saturn" && ringMap && (
        <mesh
          ref={ringRef}
          {...meshHandlers}
          rotation={[Math.PI / 2.2, 0, 0]}
        >
          <ringGeometry
            args={[
              data.displayRadius * 1.4,
              data.displayRadius * 2.5,
              128,
            ]}
          />
          <meshBasicMaterial
            map={ringMap}
            color="#f0e6d8"
            transparent
            opacity={0.95}
            side={DoubleSide}
            depthWrite={false}
            toneMapped
          />
        </mesh>
      )}

      {data.hasRings && data.name !== "Saturn" && (
        <mesh ref={ringRef} {...meshHandlers} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry
            args={[
              data.displayRadius * 1.4,
              data.displayRadius * 2.5,
              64,
            ]}
          />
          <meshStandardMaterial
            color={data.ringColor ?? "#556677"}
            side={DoubleSide}
            transparent
            opacity={0.5}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      )}

      {hovered && (
        <mesh rotation={[0, 0, (data.tilt * Math.PI) / 180]}>
          <sphereGeometry args={[data.displayRadius * 1.08, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
        </mesh>
      )}

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
