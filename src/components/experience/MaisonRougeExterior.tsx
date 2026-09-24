"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide } from "three";
import type { Group } from "three";

const IVORY = "#ded8ce";
const IVORY_WARM = "#cfc5b7";
const RED = "#93483d";
const RED_DARK = "#6f3832";
const GLASS = "#46585a";
const GREEN = "#596b58";
const GREEN_DARK = "#455744";
const TRUNK = "#725d49";
const WATER = "#76989e";
const DECK = "#a99078";
const ART = "#32312f";

function Palm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const palmRef = useRef<Group>(null);
  const crownRef = useRef<Group>(null);
  const phase = position[0] * 0.59 + position[2] * 0.43;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (palmRef.current) {
      palmRef.current.rotation.z = Math.sin(time * 0.34 + phase) * 0.012;
    }

    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(time * 0.58 + phase) * 0.026;
      crownRef.current.rotation.y = Math.cos(time * 0.42 + phase) * 0.018;
    }
  });

  return (
    <group ref={palmRef} position={position} scale={scale}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.075, 0.96, 9]} />
        <meshStandardMaterial color={TRUNK} roughness={0.94} />
      </mesh>

      <group ref={crownRef} position={[0, 0.99, 0]}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (index / 7) * Math.PI * 2;

          return (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.2, -0.04, Math.sin(angle) * 0.2]}
              rotation={[-0.46, -angle, Math.sin(angle) * 0.15]}
              castShadow
            >
              <planeGeometry args={[0.22, 0.76]} />
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
  scale = [0.34, 0.28, 0.04],
}: {
  position: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color={GLASS}
        roughness={0.3}
        metalness={0.07}
      />
    </mesh>
  );
}

function MainVilla() {
  return (
    <group>
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 1.75, 1.55]} />
        <meshStandardMaterial color={IVORY} roughness={0.91} />
      </mesh>

      <mesh position={[-1.34, 0.95, -0.05]} castShadow>
        <boxGeometry args={[0.42, 1.83, 1.65]} />
        <meshStandardMaterial color={RED} roughness={0.84} />
      </mesh>

      <mesh position={[1.25, 0.72, -0.12]} castShadow>
        <boxGeometry args={[0.64, 1.35, 1.7]} />
        <meshStandardMaterial color={IVORY_WARM} roughness={0.9} />
      </mesh>

      {[-0.75, -0.15, 0.45].map((x) => (
        <group key={x}>
          <Window position={[x, 0.68, -0.795]} />
          <Window position={[x, 1.21, -0.795]} />
        </group>
      ))}

      <Window
        position={[1.24, 0.75, -0.99]}
        scale={[0.43, 0.62, 0.045]}
      />

      <mesh position={[0.18, 1.83, 0]} castShadow>
        <boxGeometry args={[3.55, 0.12, 1.66]} />
        <meshStandardMaterial color={RED_DARK} roughness={0.84} />
      </mesh>

      <Text
        position={[0.16, 1.99, -0.87]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.16}
        letterSpacing={0.1}
        color={RED_DARK}
        anchorX="center"
        anchorY="middle"
      >
        MAISON ROUGE
      </Text>
    </group>
  );
}

function GardenWing() {
  return (
    <group position={[-1.85, 0, 0.78]}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.92, 1.35]} />
        <meshStandardMaterial color={IVORY_WARM} roughness={0.92} />
      </mesh>

      <Window
        position={[0, 0.5, -0.69]}
        scale={[0.82, 0.44, 0.04]}
      />

      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[1.55, 0.09, 1.45]} />
        <meshStandardMaterial color={RED} roughness={0.85} />
      </mesh>
    </group>
  );
}

function RoofTerrace() {
  return (
    <group position={[0.28, 1.93, 0]}>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[2.75, 0.05, 1.25]} />
        <meshStandardMaterial color={DECK} roughness={0.94} />
      </mesh>

      {[-1.22, 1.22].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.035, 0.44, 1.22]} />
          <meshStandardMaterial color={RED_DARK} roughness={0.82} />
        </mesh>
      ))}

      <mesh position={[0, 0.26, 0.57]}>
        <boxGeometry args={[2.5, 0.035, 0.035]} />
        <meshStandardMaterial color={ART} roughness={0.62} />
      </mesh>

      <mesh position={[0.72, 0.12, 0]}>
        <boxGeometry args={[0.58, 0.12, 0.22]} />
        <meshStandardMaterial color="#5f554b" roughness={0.92} />
      </mesh>

      <mesh position={[-0.52, 0.12, -0.1]}>
        <boxGeometry args={[0.58, 0.12, 0.22]} />
        <meshStandardMaterial color="#5f554b" roughness={0.92} />
      </mesh>
    </group>
  );
}

function LongPool({
  position,
  width,
}: {
  position: [number, number, number];
  width: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[width + 0.32, 0.05, 0.92]} />
        <meshStandardMaterial color={DECK} roughness={0.96} />
      </mesh>

      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[width, 0.025, 0.66]} />
        <meshStandardMaterial
          color={WATER}
          roughness={0.18}
          metalness={0.1}
          transparent
          opacity={0.91}
        />
      </mesh>
    </group>
  );
}

function ArtSculpture() {
  return (
    <group position={[1.75, 0, -1.4]}>
      <mesh position={[0, 0.28, 0]} rotation={[0.2, 0.15, -0.3]} castShadow>
        <boxGeometry args={[0.12, 0.58, 0.12]} />
        <meshStandardMaterial color={ART} roughness={0.75} />
      </mesh>

      <mesh position={[0.12, 0.6, 0]} rotation={[0, 0, 0.55]} castShadow>
        <torusGeometry args={[0.22, 0.055, 10, 24]} />
        <meshStandardMaterial color={RED} roughness={0.72} />
      </mesh>
    </group>
  );
}

export function MaisonRougeExterior({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, -0.08, 0]}>
      <MainVilla />
      <GardenWing />
      <RoofTerrace />

      <LongPool position={[-0.85, 0, -1.78]} width={2.4} />
      <LongPool position={[1.45, 0, 1.3]} width={2.15} />

      <mesh position={[0, 0.035, -1.22]} receiveShadow>
        <boxGeometry args={[4.95, 0.07, 0.6]} />
        <meshStandardMaterial color="#a99e90" roughness={0.97} />
      </mesh>

      <mesh position={[0, 0.03, 1.68]} receiveShadow>
        <boxGeometry args={[4.7, 0.06, 0.62]} />
        <meshStandardMaterial color={GREEN_DARK} roughness={1} />
      </mesh>

      <Palm position={[-2.35, 0.05, -1.25]} scale={0.76} />
      <Palm position={[2.15, 0.05, -1.15]} scale={0.72} />
      <Palm position={[-2.28, 0.05, 1.25]} scale={0.7} />
      <Palm position={[2.2, 0.05, 1.15]} scale={0.68} />

      {[-1.65, -1.0, 0.8, 1.45].map((x, index) => (
        <mesh
          key={x}
          position={[x, 0.17, index % 2 === 0 ? 1.08 : -1.05]}
        >
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={GREEN} roughness={0.96} />
        </mesh>
      ))}

      <ArtSculpture />
    </group>
  );
}
