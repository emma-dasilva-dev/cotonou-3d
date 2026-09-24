"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const IVORY = "#e5e1d7";
const IVORY_DARK = "#d4d0c7";
const ROOF = "#6f746c";
const GLASS = "#59686b";
const OCHRE = "#c89b3c";
const OCHRE_DARK = "#a87b2f";
const GREEN = "#64735f";
const TRUNK = "#715d4c";
const WATER = "#78a0aa";
const WOOD = "#71523e";
const RED = "#a64235";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.57 + position[2] * 0.41;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.34 + phase) * 0.012;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.6 + phase) * 0.027;
      crownRef.current.rotation.y = Math.cos(time * 0.46 + phase) * 0.019;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 1.04, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.94} />
      </mesh>

      <group ref={crownRef} position={[0, 1.06, 0]}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.22, -0.04, Math.sin(angle) * 0.22]}
              rotation={[-0.46, -angle, Math.sin(angle) * 0.16]}
              castShadow
            >
              <planeGeometry args={[0.23, 0.82]} />
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

function HippedRoof({
  position,
  width,
  depth,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, Math.PI / 4, 0]}
      scale={[width, 0.34, depth]}
      castShadow
    >
      <coneGeometry args={[0.72, 1, 4]} />
      <meshStandardMaterial color={ROOF} roughness={0.92} />
    </mesh>
  );
}

function WindowGrid({
  xStart,
  columns,
  rows,
  spacingX,
  spacingY,
  z,
}: {
  xStart: number;
  columns: number;
  rows: number;
  spacingX: number;
  spacingY: number;
  z: number;
}) {
  return (
    <group>
      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: columns }).map((__, column) => (
          <mesh
            key={`${row}-${column}`}
            position={[
              xStart + column * spacingX,
              0.92 + row * spacingY,
              z,
            ]}
          >
            <boxGeometry args={[0.3, 0.18, 0.035]} />
            <meshStandardMaterial
              color={GLASS}
              roughness={0.34}
              metalness={0.07}
            />
          </mesh>
        )),
      )}
    </group>
  );
}

function HotelBlock() {
  return (
    <group position={[0, 0, 0.35]}>
      <mesh position={[0, 1.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.35, 2.52, 1.5]} />
        <meshStandardMaterial color={IVORY} roughness={0.92} />
      </mesh>

      <mesh position={[-2.1, 1.34, 0.02]} castShadow>
        <boxGeometry args={[0.62, 2.35, 1.55]} />
        <meshStandardMaterial color={IVORY_DARK} roughness={0.92} />
      </mesh>

      <mesh position={[2.1, 1.34, 0.02]} castShadow>
        <boxGeometry args={[0.62, 2.35, 1.55]} />
        <meshStandardMaterial color={IVORY_DARK} roughness={0.92} />
      </mesh>

      <WindowGrid
        xStart={-1.7}
        columns={6}
        rows={4}
        spacingX={0.68}
        spacingY={0.48}
        z={-0.77}
      />

      <mesh position={[0, 0.37, -0.81]}>
        <boxGeometry args={[4.45, 0.55, 0.06]} />
        <meshStandardMaterial color={OCHRE} roughness={0.85} />
      </mesh>

      <mesh position={[0.45, 0.37, -0.845]}>
        <boxGeometry args={[1.55, 0.38, 0.045]} />
        <meshStandardMaterial color={GLASS} roughness={0.32} metalness={0.06} />
      </mesh>

      <HippedRoof position={[-1.45, 2.78, 0.08]} width={1.9} depth={1.3} />
      <HippedRoof position={[1.45, 2.78, 0.08]} width={1.9} depth={1.3} />
      <HippedRoof position={[0, 2.86, 0.05]} width={1.35} depth={1.02} />

      <Text
        position={[0, 0.68, -0.86]}
        fontSize={0.17}
        letterSpacing={0.1}
        color="#363735"
        anchorX="center"
        anchorY="middle"
      >
        NOVOTEL
      </Text>
    </group>
  );
}

function Cabana({
  x,
}: {
  x: number;
}) {
  return (
    <group position={[x, 0, -1.85]}>
      {[-0.28, 0.28].map((px) => (
        <mesh key={px} position={[px, 0.42, 0]} castShadow>
          <boxGeometry args={[0.04, 0.84, 0.04]} />
          <meshStandardMaterial color="#eceae4" roughness={0.82} />
        </mesh>
      ))}

      <mesh position={[0, 0.83, 0]} castShadow>
        <boxGeometry args={[0.65, 0.045, 0.72]} />
        <meshStandardMaterial color="#f0eee7" roughness={0.82} />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.45, 0.12, 0.52]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Umbrella({
  x,
  z,
}: {
  x: number;
  z: number;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.022, 0.026, 0.9, 10]} />
        <meshStandardMaterial color="#5a524b" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.42, 0.14, 24]} />
        <meshStandardMaterial color={RED} roughness={0.86} />
      </mesh>

      <mesh position={[0.22, 0.11, 0.14]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.48, 0.055, 0.18]} />
        <meshStandardMaterial color={WOOD} roughness={0.94} />
      </mesh>
    </group>
  );
}

function PoolGarden() {
  return (
    <group position={[0.2, 0, -2.15]}>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.05, 2.1]} />
        <meshStandardMaterial color="#d7d0c4" roughness={0.96} />
      </mesh>

      <mesh position={[0.35, 0.06, 0.1]}>
        <boxGeometry args={[3.15, 0.025, 1.25]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.2}
          metalness={0.11}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Cabana x={-1.95} />
      <Cabana x={-1.15} />
      <Cabana x={-0.35} />
      <Cabana x={0.45} />

      <Umbrella x={1.7} z={-0.65} />
      <Umbrella x={2.18} z={0.62} />

      <mesh position={[-2.25, 0.04, 1.15]} receiveShadow>
        <boxGeometry args={[1.45, 0.07, 0.62]} />
        <meshStandardMaterial color="#84906f" roughness={1} />
      </mesh>
    </group>
  );
}

export function NovotelExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, 0.08, 0]}>
      <HotelBlock />
      <PoolGarden />

      <mesh position={[0, 0.04, 1.48]} receiveShadow>
        <boxGeometry args={[5.1, 0.07, 0.95]} />
        <meshStandardMaterial color="#a8a197" roughness={0.96} />
      </mesh>

      <Palm position={[-2.35, 0.05, -1.22]} scale={0.8} />
      <Palm position={[2.48, 0.05, -1.0]} scale={0.78} />
      <Palm position={[-2.45, 0.05, 1.1]} scale={0.74} />
      <Palm position={[2.35, 0.05, 1.18]} scale={0.72} />

      {[-1.55, -0.8, 0.9, 1.65].map((x) => (
        <mesh key={x} position={[x, 0.16, 1.2]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}
