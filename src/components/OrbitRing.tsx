import { DoubleSide } from "three";

interface OrbitRingProps {
  distance: number;
}

export default function OrbitRing({ distance }: OrbitRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[distance - 0.03, distance + 0.03, 128]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.08}
        side={DoubleSide}
      />
    </mesh>
  );
}
