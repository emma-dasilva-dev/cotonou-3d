"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const SAND = "#d6ba8c";
const SAND_LIGHT = "#e2ccaa";
const SAND_DARK = "#b89468";
const GLASS = "#52717a";
const GLASS_DARK = "#3f5e67";
const GREEN = "#5f715e";
const TRUNK = "#745f4c";
const WATER = "#78a6b0";
const DECK = "#9b7457";
const THATCH = "#806846";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.62 + position[2] * 0.38;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.34 + phase) * 0.012;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.58 + phase) * 0.027;
      crownRef.current.rotation.y = Math.cos(time * 0.43 + phase) * 0.018;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 1.16, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.94} />
      </mesh>

      <group ref={crownRef} position={[0, 1.18, 0]}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.24, -0.04, Math.sin(angle) * 0.24]}
              rotation={[-0.46, -angle, Math.sin(angle) * 0.16]}
              castShadow
            >
              <planeGeometry args={[0.25, 0.9]} />
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

function Window({
  position,
  arched = false,
}: {
  position: [number, number, number];
  arched?: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.29, arched ? 0.34 : 0.26, 0.04]} />
        <meshStandardMaterial color={GLASS_DARK} roughness={0.34} metalness={0.07} />
      </mesh>

      {arched && (
        <mesh position={[0, 0.18, 0]}>
          <circleGeometry args={[0.145, 20, 0, Math.PI]} />
          <meshStandardMaterial color={GLASS_DARK} roughness={0.34} metalness={0.07} />
        </mesh>
      )}
    </group>
  );
}

function MainHotel() {
  return (
    <group>
      <mesh position={[-0.15, 1.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.65, 3.35, 1.72]} />
        <meshStandardMaterial color={SAND} roughness={0.9} />
      </mesh>

      <mesh position={[2.22, 1.76, 0.02]} castShadow>
        <boxGeometry args={[0.9, 3.42, 1.78]} />
        <meshStandardMaterial color={SAND_LIGHT} roughness={0.88} />
      </mesh>

      <mesh position={[2.29, 1.82, -0.91]}>
        <boxGeometry args={[0.63, 3.14, 0.055]} />
        <meshStandardMaterial color={GLASS} roughness={0.28} metalness={0.1} />
      </mesh>

      <mesh position={[2.29, 1.82, -0.95]}>
        <boxGeometry args={[0.055, 3.18, 0.08]} />
        <meshStandardMaterial color={SAND_DARK} roughness={0.88} />
      </mesh>

      {Array.from({ length: 5 }).flatMap((_, row) =>
        Array.from({ length: 7 }).map((__, column) => (
          <Window
            key={`${row}-${column}`}
            position={[
              -1.85 + column * 0.58,
              0.72 + row * 0.53,
              -0.88,
            ]}
            arched={row === 4}
          />
        )),
      )}

      <mesh position={[-2.18, 1.8, -0.88]}>
        <boxGeometry args={[0.2, 3.0, 0.08]} />
        <meshStandardMaterial color={SAND_DARK} roughness={0.9} />
      </mesh>

      <mesh position={[-0.15, 3.43, 0.02]} castShadow>
        <boxGeometry args={[4.78, 0.16, 1.82]} />
        <meshStandardMaterial color={SAND_LIGHT} roughness={0.88} />
      </mesh>

      <Text
        position={[-0.25, 3.6, -0.94]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.2}
        letterSpacing={0.11}
        color="#5a4130"
        anchorX="center"
        anchorY="middle"
      >
        AZALAÏ
      </Text>
    </group>
  );
}

function EntranceWing() {
  return (
    <group position={[-0.35, 0, -1.36]}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.76, 0.92]} />
        <meshStandardMaterial color={SAND_LIGHT} roughness={0.9} />
      </mesh>

      <mesh position={[0.25, 0.38, -0.48]}>
        <boxGeometry args={[2.15, 0.48, 0.055]} />
        <meshStandardMaterial color={GLASS} roughness={0.3} metalness={0.08} />
      </mesh>

      <mesh position={[-1.55, 0.62, -0.1]} castShadow>
        <boxGeometry args={[1.35, 0.12, 1.05]} />
        <meshStandardMaterial color={SAND_DARK} roughness={0.86} />
      </mesh>
    </group>
  );
}

function ThatchedShade({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.9, 10]} />
        <meshStandardMaterial color={TRUNK} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.48, 0.26, 24]} />
        <meshStandardMaterial color={THATCH} roughness={1} />
      </mesh>
      <mesh position={[0.18, 0.12, 0.08]}>
        <boxGeometry args={[0.52, 0.08, 0.22]} />
        <meshStandardMaterial color={DECK} roughness={0.94} />
      </mesh>
    </group>
  );
}

function PoolArea() {
  return (
    <group position={[0, 0, -2.3]}>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[5.4, 0.05, 2.25]} />
        <meshStandardMaterial color={DECK} roughness={0.96} />
      </mesh>

      <mesh position={[0.45, 0.06, 0]}>
        <cylinderGeometry args={[1.32, 1.58, 0.04, 48]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.18}
          metalness={0.12}
          transparent
          opacity={0.91}
        />
      </mesh>

      <mesh position={[-0.72, 0.06, 0.12]} scale={[1.15, 1, 0.78]}>
        <cylinderGeometry args={[0.86, 1.05, 0.04, 40]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.18}
          metalness={0.12}
          transparent
          opacity={0.91}
        />
      </mesh>

      <ThatchedShade position={[-2.05, 0, -0.6]} />
      <ThatchedShade position={[-1.25, 0, 0.72]} />
      <ThatchedShade position={[1.85, 0, -0.7]} />

      {[-1.75, -0.95, 0.95, 1.65].map((x) => (
        <mesh key={x} position={[x, 0.14, 0.84]} rotation={[0, -0.08, 0]}>
          <boxGeometry args={[0.55, 0.07, 0.22]} />
          <meshStandardMaterial color="#4f4a45" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function AzalaiExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, 0.04, 0]}>
      <MainHotel />
      <EntranceWing />
      <PoolArea />

      <mesh position={[0, 0.035, 1.22]} receiveShadow>
        <boxGeometry args={[5.35, 0.07, 0.72]} />
        <meshStandardMaterial color="#aa9f8f" roughness={0.97} />
      </mesh>

      <Palm position={[-2.25, 0.05, -1.2]} scale={0.88} />
      <Palm position={[2.45, 0.05, -1.15]} scale={0.86} />
      <Palm position={[-2.45, 0.05, 0.95]} scale={0.8} />
      <Palm position={[2.25, 0.05, 1.0]} scale={0.78} />

      {[-1.6, -0.9, 1.1, 1.75].map((x) => (
        <mesh key={x} position={[x, 0.15, 1.05]}>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}
