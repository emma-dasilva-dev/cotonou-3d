"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { TimeOfDay } from "./StreetAtmosphere";

function Zem({ vertical, phase, time }: { vertical: boolean; phase: number; time: TimeOfDay }) {
  const group = useRef<Group>(null);
  const active = time !== "night";
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.visible = active;
    if (!active) return;
    const span = 30;
    const travel = ((clock.elapsedTime * 2.8 + phase) % span) - 15;
    group.current.position.set(vertical ? -0.85 : travel, 0, vertical ? travel : 0.72);
    group.current.rotation.y = vertical ? 0 : Math.PI / 2;
  });
  return <group ref={group}>
    {/* Stylized yellow-shirted motorbike taxis on set road paths. */}
    <mesh position={[0, 0.48, 0]} castShadow>
      <boxGeometry args={[0.29, 0.2, 1.05]} />
      <meshStandardMaterial color="#363b3c" />
    </mesh>
    {[-0.42, 0.42].map(z => <mesh key={z} position={[0, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.27, 0.075, 6, 10]} />
      <meshStandardMaterial color="#25292b" />
    </mesh>)}
    <mesh position={[0, 0.9, 0.05]} castShadow>
      <capsuleGeometry args={[0.18, 0.33, 4, 8]} />
      <meshStandardMaterial color="#e7c93b" />
    </mesh>
    <mesh position={[0, 1.33, 0.09]} castShadow>
      <sphereGeometry args={[0.19, 10, 8]} />
      <meshStandardMaterial color="#303c41" />
    </mesh>
    <mesh position={[0, 0.93, 0.39]}>
      <boxGeometry args={[0.43, 0.07, 0.06]} />
      <meshStandardMaterial color="#3f4444" />
    </mesh>
  </group>;
}

export function ZemidjanTraffic({ time }: { time: TimeOfDay }) {
  return <group>
    <Zem time={time} phase={0} vertical={false} />
    <Zem time={time} phase={14} vertical />
  </group>;
}
