"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

type Point2 = [number, number];

const ROAD = "#6f6c67";
const ROAD_EDGE = "#5e5b57";
const WALKWAY = "#b8afa2";
const LINE = "#d7d0c5";
const TRUNK = "#735f4d";
const SKIN = "#8b624a";
const SHIRT_COLORS = ["#464f5d", "#8d5146", "#66705e", "#b39b78", "#353534"];
const CAR_COLORS = ["#3e4447", "#8f4c41", "#d8d4cb", "#626e70", "#b39668", "#242424"];

const MAIN_LOOP: Point2[] = [
  [-13.2, -10.3],
  [13.2, -10.3],
  [13.2, 0.35],
  [-13.2, 0.35],
];

const WATERFRONT_LOOP: Point2[] = [
  [-13.2, 0.35],
  [13.2, 0.35],
  [13.2, 8.0],
  [-13.2, 8.0],
];

function RoadStrip({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number];
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial color={ROAD} roughness={0.98} />
      </mesh>

      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[Math.max(0.1, size[0] - 0.18), Math.max(0.1, size[1] - 0.18)]} />
        <meshStandardMaterial color={ROAD_EDGE} roughness={0.98} />
      </mesh>
    </group>
  );
}

function SidewalkStrip({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size[0], size[1]]} />
      <meshStandardMaterial color={WALKWAY} roughness={0.98} />
    </mesh>
  );
}

function DashedLane({
  z,
  xStart = -13.2,
  xEnd = 13.2,
}: {
  z: number;
  xStart?: number;
  xEnd?: number;
}) {
  const dashes = [];
  for (let x = xStart + 0.75; x < xEnd; x += 1.35) {
    dashes.push(
      <mesh key={x} position={[x, 0.035, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 0.035]} />
        <meshBasicMaterial color={LINE} />
      </mesh>,
    );
  }

  return <>{dashes}</>;
}

function VerticalDashes({ x }: { x: number }) {
  const dashes = [];
  for (let z = -9.7; z < 7.5; z += 1.35) {
    dashes.push(
      <mesh
        key={z}
        position={[x, 0.035, z]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <planeGeometry args={[0.55, 0.035]} />
        <meshBasicMaterial color={LINE} />
      </mesh>,
    );
  }

  return <>{dashes}</>;
}

export function CityRoads() {
  return (
    <group>
      <RoadStrip position={[0, 0.018, -10.3]} size={[28.5, 1.1]} />
      <SidewalkStrip position={[0, 0.028, -9.48]} size={[28.5, 0.34]} />
      <SidewalkStrip position={[0, 0.028, -11.12]} size={[28.5, 0.34]} />
      <DashedLane z={-10.3} />

      <RoadStrip position={[0, 0.018, 0.35]} size={[28.5, 1.15]} />
      <SidewalkStrip position={[0, 0.028, -0.45]} size={[28.5, 0.34]} />
      <SidewalkStrip position={[0, 0.028, 1.15]} size={[28.5, 0.34]} />
      <DashedLane z={0.35} />

      <RoadStrip position={[0, 0.018, 8.0]} size={[27.0, 0.92]} />
      <SidewalkStrip position={[0, 0.028, 7.35]} size={[27.0, 0.3]} />
      <DashedLane z={8.0} xStart={-12.5} xEnd={12.5} />

      {[-13.2, -4.5, 4.5, 13.2].map((x) => (
        <group key={x}>
          <RoadStrip position={[x, 0.019, -1.15]} size={[1.0, 19.3]} />
          <SidewalkStrip position={[x - 0.68, 0.028, -1.15]} size={[0.3, 19.3]} />
          <SidewalkStrip position={[x + 0.68, 0.028, -1.15]} size={[0.3, 19.3]} />
          <VerticalDashes x={x} />
        </group>
      ))}

    </group>
  );
}

function getPolylinePosition(path: Point2[], progress: number) {
  const segments = path.map((point, index) => {
    const next = path[(index + 1) % path.length];
    const length = Math.hypot(next[0] - point[0], next[1] - point[1]);
    return { point, next, length };
  });
  const total = segments.reduce((sum, segment) => sum + segment.length, 0);
  let distance = ((progress % 1) + 1) % 1 * total;

  for (const segment of segments) {
    if (distance <= segment.length) {
      const t = segment.length === 0 ? 0 : distance / segment.length;
      return {
        x: segment.point[0] + (segment.next[0] - segment.point[0]) * t,
        z: segment.point[1] + (segment.next[1] - segment.point[1]) * t,
        rotationY: Math.atan2(
          segment.next[0] - segment.point[0],
          segment.next[1] - segment.point[1],
        ),
      };
    }
    distance -= segment.length;
  }

  return { x: path[0][0], z: path[0][1], rotationY: 0 };
}

function MovingCar({
  path,
  speed,
  offset,
  color,
  scale = 1,
}: {
  path: Point2[];
  speed: number;
  offset: number;
  color: string;
  scale?: number;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pose = getPolylinePosition(path, offset + clock.elapsedTime * speed);
    ref.current.position.x = pose.x;
    ref.current.position.z = pose.z;
    ref.current.rotation.y = pose.rotationY;
  });

  return (
    <group ref={ref} position={[0, 0.09, 0]} scale={scale}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.72]} />
        <meshStandardMaterial color={color} roughness={0.62} metalness={0.08} />
      </mesh>

      <mesh position={[0, 0.24, -0.03]} castShadow>
        <boxGeometry args={[0.32, 0.16, 0.34]} />
        <meshStandardMaterial color="#79898c" roughness={0.38} metalness={0.08} />
      </mesh>

      {[
        [-0.22, 0.02, -0.23],
        [0.22, 0.02, -0.23],
        [-0.22, 0.02, 0.23],
        [0.22, 0.02, 0.23],
      ].map(([x, y, z], index) => (
        <mesh
          key={index}
          position={[x, y, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.055, 10]} />
          <meshStandardMaterial color="#242423" roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function Walker({
  start,
  end,
  speed,
  offset,
  shirt,
  scale = 1,
}: {
  start: Point2;
  end: Point2;
  speed: number;
  offset: number;
  shirt: string;
  scale?: number;
}) {
  const ref = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);

  const angle = useMemo(
    () => Math.atan2(end[0] - start[0], end[1] - start[1]),
    [start, end],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const raw = offset + clock.elapsedTime * speed;
    const cycle = raw % 2;
    const forward = cycle <= 1;
    const t = forward ? cycle : 2 - cycle;
    const x = start[0] + (end[0] - start[0]) * t;
    const z = start[1] + (end[1] - start[1]) * t;
    const gait = Math.sin(clock.elapsedTime * 8 + offset * 12) * 0.45;

    ref.current.position.x = x;
    ref.current.position.z = z;
    ref.current.rotation.y = forward ? angle : angle + Math.PI;

    if (leftArm.current) leftArm.current.rotation.x = gait;
    if (rightArm.current) rightArm.current.rotation.x = -gait;
    if (leftLeg.current) leftLeg.current.rotation.x = -gait * 0.8;
    if (rightLeg.current) rightLeg.current.rotation.x = gait * 0.8;
  });

  return (
    <group ref={ref} position={[start[0], 0.04, start[1]]} scale={scale}>
      <mesh position={[0, 0.54, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.28, 4, 8]} />
        <meshStandardMaterial color={shirt} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.94} />
      </mesh>

      <group ref={leftArm} position={[-0.12, 0.58, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.035, 0.21, 3, 6]} />
          <meshStandardMaterial color={SKIN} roughness={0.94} />
        </mesh>
      </group>

      <group ref={rightArm} position={[0.12, 0.58, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.035, 0.21, 3, 6]} />
          <meshStandardMaterial color={SKIN} roughness={0.94} />
        </mesh>
      </group>

      <group ref={leftLeg} position={[-0.055, 0.34, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.22, 3, 6]} />
          <meshStandardMaterial color="#343536" roughness={0.94} />
        </mesh>
      </group>

      <group ref={rightLeg} position={[0.055, 0.34, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.22, 3, 6]} />
          <meshStandardMaterial color="#343536" roughness={0.94} />
        </mesh>
      </group>
    </group>
  );
}

export function CityLife({ lowDetail = false }: { lowDetail?: boolean }) {
  const walkers = [
    { start: [-12.0, -9.48] as Point2, end: [-6.0, -9.48] as Point2, speed: 0.052, offset: 0.15 },
    { start: [-3.2, -9.48] as Point2, end: [3.2, -9.48] as Point2, speed: 0.048, offset: 0.72 },
    { start: [5.8, -9.48] as Point2, end: [12.0, -9.48] as Point2, speed: 0.05, offset: 1.18 },
    { start: [-12.0, -0.45] as Point2, end: [-6.0, -0.45] as Point2, speed: 0.049, offset: 0.42 },
    { start: [-3.0, -0.45] as Point2, end: [3.0, -0.45] as Point2, speed: 0.046, offset: 1.32 },
    { start: [5.8, -0.45] as Point2, end: [12.0, -0.45] as Point2, speed: 0.052, offset: 0.88 },
    { start: [-12.0, 1.15] as Point2, end: [-6.0, 1.15] as Point2, speed: 0.047, offset: 0.31 },
    { start: [-3.0, 1.15] as Point2, end: [3.0, 1.15] as Point2, speed: 0.045, offset: 1.11 },
    { start: [5.8, 1.15] as Point2, end: [12.0, 1.15] as Point2, speed: 0.049, offset: 0.56 },
  ];

  const visibleCars = lowDetail ? CAR_COLORS.slice(0, 3) : CAR_COLORS;
  const visibleWalkers = lowDetail ? walkers.slice(0, 5) : walkers;

  return (
    <group>
      {visibleCars.map((color, index) => (
        <MovingCar
          key={`main-${index}`}
          path={index < 2 ? MAIN_LOOP : WATERFRONT_LOOP}
          speed={index < 2 ? 0.018 + index * 0.002 : 0.015}
          offset={index / Math.max(visibleCars.length, 1)}
          color={color}
          scale={index % 2 === 0 ? 0.95 : 1.05}
        />
      ))}

      {visibleWalkers.map((walker, index) => (
        <Walker
          key={index}
          {...walker}
          shirt={SHIRT_COLORS[index % SHIRT_COLORS.length]}
          scale={0.82 + (index % 3) * 0.05}
        />
      ))}
    </group>
  );
}
