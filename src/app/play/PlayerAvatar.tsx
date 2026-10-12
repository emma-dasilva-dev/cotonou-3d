"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type AvatarProps = { speed: React.RefObject<number> };

/**
 * Procedural placeholder avatar. Locomotion is driven by the same resolved
 * speed as player translation, so walking stops when a wall blocks motion.
 * Replace with a rigged model and animation clips after the controller is stable.
 */
export function PlayerAvatar({ speed }: AvatarProps) {
  const root = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const stride = useRef(0);
  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    const intensity = Math.min(1, speed.current / 3.3);
    stride.current += step * (4 + speed.current * 2.1);
    const swing = Math.sin(stride.current) * 0.52 * intensity;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.75;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.75;
    if (root.current) root.current.position.y = Math.abs(Math.sin(stride.current)) * 0.055 * intensity + Math.sin(stride.current * 0.45) * 0.008 * (1 - intensity);
  });
  return (
    <group ref={root}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.65, 6, 12]} />
        <meshStandardMaterial color="#29475a" roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.92, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 12]} />
        <meshStandardMaterial color="#946247" roughness={0.96} />
      </mesh>
      <mesh position={[0, 2.16, -0.025]} castShadow>
        <sphereGeometry args={[0.245, 16, 10]} />
        <meshStandardMaterial color="#252421" roughness={0.98} />
      </mesh>
      {([-1, 1] as const).map(side => (
        <group key={side}>
          <group ref={side === -1 ? leftArm : rightArm} position={[side * 0.44, 1.51, 0]}>
            <mesh position={[side * 0.015, -0.30, 0]} castShadow>
              <capsuleGeometry args={[0.12, 0.36, 4, 8]} />
              <meshStandardMaterial color="#946247" />
            </mesh>
          </group>
          <group ref={side === -1 ? leftLeg : rightLeg} position={[side * 0.16, 0.84, 0]}>
            <mesh position={[0, -0.33, 0]} castShadow>
              <capsuleGeometry args={[0.14, 0.42, 4, 8]} />
              <meshStandardMaterial color="#363b40" />
            </mesh>
            <mesh position={[0, -0.70, 0.13]} castShadow>
              <boxGeometry args={[0.29, 0.15, 0.45]} />
              <meshStandardMaterial color="#242526" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
