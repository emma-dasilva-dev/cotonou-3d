"use client";

import { Html, Text } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, Shape } from "three";

type Position3 = [number, number, number];

const BRONZE = "#80604c";
const BRONZE_DARK = "#624839";
const STONE = "#a79d8e";
const STONE_DARK = "#817a70";
const RED = "#9c4039";
const CHARCOAL = "#353432";
const GREEN = "#65715f";

export const LANDMARK_CLEARINGS: Array<{
  position: Position3;
  radius: number;
}> = [
  { position: [-7.0, 0, -2.1], radius: 1.8 },
  { position: [0.0, 0, -2.0], radius: 1.9 },
  { position: [7.0, 0, -2.1], radius: 1.8 },
];

function LandmarkLabel({
  position,
  children,
}: {
  position: Position3;
  children: string;
}) {
  return (
    <Html
      center
      position={position}
      distanceFactor={10}
      zIndexRange={[8, 0]}
      style={{ pointerEvents: "none" }}
    >
      <span className="landmark-label">{children}</span>
    </Html>
  );
}

function AmazoneMonument({ position }: { position: Position3 }) {
  return (
    <group position={position} rotation={[0, 0.18, 0]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.82, 0.95, 0.24, 24]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.94} />
      </mesh>

      <mesh position={[0, 0.34, 0]} receiveShadow>
        <cylinderGeometry args={[0.58, 0.72, 0.2, 24]} />
        <meshStandardMaterial color={STONE} roughness={0.92} />
      </mesh>

      <mesh position={[0, 0.61, 0]} castShadow>
        <coneGeometry args={[0.36, 0.48, 9]} />
        <meshStandardMaterial color={BRONZE_DARK} roughness={0.74} metalness={0.08} />
      </mesh>

      <group position={[0, 0.72, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.88, 6, 10]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[-0.13, 0.38, 0]} rotation={[0, 0, -0.18]} castShadow>
          <capsuleGeometry args={[0.09, 0.66, 5, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[0.18, 0.32, 0.02]} rotation={[0, 0, 0.22]} castShadow>
          <capsuleGeometry args={[0.09, 0.62, 5, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[-0.26, 1.03, 0]} rotation={[0, 0, -0.42]} castShadow>
          <capsuleGeometry args={[0.065, 0.62, 4, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[0.34, 1.14, 0]} rotation={[0, 0, 0.68]} castShadow>
          <capsuleGeometry args={[0.065, 0.72, 4, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[0.63, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
          <meshStandardMaterial color={BRONZE_DARK} roughness={0.6} metalness={0.16} />
        </mesh>

        <mesh
          position={[-0.55, 0.98, 0]}
          rotation={[0, 0, -0.6]}
          castShadow
        >
          <boxGeometry args={[0.52, 0.07, 0.12]} />
          <meshStandardMaterial color={BRONZE_DARK} roughness={0.62} metalness={0.15} />
        </mesh>
      </group>

      <LandmarkLabel position={[0, 3.05, 0]}>
        Monument de l’Amazone
      </LandmarkLabel>
    </group>
  );
}

function EtoileRouge({ position }: { position: Position3 }) {
  const star = useMemo(() => {
    const shape = new Shape();
    const points = 10;

    for (let index = 0; index < points; index += 1) {
      const radius = index % 2 === 0 ? 1.0 : 0.45;
      const angle = Math.PI / 2 + (index * Math.PI) / 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={position}>
      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.35, 40]} />
        <meshStandardMaterial color={STONE} roughness={0.98} />
      </mesh>

      <mesh
        position={[0, 0.09, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <extrudeGeometry args={[star, { depth: 0.08, bevelEnabled: false }]} />
        <meshStandardMaterial color={RED} roughness={0.88} />
      </mesh>

      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.29, 1.78, 8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>

      <group position={[0, 1.91, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.48, 0]} castShadow>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.9} />
        </mesh>
        <mesh position={[-0.14, 0.2, 0]} rotation={[0, 0, -0.7]} castShadow>
          <capsuleGeometry args={[0.03, 0.28, 3, 6]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.9} />
        </mesh>
        <mesh position={[0.13, 0.34, 0]} rotation={[0, 0, 0.2]} castShadow>
          <capsuleGeometry args={[0.03, 0.42, 3, 6]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.9} />
        </mesh>
      </group>

      <LandmarkLabel position={[0, 2.72, 0]}>
        Étoile Rouge
      </LandmarkLabel>
    </group>
  );
}

function BioGueraMonument({ position }: { position: Position3 }) {
  return (
    <group position={position} rotation={[0, -0.22, 0]}>
      <mesh position={[0, 0.13, 0]} receiveShadow>
        <boxGeometry args={[1.35, 0.26, 0.9]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.94} />
      </mesh>

      <mesh position={[0, 0.34, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.18, 0.68]} />
        <meshStandardMaterial color={STONE} roughness={0.93} />
      </mesh>

      <group position={[0, 0.55, 0]}>
        <mesh position={[0, 0.67, 0]} rotation={[0, 0, -0.18]} castShadow>
          <capsuleGeometry args={[0.22, 0.92, 6, 10]} />
          <meshStandardMaterial color={BRONZE} roughness={0.66} metalness={0.13} />
        </mesh>

        <mesh position={[0.34, 1.08, -0.02]} rotation={[0, 0, -0.18]} castShadow>
          <capsuleGeometry args={[0.15, 0.35, 5, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.66} metalness={0.13} />
        </mesh>

        <mesh position={[-0.26, 0.16, 0.02]} rotation={[0, 0, 0.42]} castShadow>
          <capsuleGeometry args={[0.075, 0.6, 4, 8]} />
          <meshStandardMaterial color={BRONZE_DARK} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[0.37, 0.2, 0]} rotation={[0, 0, -0.68]} castShadow>
          <capsuleGeometry args={[0.075, 0.62, 4, 8]} />
          <meshStandardMaterial color={BRONZE_DARK} roughness={0.68} metalness={0.12} />
        </mesh>

        <mesh position={[-0.25, 1.06, 0]} rotation={[0, 0, 0.56]} castShadow>
          <capsuleGeometry args={[0.065, 0.68, 4, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.66} metalness={0.13} />
        </mesh>

        <mesh position={[0.15, 1.25, 0]} rotation={[0, 0, -0.08]} castShadow>
          <capsuleGeometry args={[0.13, 0.4, 5, 8]} />
          <meshStandardMaterial color={BRONZE} roughness={0.66} metalness={0.13} />
        </mesh>

        <mesh position={[0.14, 1.58, 0]} castShadow>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color={BRONZE} roughness={0.66} metalness={0.13} />
        </mesh>

        <mesh position={[0.55, 1.45, 0]} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
          <meshStandardMaterial color={BRONZE_DARK} roughness={0.58} metalness={0.15} />
        </mesh>
      </group>

      <LandmarkLabel position={[0, 2.75, 0]}>
        Monument Bio Guera
      </LandmarkLabel>
    </group>
  );
}

function LandmarkGarden({
  position,
}: {
  position: Position3;
}) {
  return (
    <group position={position}>
      {[
        [-1.15, 0, -0.85],
        [1.12, 0, -0.8],
        [-1.18, 0, 0.78],
        [1.14, 0, 0.8],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y + 0.14, z]}>
          <sphereGeometry args={[0.15, 10, 8]} />
          <meshStandardMaterial color={GREEN} roughness={0.98} />
        </mesh>
      ))}
    </group>
  );
}

export function CotonouLandmarks() {
  return (
    <group>
      <AmazoneMonument position={[-7.0, 0, -2.1]} />
      <LandmarkGarden position={[-7.0, 0, -2.1]} />

      <EtoileRouge position={[0.0, 0, -2.0]} />

      <BioGueraMonument position={[7.0, 0, -2.1]} />
      <LandmarkGarden position={[7.0, 0, -2.1]} />
    </group>
  );
}
