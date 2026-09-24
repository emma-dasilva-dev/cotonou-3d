"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const STONE = "#c8b99f";
const STONE_LIGHT = "#d8ccb7";
const STONE_DARK = "#a9977d";
const GLASS = "#405052";
const RAIL = "#7f7c73";
const GREEN = "#5f6f5e";
const TRUNK = "#74604e";
const WATER = "#789097";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.63 + position[2] * 0.39;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.36 + phase) * 0.014;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.62 + phase) * 0.028;
      crownRef.current.rotation.y = Math.cos(time * 0.44 + phase) * 0.02;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, -0.05]} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 1.1, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.94} />
      </mesh>

      <group ref={crownRef} position={[0, 1.12, 0]}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.23, -0.04, Math.sin(angle) * 0.23]}
              rotation={[-0.45, -angle, Math.sin(angle) * 0.16]}
              castShadow
            >
              <planeGeometry args={[0.24, 0.86]} />
              <meshStandardMaterial
                color={GREEN}
                roughness={0.9}
                side={DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function BalconyLevel({
  y,
  width,
  z = 0,
  offsetX = 0,
  columns,
}: {
  y: number;
  width: number;
  z?: number;
  offsetX?: number;
  columns: number;
}) {
  const usableWidth = width - 0.36;
  const columnWidth = usableWidth / columns;

  return (
    <group position={[offsetX, y, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.12, 1.55]} />
        <meshStandardMaterial color={STONE} roughness={0.86} />
      </mesh>

      <mesh position={[0, 0.22, -0.775]}>
        <boxGeometry args={[usableWidth, 0.33, 0.055]} />
        <meshStandardMaterial color={GLASS} roughness={0.32} metalness={0.1} />
      </mesh>

      {Array.from({ length: columns + 1 }).map((_, index) => {
        const x = -usableWidth / 2 + index * columnWidth;
        return (
          <mesh key={x} position={[x, 0.22, -0.815]} castShadow>
            <boxGeometry args={[0.07, 0.48, 0.13]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.88} />
          </mesh>
        );
      })}

      {Array.from({ length: columns }).map((_, index) => {
        const x = -usableWidth / 2 + columnWidth / 2 + index * columnWidth;
        return (
          <group key={x} position={[x, 0.03, -0.91]}>
            <mesh>
              <boxGeometry args={[columnWidth * 0.8, 0.035, 0.36]} />
              <meshStandardMaterial color={STONE_LIGHT} roughness={0.88} />
            </mesh>
            <mesh position={[0, 0.16, -0.17]}>
              <boxGeometry args={[columnWidth * 0.76, 0.025, 0.025]} />
              <meshStandardMaterial color={RAIL} roughness={0.55} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function EntranceCanopy() {
  return (
    <group position={[0.35, 0, -1.48]}>
      <RoundedBox
        args={[3.6, 0.12, 0.95]}
        radius={0.24}
        smoothness={6}
        position={[0, 0.54, 0]}
        castShadow
      >
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.74} />
      </RoundedBox>

      {[-1.35, 0, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.27, 0.02]} castShadow>
          <cylinderGeometry args={[0.04, 0.055, 0.55, 14]} />
          <meshStandardMaterial color={STONE_DARK} roughness={0.72} />
        </mesh>
      ))}

      <mesh position={[0, 0.28, 0.42]}>
        <boxGeometry args={[1.55, 0.46, 0.055]} />
        <meshStandardMaterial
          color="#526164"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, 0.76, -0.02]}
        fontSize={0.13}
        letterSpacing={0.12}
        color="#383735"
        anchorX="center"
        anchorY="middle"
      >
        SOFITEL
      </Text>
    </group>
  );
}

function ReflectingPool() {
  return (
    <group position={[0.45, 0, -2.25]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[3.75, 0.045, 0.88]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.48, 0.018, 0.66]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.2}
          metalness={0.14}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

export function SofitelExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, 0.18, 0]}>
      <mesh position={[0.1, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.9, 0.68, 1.88]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      <mesh position={[0.1, 0.38, -0.96]}>
        <boxGeometry args={[4.45, 0.42, 0.06]} />
        <meshStandardMaterial color={GLASS} roughness={0.34} metalness={0.08} />
      </mesh>

      <BalconyLevel y={0.83} width={4.8} columns={7} />
      <BalconyLevel y={1.28} width={4.7} columns={7} />
      <BalconyLevel y={1.73} width={4.5} columns={7} offsetX={0.08} z={0.03} />
      <BalconyLevel y={2.18} width={4.12} columns={6} offsetX={0.22} z={0.08} />
      <BalconyLevel y={2.63} width={3.65} columns={6} offsetX={0.42} z={0.15} />
      <BalconyLevel y={3.08} width={3.08} columns={5} offsetX={0.68} z={0.23} />

      <mesh position={[0.78, 3.35, 0.22]} castShadow>
        <boxGeometry args={[3.28, 0.16, 1.58]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.84} />
      </mesh>

      <Text
        position={[0.8, 3.48, -0.6]}
        rotation={[0, 0, 0]}
        fontSize={0.22}
        letterSpacing={0.16}
        color="#373633"
        anchorX="center"
        anchorY="middle"
      >
        SOFITEL
      </Text>

      <EntranceCanopy />
      <ReflectingPool />

      <mesh position={[0, 0.045, 1.35]} receiveShadow>
        <boxGeometry args={[5.35, 0.08, 0.75]} />
        <meshStandardMaterial color="#aaa18f" roughness={0.95} />
      </mesh>

      <Palm position={[-2.45, 0.06, -1.45]} scale={0.88} />
      <Palm position={[2.55, 0.06, -1.25]} scale={0.82} />
      <Palm position={[-2.7, 0.06, 1.18]} scale={0.78} />

      {[-1.75, -0.95, 1.55, 2.05].map((x) => (
        <mesh key={x} position={[x, 0.17, 1.15]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}
