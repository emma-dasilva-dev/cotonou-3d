"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";
import { AnimatedWaterSurface } from "./AnimatedWaterSurface";

const CREAM = "#ded6c7";
const CREAM_DARK = "#c9c0b1";
const RED = "#a84936";
const GLASS = "#3f4545";
const TERRACE = "#b9aa96";
const GREEN = "#5e6d5d";
const TRUNK = "#725f4e";

function Window({
  position,
  scale = [0.28, 0.16, 0.026],
}: {
  position: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={GLASS} roughness={0.48} metalness={0.08} />
    </mesh>
  );
}

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.7 + position[2] * 0.45;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.42 + phase) * 0.018;
      palmRef.current.rotation.x = Math.cos(time * 0.34 + phase) * 0.008;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.7 + phase) * 0.035;
      crownRef.current.rotation.y = Math.cos(time * 0.5 + phase) * 0.025;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.52, 0]} rotation={[0, 0, -0.08]} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 1.05, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.92} />
      </mesh>

      <group ref={crownRef} position={[0, 1.08, 0]}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.24, -0.05, Math.sin(angle) * 0.24]}
              rotation={[-0.48, -angle, Math.sin(angle) * 0.18]}
              castShadow
            >
              <planeGeometry args={[0.26, 0.9]} />
              <meshStandardMaterial
                color={GREEN}
                roughness={0.88}
                side={DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function FrontWindows() {
  const windows = [];

  for (let floor = 0; floor < 5; floor += 1) {
    const y = 0.56 + floor * 0.39;
    for (let column = 0; column < 6; column += 1) {
      const x = -0.92 + column * 0.38;
      if (column >= 4 && floor < 4) continue;
      windows.push(
        <Window key={`${floor}-${column}`} position={[x, y, -0.686]} />,
      );
    }
  }

  return <>{windows}</>;
}

function BalconyStack() {
  return (
    <group position={[0.78, 0, -0.82]}>
      {[0.67, 1.08, 1.49].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <RoundedBox args={[1.15, 0.09, 0.48]} radius={0.16} smoothness={5} castShadow>
            <meshStandardMaterial color={CREAM} roughness={0.86} />
          </RoundedBox>
          <RoundedBox
            args={[1.2, 0.055, 0.51]}
            radius={0.17}
            smoothness={5}
            position={[0, 0.095, 0]}
          >
            <meshStandardMaterial color={RED} roughness={0.72} />
          </RoundedBox>
          <Window position={[0, 0.16, 0.235]} scale={[0.52, 0.13, 0.018]} />
        </group>
      ))}
    </group>
  );
}

function PoolDeck() {
  return (
    <group position={[0.1, 0, -1.95]}>
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.07, 2.25]} />
        <meshStandardMaterial color={TERRACE} roughness={0.98} />
      </mesh>

      <mesh position={[0.35, 0.078, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.045, 1.08]} />
        <meshStandardMaterial
          color="#66858b"
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>

      <AnimatedWaterSurface
        position={[0.35, 0.108, 0]}
        size={[2.28, 0.87]}
        color="#6f8e95"
        lightColor="#a6bbc0"
        amplitude={0.018}
        speed={0.95}
        opacity={0.9}
        segments={[48, 18]}
      />

      {[-1.55, -0.95, 1.52].map((x, index) => (
        <group key={x} position={[x, 0.1, -0.66]}>
          <mesh rotation={[0, index === 2 ? -0.25 : 0.12, 0]}>
            <boxGeometry args={[0.52, 0.045, 0.18]} />
            <meshStandardMaterial color="#705945" roughness={0.92} />
          </mesh>
        </group>
      ))}

      <mesh position={[-1.7, 0.38, 0.55]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.68, 10]} />
        <meshStandardMaterial color="#514a43" />
      </mesh>
      <mesh position={[-1.7, 0.73, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.44, 0.12, 24]} />
        <meshStandardMaterial color="#536354" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TerracePavilion() {
  return (
    <group position={[-1.65, 0, -0.92]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.45, 0.38, 0.9]} />
        <meshStandardMaterial color="#8a6d56" roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.48, 0]} rotation={[0, 0.03, 0]} castShadow>
        <coneGeometry args={[1.05, 0.34, 4]} />
        <meshStandardMaterial color="#69594d" roughness={1} />
      </mesh>
    </group>
  );
}

export function HotelDuLacExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, -0.1, 0]}>
      <mesh position={[0, 1.23, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 2.42, 1.36]} />
        <meshStandardMaterial color={CREAM} roughness={0.91} />
      </mesh>

      <mesh position={[-1.43, 1.27, 0]} castShadow>
        <boxGeometry args={[0.24, 2.56, 1.46]} />
        <meshStandardMaterial color={RED} roughness={0.78} />
      </mesh>

      <mesh position={[1.5, 1.16, 0.02]} castShadow>
        <boxGeometry args={[0.72, 2.08, 1.42]} />
        <meshStandardMaterial color={CREAM_DARK} roughness={0.9} />
      </mesh>

      {[0.5, 0.88, 1.26, 1.64].map((y) => (
        <mesh key={y} position={[1.51, y, -0.73]}>
          <boxGeometry args={[0.58, 0.05, 0.05]} />
          <meshStandardMaterial color={RED} roughness={0.8} />
        </mesh>
      ))}

      <mesh position={[0, 2.48, 0]} castShadow>
        <boxGeometry args={[3.34, 0.14, 1.49]} />
        <meshStandardMaterial color={RED} roughness={0.76} />
      </mesh>

      <FrontWindows />

      <Window position={[-0.65, 1.37, -0.701]} scale={[0.92, 0.15, 0.025]} />
      <Window position={[-0.65, 1.75, -0.701]} scale={[0.92, 0.15, 0.025]} />

      <BalconyStack />

      <Text
        position={[0.15, 2.72, -0.755]}
        rotation={[0, 0, 0]}
        fontSize={0.18}
        letterSpacing={0.08}
        color={RED}
        anchorX="center"
        anchorY="middle"
      >
        HÔTEL DU LAC
      </Text>

      <PoolDeck />
      <TerracePavilion />

      <Palm position={[-2.15, 0.08, -2.25]} scale={0.92} />
      <Palm position={[2.05, 0.08, -2.15]} scale={0.86} />
      <Palm position={[-2.45, 0.08, 0.82]} scale={0.78} />

      <mesh position={[0.3, 0.05, 1.15]} receiveShadow>
        <boxGeometry args={[4.4, 0.08, 0.6]} />
        <meshStandardMaterial color="#a8a095" roughness={0.95} />
      </mesh>
    </group>
  );
}
