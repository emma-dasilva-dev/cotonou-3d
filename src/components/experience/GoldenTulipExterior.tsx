"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const WHITE = "#dedfdc";
const WHITE_WARM = "#d2d1cb";
const RED = "#a8463a";
const GLASS = "#56666a";
const BAND = "#9ea4a3";
const DARK = "#444746";
const GREEN = "#65705f";
const TRUNK = "#715c49";
const WATER = "#789197";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.58 + position[2] * 0.37;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.33 + phase) * 0.012;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.56 + phase) * 0.026;
      crownRef.current.rotation.y = Math.cos(time * 0.42 + phase) * 0.018;
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

function Flag({
  position,
  colors,
}: {
  position: [number, number, number];
  colors: string[];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.016, 1.45, 10]} />
        <meshStandardMaterial color="#777b79" roughness={0.55} metalness={0.22} />
      </mesh>

      <group position={[0.21, 1.22, 0]}>
        {colors.map((color, index) => (
          <mesh key={color + index} position={[(index - 1) * 0.14, 0, 0]}>
            <planeGeometry args={[0.14, 0.26]} />
            <meshStandardMaterial color={color} side={DoubleSide} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function WindowStrip({
  y,
  columns = 9,
}: {
  y: number;
  columns?: number;
}) {
  const spacing = 0.43;

  return (
    <group position={[0, y, -0.775]}>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[4.25, 0.28, 0.035]} />
        <meshStandardMaterial color={BAND} roughness={0.64} />
      </mesh>

      {Array.from({ length: columns }).map((_, index) => {
        const x = -1.72 + index * spacing;
        return (
          <mesh key={index} position={[x, 0, -0.018]}>
            <boxGeometry args={[0.24, 0.14, 0.035]} />
            <meshStandardMaterial color={GLASS} roughness={0.33} metalness={0.06} />
          </mesh>
        );
      })}
    </group>
  );
}

function MainBlock() {
  return (
    <group>
      <mesh position={[0, 1.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.85, 2.95, 1.5]} />
        <meshStandardMaterial color={WHITE} roughness={0.9} />
      </mesh>

      <mesh position={[-2.18, 1.42, -0.08]} castShadow>
        <boxGeometry args={[0.42, 2.72, 1.62]} />
        <meshStandardMaterial color={RED} roughness={0.84} />
      </mesh>

      <mesh position={[2.17, 1.55, -0.02]} castShadow>
        <boxGeometry args={[0.5, 2.85, 1.56]} />
        <meshStandardMaterial color={WHITE_WARM} roughness={0.9} />
      </mesh>

      {[0.72, 1.14, 1.56, 1.98, 2.4].map((y) => (
        <WindowStrip key={y} y={y} />
      ))}

      <mesh position={[0, 2.92, -0.02]} castShadow>
        <boxGeometry args={[5.05, 0.16, 1.62]} />
        <meshStandardMaterial color={WHITE_WARM} roughness={0.86} />
      </mesh>

      <Text
        position={[-1.06, 3.07, -0.84]}
        rotation={[0, Math.PI, 0]}\n        fontSize={0.15}
        letterSpacing={0.08}
        color={DARK}
        anchorX="center"
        anchorY="middle"
      >
        GOLDEN TULIP
      </Text>

      <Text
        position={[0.7, 3.07, -0.84]}
        rotation={[0, Math.PI, 0]}\n        fontSize={0.085}
        letterSpacing={0.08}
        color={DARK}
        anchorX="center"
        anchorY="middle"
      >
        LE DIPLOMATE
      </Text>
    </group>
  );
}

function EntranceWing() {
  return (
    <group position={[0.2, 0, -1.38]}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.55, 0.56, 0.88]} />
        <meshStandardMaterial color={WHITE_WARM} roughness={0.9} />
      </mesh>

      <mesh position={[-1.48, 0.29, -0.46]}>
        <boxGeometry args={[1.55, 0.44, 0.05]} />
        <meshStandardMaterial color={RED} roughness={0.84} />
      </mesh>

      <mesh position={[0.55, 0.29, -0.46]}>
        <boxGeometry args={[1.45, 0.4, 0.05]} />
        <meshStandardMaterial color={GLASS} roughness={0.31} metalness={0.06} />
      </mesh>

      <mesh position={[0.2, 0.64, -0.12]} rotation={[0.03, 0, 0]} castShadow>
        <boxGeometry args={[4.7, 0.08, 1.02]} />
        <meshStandardMaterial color={WHITE} roughness={0.82} />
      </mesh>

      {[-1.9, -0.65, 0.6, 1.85].map((x) => (
        <mesh key={x} position={[x, 0.33, 0.06]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.64, 12]} />
          <meshStandardMaterial color="#848782" roughness={0.66} />
        </mesh>
      ))}
    </group>
  );
}

function PoolCourtyard() {
  return (
    <group position={[1.15, 0, 1.45]}>
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[2.95, 0.07, 1.5]} />
        <meshStandardMaterial color="#b8aa98" roughness={0.96} />
      </mesh>

      <mesh position={[0.15, 0.075, 0]}>
        <boxGeometry args={[1.65, 0.025, 0.92]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.2}
          metalness={0.12}
          transparent
          opacity={0.9}
        />
      </mesh>

      {[-1.15, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.16, 0.4]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

export function GoldenTulipExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, -0.1, 0]}>
      <MainBlock />
      <EntranceWing />
      <PoolCourtyard />

      <mesh position={[0, 0.04, -2.18]} receiveShadow>
        <boxGeometry args={[5.7, 0.07, 1.15]} />
        <meshStandardMaterial color="#aaa49a" roughness={0.96} />
      </mesh>

      <Flag position={[-1.85, 0.04, -2.4]} colors={["#2f8c50", "#f1c93d", "#c5453f"]} />
      <Flag position={[-0.65, 0.04, -2.45]} colors={["#3459a5", "#ffffff", "#d94b47"]} />
      <Flag position={[0.65, 0.04, -2.45]} colors={["#2c7d4e", "#f2d047", "#c8473f"]} />
      <Flag position={[1.85, 0.04, -2.4]} colors={["#5a4a9a", "#ffffff", "#5a4a9a"]} />

      <Palm position={[-2.25, 0.06, -1.7]} scale={0.74} />
      <Palm position={[2.45, 0.06, -1.55]} scale={0.76} />
      <Palm position={[-2.35, 0.06, 1.12]} scale={0.7} />
    </group>
  );
}
