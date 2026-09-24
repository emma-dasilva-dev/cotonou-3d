"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const STONE = "#cdbd9f";
const STONE_LIGHT = "#ddd0ba";
const STONE_DARK = "#ae9b7e";
const GLASS = "#46575a";
const RAIL = "#6f7471";
const GREEN = "#5f705e";
const TRUNK = "#74604e";
const WATER = "#789198";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.61 + position[2] * 0.43;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.34 + phase) * 0.012;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.58 + phase) * 0.026;
      crownRef.current.rotation.y = Math.cos(time * 0.43 + phase) * 0.018;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, -0.045]} castShadow>
        <cylinderGeometry args={[0.055, 0.09, 1.16, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.95} />
      </mesh>

      <group ref={crownRef} position={[0, 1.17, 0]}>
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

function BalconyCell({
  x,
  y,
  width,
}: {
  x: number;
  y: number;
  width: number;
}) {
  return (
    <group position={[x, y, -1.02]}>
      <mesh position={[0, 0.02, 0.025]} castShadow>
        <boxGeometry args={[width, 0.46, 0.12]} />
        <meshStandardMaterial color={GLASS} roughness={0.32} metalness={0.08} />
      </mesh>

      <mesh position={[0, -0.2, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.08, 0.08, 0.48]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.87} />
      </mesh>

      <mesh position={[0, -0.03, -0.41]}>
        <boxGeometry args={[width - 0.08, 0.035, 0.025]} />
        <meshStandardMaterial color={RAIL} roughness={0.52} />
      </mesh>

      <mesh position={[-width / 2 - 0.06, 0.03, -0.13]} castShadow>
        <boxGeometry args={[0.1, 0.58, 0.36]} />
        <meshStandardMaterial color={STONE} roughness={0.89} />
      </mesh>

      <mesh position={[width / 2 + 0.06, 0.03, -0.13]} castShadow>
        <boxGeometry args={[0.1, 0.58, 0.36]} />
        <meshStandardMaterial color={STONE} roughness={0.89} />
      </mesh>
    </group>
  );
}

function MainFacade() {
  const columns = 7;
  const rows = 5;
  const cellWidth = 0.66;
  const stepX = 0.79;
  const stepY = 0.52;

  return (
    <group>
      <mesh position={[0, 1.73, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.75, 3.32, 1.92]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.48, -0.985]}>
        <boxGeometry args={[5.18, 0.72, 0.055]} />
        <meshStandardMaterial color={GLASS} roughness={0.31} metalness={0.08} />
      </mesh>

      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: columns }).map((__, column) => {
          const x = -2.37 + column * stepX;
          const y = 1.05 + row * stepY;

          return (
            <BalconyCell
              key={`${row}-${column}`}
              x={x}
              y={y}
              width={cellWidth}
            />
          );
        }),
      )}

      {Array.from({ length: rows + 1 }).map((_, row) => (
        <mesh
          key={row}
          position={[0, 0.79 + row * stepY, -1.17]}
          castShadow
        >
          <boxGeometry args={[5.72, 0.09, 0.52]} />
          <meshStandardMaterial color={STONE_LIGHT} roughness={0.87} />
        </mesh>
      ))}
    </group>
  );
}

function SteppedWings() {
  const leftSteps = [
    { x: -2.95, y: 0.93, w: 0.75, h: 1.45 },
    { x: -2.73, y: 1.7, w: 1.18, h: 1.05 },
    { x: -2.48, y: 2.42, w: 1.7, h: 0.82 },
  ];

  const rightSteps = [
    { x: 2.98, y: 1.1, w: 0.82, h: 1.75 },
    { x: 2.72, y: 2.02, w: 1.3, h: 1.02 },
    { x: 2.43, y: 2.72, w: 1.85, h: 0.72 },
  ];

  return (
    <group>
      {[...leftSteps, ...rightSteps].map((step, index) => (
        <mesh
          key={index}
          position={[step.x, step.y, 0.08]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[step.w, step.h, 1.82]} />
          <meshStandardMaterial color={STONE} roughness={0.91} />
        </mesh>
      ))}

      {[-2.93, 2.93].map((x) => (
        <mesh key={x} position={[x, 1.45, -0.93]}>
          <boxGeometry args={[0.58, 1.9, 0.05]} />
          <meshStandardMaterial color={GLASS} roughness={0.34} metalness={0.07} />
        </mesh>
      ))}
    </group>
  );
}

function EntranceCanopy() {
  return (
    <group position={[0, 0, -1.75]}>
      <RoundedBox
        args={[5.35, 0.13, 1.08]}
        radius={0.38}
        smoothness={8}
        position={[0, 0.68, 0]}
        castShadow
      >
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.72} />
      </RoundedBox>

      {[-2.05, -0.72, 0.72, 2.05].map((x) => (
        <group key={x} position={[x, 0, 0.03]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.075, 0.58, 18]} />
            <meshStandardMaterial color={STONE_DARK} roughness={0.72} />
          </mesh>

          <mesh position={[0, 0.59, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.22, 0.22, 24]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.72} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.34, 0.48]}>
        <boxGeometry args={[1.88, 0.58, 0.055]} />
        <meshStandardMaterial
          color="#536366"
          roughness={0.28}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, 0.87, -0.02]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.14}
        letterSpacing={0.13}
        color="#3a3937"
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
    <group position={[0, 0, -2.95]}>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[4.85, 0.05, 0.94]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>

      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[4.55, 0.018, 0.69]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.18}
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
    <group position={position} rotation={[0, 0.13, 0]}>
      <MainFacade />
      <SteppedWings />

      <mesh position={[0.28, 3.52, 0.08]} castShadow>
        <boxGeometry args={[4.75, 0.2, 1.78]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.85} />
      </mesh>

      <Text
        position={[0.25, 3.66, -0.86]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.24}
        letterSpacing={0.17}
        color="#383735"
        anchorX="center"
        anchorY="middle"
      >
        SOFITEL
      </Text>

      <EntranceCanopy />
      <ReflectingPool />

      <mesh position={[0, 0.045, 1.42]} receiveShadow>
        <boxGeometry args={[6.15, 0.08, 0.9]} />
        <meshStandardMaterial color="#aca390" roughness={0.96} />
      </mesh>

      <Palm position={[-2.78, 0.06, -1.45]} scale={0.9} />
      <Palm position={[2.9, 0.06, -1.25]} scale={0.86} />
      <Palm position={[-2.7, 0.06, 1.2]} scale={0.8} />
      <Palm position={[2.55, 0.06, 1.25]} scale={0.78} />

      {[-2.15, -1.4, 1.3, 2.05].map((x) => (
        <mesh key={x} position={[x, 0.17, 1.25]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}
