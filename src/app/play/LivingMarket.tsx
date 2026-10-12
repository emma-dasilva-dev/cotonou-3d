"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { TimeOfDay } from "./StreetAtmosphere";

// Fictional compact market, informed by Dantokpa photos:
// tightly grouped shade umbrellas, raised produce displays, woven sacks,
// textile bolts, and clear walking lanes. No photographic assets copied.
const STALLS = [
  { x: -9.2, z: -12, kind: "produce", shade: "#bd7756" },
  { x: -5.6, z: -12, kind: "fabric", shade: "#bdad83" },
  { x: -9.2, z: -7.9, kind: "produce", shade: "#608677" },
  { x: -5.6, z: -7.9, kind: "fabric", shade: "#d5a15a" },
] as const;

function Umbrella({ color }: { color: string }) {
  return <group>
    <mesh position={[0, 2.02, -0.5]}>
      <cylinderGeometry args={[0.055, 0.075, 3.1, 8]} />
      <meshStandardMaterial color="#6c655a" />
    </mesh>
    <mesh position={[0, 3.48, -0.5]} rotation={[0, Math.PI / 8, 0]} castShadow>
      <coneGeometry args={[1.65, 0.65, 8, 1]} />
      <meshStandardMaterial color={color} side={2} roughness={0.95} />
    </mesh>
    <mesh position={[0, 3.09, -0.5]}>
      <cylinderGeometry args={[1.46, 1.46, 0.035, 8]} />
      <meshStandardMaterial color="#e3d9ba" side={2} />
    </mesh>
  </group>;
}

function Stall({ stall }: { stall: (typeof STALLS)[number] }) {
  const isProduce = stall.kind === "produce";
  return <group position={[stall.x, 0, stall.z]}>
    <Umbrella color={stall.shade} />
    <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.25, 0.15, 1.15]} />
      <meshStandardMaterial color="#96724f" />
    </mesh>
    {[-0.86, 0.86].map(x => <mesh key={x} position={[x, 0.43, 0]}>
      <boxGeometry args={[0.12, 0.77, 0.95]} />
      <meshStandardMaterial color="#655144" />
    </mesh>)}
    {isProduce
      ? Array.from({ length: 15 }, (_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const color = row === 0 ? "#bd392f" : row === 1 ? "#cb9850" : "#729045";
          return <mesh key={i} position={[-0.84 + col * 0.42, 0.99, -0.34 + row * 0.35]} castShadow>
            <sphereGeometry args={[0.145, 8, 6]} />
            <meshStandardMaterial color={color} />
          </mesh>;
        })
      : Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.79 + (i % 4) * 0.52, 0.98 + Math.floor(i / 4) * 0.14, 0]}>
          <boxGeometry args={[0.39, 0.12, 0.83]} />
          <meshStandardMaterial color={["#a75442", "#dfb447", "#477d82", "#705b94"][i % 4]} />
        </mesh>)}
    <mesh position={[1.27, 0.26, 0.22]} castShadow>
      <cylinderGeometry args={[0.37, 0.3, 0.5, 10]} />
      <meshStandardMaterial color="#93704e" />
    </mesh>
    <mesh position={[-1.31, 0.34, 0.18]} castShadow>
      <boxGeometry args={[0.66, 0.65, 0.7]} />
      <meshStandardMaterial color="#b89a71" />
    </mesh>
  </group>;
}

function MarketPerson({ x, z, color, walking, phase }: { x: number; z: number; color: string; walking: boolean; phase: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.32 + phase;
    ref.current.position.x = x + (walking ? Math.sin(t) * 1.05 : 0);
    ref.current.position.z = z + (walking ? Math.cos(t) * 0.4 : 0);
    if (walking) ref.current.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
  });
  return <group ref={ref} position={[x, 0, z]}>
    <mesh position={[0, 0.92, 0]} castShadow>
      <capsuleGeometry args={[0.22, 0.85, 4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.72, 0]} castShadow>
      <sphereGeometry args={[0.23, 10, 8]} />
      <meshStandardMaterial color="#95684b" />
    </mesh>
    <mesh position={[0, 1.91, 0]}>
      <sphereGeometry args={[0.21, 10, 8]} />
      <meshStandardMaterial color="#292420" />
    </mesh>
  </group>;
}

export function LivingMarket({ time }: { time: TimeOfDay }) {
  const night = time === "night";
  return <group>
    <mesh position={[-7.45, 0.025, -9.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8.7, 10]} />
      <meshStandardMaterial color="#ab9b7f" />
    </mesh>
    {STALLS.map((stall, index) => <Stall key={index} stall={stall} />)}
    <MarketPerson x={-7.5} z={-12.1} color="#d6a448" walking={false} phase={0} />
    <MarketPerson x={-7.5} z={-8.2} color="#7d627f" walking={false} phase={1} />
    {!night && <MarketPerson x={-7.45} z={-10} color="#467b75" walking phase={0} />}
    {time === "afternoon" && <MarketPerson x={-7.25} z={-6.1} color="#b36b56" walking phase={3} />}
    {night && <pointLight position={[-7.4, 2.9, -9.6]} color="#ffcf8e" intensity={5} distance={8} decay={2} />}
  </group>;
}
