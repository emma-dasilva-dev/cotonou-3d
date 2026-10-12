"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { HAIR_COLORS, OUTFIT_COLORS, SKIN_COLORS } from "./appearance";
import type { Appearance } from "./appearance";

type AvatarProps = { speed: React.RefObject<number>; appearance: Appearance };

/** Stylized, lightweight character shared by the game and customization preview. */
export function PlayerAvatar({ speed, appearance }: AvatarProps) {
  const root = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const stride = useRef(0);
  const walking = useRef(0);
  const masculine = appearance.body === "masculine";
  const skin = SKIN_COLORS[appearance.skin];
  const shirt = OUTFIT_COLORS[appearance.outfit];
  const hair = HAIR_COLORS[appearance.hair];

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    const target = Math.min(1, speed.current / 3.3);
    walking.current += (target - walking.current) * (1 - Math.exp(-12 * step));
    stride.current += step * (4 + speed.current * 2.1);
    const swing = Math.sin(stride.current) * 0.58 * walking.current;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.68;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.68;
    if (root.current) root.current.position.y =
      Math.abs(Math.sin(stride.current)) * 0.042 * walking.current +
      Math.sin(stride.current * 0.45) * 0.006 * (1 - walking.current);
  });

  return <group ref={root}>
    {/* Upper body: distinct shoulders, waist and hips rather than a capsule. */}
    <mesh position={[0, 1.43, 0]} scale={[masculine ? 1.16 : 0.92, 1, 0.66]} castShadow>
      <cylinderGeometry args={[masculine ? 0.38 : 0.34, masculine ? 0.29 : 0.26, 0.73, 12]} />
      <meshStandardMaterial color={shirt} roughness={0.91} />
    </mesh>
    <mesh position={[0, 1.07, 0]} scale={[masculine ? 1 : 1.14, 1, 0.8]} castShadow>
      <sphereGeometry args={[0.31, 16, 12]} />
      <meshStandardMaterial color="#353b40" roughness={0.96} />
    </mesh>
    {/* Neck, face, nose, eyes and ears all follow the selected skin tone. */}
    <mesh position={[0, 1.88, 0]} castShadow>
      <cylinderGeometry args={[0.11, 0.12, 0.22, 12]} />
      <meshStandardMaterial color={skin} roughness={0.95} />
    </mesh>
    <mesh position={[0, 2.17, 0]} scale={[masculine ? 1.02 : 0.96, 1.09, 0.91]} castShadow>
      <sphereGeometry args={[0.285, 20, 16]} />
      <meshStandardMaterial color={skin} roughness={0.97} />
    </mesh>
    <mesh position={[0, 2.13, 0.275]} castShadow>
      <sphereGeometry args={[0.065, 10, 8]} />
      <meshStandardMaterial color={skin} />
    </mesh>
    {([-1, 1] as const).map(side => <group key={`face-${side}`}>
      <mesh position={[side * 0.12, 2.2, 0.234]}>
        <sphereGeometry args={[0.023, 8, 8]} />
        <meshStandardMaterial color="#251f1c" />
      </mesh>
      <mesh position={[side * 0.275, 2.13, 0]} castShadow>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color={skin} />
      </mesh>
    </group>)}
    {/* Hairstyles stay compatible with existing saved appearance choices. */}
    {appearance.hairstyle === "short" && <mesh position={[0, 2.35, -0.036]} scale={[1, 0.52, 0.95]} castShadow>
      <sphereGeometry args={[0.298, 18, 12]} />
      <meshStandardMaterial color={hair} roughness={1} />
    </mesh>}
    {appearance.hairstyle === "afro" && <mesh position={[0, 2.38, -0.035]} castShadow>
      <sphereGeometry args={[0.39, 20, 16]} />
      <meshStandardMaterial color={hair} roughness={1} />
    </mesh>}
    {appearance.hairstyle === "bun" && <>
      <mesh position={[0, 2.35, -0.04]} scale={[1, 0.57, 1]} castShadow>
        <sphereGeometry args={[0.296, 18, 12]} />
        <meshStandardMaterial color={hair} roughness={1} />
      </mesh>
      <mesh position={[0, 2.51, -0.23]} castShadow>
        <sphereGeometry args={[0.19, 14, 10]} />
        <meshStandardMaterial color={hair} roughness={1} />
      </mesh>
    </>}
    {([-1, 1] as const).map(side => <group key={side}>
      <group ref={side === -1 ? leftArm : rightArm} position={[side * (masculine ? 0.48 : 0.39), 1.72, 0]}>
        <mesh position={[side * 0.015, -0.17, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.2, 6, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.93} />
        </mesh>
        <mesh position={[side * 0.02, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.105, 0.28, 6, 10]} />
          <meshStandardMaterial color={skin} roughness={0.95} />
        </mesh>
        <mesh position={[side * 0.02, -0.70, 0.015]} castShadow>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>
      <group ref={side === -1 ? leftLeg : rightLeg} position={[side * (masculine ? 0.19 : 0.17), 0.91, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.153, 0.41, 6, 12]} />
          <meshStandardMaterial color="#343b44" roughness={0.94} />
        </mesh>
        <mesh position={[0, -0.76, 0.125]} castShadow>
          <boxGeometry args={[0.31, 0.17, 0.47]} />
          <meshStandardMaterial color="#252827" roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.75, 0.355]}>
          <boxGeometry args={[0.29, 0.055, 0.025]} />
          <meshStandardMaterial color="#a5a296" />
        </mesh>
      </group>
    </group>)}
  </group>;
}
