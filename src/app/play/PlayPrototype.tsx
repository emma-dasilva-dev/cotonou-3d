"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3, MathUtils } from "three";
import type { Group } from "three";
import styles from "./PlayPrototype.module.css";

type Key = "forward" | "backward" | "left" | "right";
type Controls = Record<Key, boolean>;
const EMPTY: Controls = { forward: false, backward: false, left: false, right: false };
const KEY_MAP: Record<string, Key> = {
  KeyW: "forward", ArrowUp: "forward",
  KeyS: "backward", ArrowDown: "backward",
  KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right",
};
const BUILDINGS = [
  { x: -5, z: -4, width: 4, depth: 3.2, height: 3.8, color: "#c8ad88" },
  { x: 5, z: -4, width: 3.6, depth: 3.8, height: 4.7, color: "#b5b1a5" },
  { x: -5.5, z: 4.5, width: 3.8, depth: 3, height: 2.7, color: "#b6a17c" },
  { x: 5, z: 5, width: 4, depth: 3, height: 3.5, color: "#acb5a7" },
];
const START = new Vector3(0, 0, 0);
function canWalk(x: number, z: number) {
  if (Math.abs(x) > 10.8 || Math.abs(z) > 10.8) return false;
  return !BUILDINGS.some(b =>
    Math.abs(x - b.x) < b.width / 2 + 0.34 &&
    Math.abs(z - b.z) < b.depth / 2 + 0.34
  );
}

function Character({ keys }: { keys: React.RefObject<Controls> }) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const position = useRef(START.clone());
  const direction = useRef(new Vector3());
  const desiredCamera = useRef(new Vector3());
  useFrame((_, dt) => {
    if (!group.current) return;
    const input = keys.current;
    const horizontal = Number(input.right) - Number(input.left);
    const vertical = Number(input.backward) - Number(input.forward);
    direction.current.set(horizontal, 0, vertical);
    const moving = direction.current.lengthSq() > 0;
    if (moving) {
      direction.current.normalize();
      const step = Math.min(dt, 0.05) * 3.6;
      const nextX = position.current.x + direction.current.x * step;
      const nextZ = position.current.z + direction.current.z * step;
      // Resolve axes separately to slide along walls and corners.
      if (canWalk(nextX, position.current.z)) position.current.x = nextX;
      if (canWalk(position.current.x, nextZ)) position.current.z = nextZ;
      const face = Math.atan2(direction.current.x, direction.current.z);
      const turn = Math.atan2(Math.sin(face - group.current.rotation.y), Math.cos(face - group.current.rotation.y));
      group.current.rotation.y += turn * Math.min(1, dt * 12);
    }
    group.current.position.copy(position.current);
    // Fixed-angle follow camera; the character stays fully visible.
    desiredCamera.current.set(position.current.x + 6, 5.5, position.current.z + 8);
    camera.position.lerp(desiredCamera.current, 1 - Math.exp(-5 * dt));
    camera.lookAt(position.current.x, 1.1, position.current.z);
  });
  return (
    <group ref={group}>
      <mesh position={[0, 1.02, 0]} castShadow>
        <capsuleGeometry args={[0.32, 1.08, 6, 12]} />
        <meshStandardMaterial color="#263c4c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.92, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 10]} />
        <meshStandardMaterial color="#9d6e50" />
      </mesh>
      <mesh position={[0, 1.25, 0.30]}>
        <boxGeometry args={[0.22, 0.18, 0.06]} />
        <meshStandardMaterial color="#e6e1d5" />
      </mesh>
    </group>
  );
}

function Neighborhood({ keys }: { keys: React.RefObject<Controls> }) {
  return <>
    <color attach="background" args={["#c9d9d5"]} />
    <fog attach="fog" args={["#c9d9d5", 17, 42]} />
    <ambientLight intensity={1.5} />
    <directionalLight position={[5, 13, 7]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial color="#b7ad96" />
    </mesh>
    <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.5, 23]} />
      <meshStandardMaterial color="#636766" />
    </mesh>
    <mesh position={[0, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[23, 3.2]} />
      <meshStandardMaterial color="#636766" />
    </mesh>
    {BUILDINGS.map((b,i) => (
      <group key={i} position={[b.x, 0, b.z]}>
        <mesh position={[0, b.height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[b.width,b.height,b.depth]} />
          <meshStandardMaterial color={b.color} roughness={0.92} />
        </mesh>
        <mesh position={[0,b.height + 0.11,0]} castShadow>
          <boxGeometry args={[b.width + 0.22,0.22,b.depth + 0.22]} />
          <meshStandardMaterial color="#625f56" />
        </mesh>
      </group>
    ))}
    {[-9,9].map(x => [-9,9].map(z => (
      <group key={`${x}-${z}`} position={[x,0,z]}>
        <mesh position={[0,1.2,0]} castShadow>
          <cylinderGeometry args={[0.12,0.18,2.4,7]} />
          <meshStandardMaterial color="#79634a" />
        </mesh>
        <mesh position={[0,2.6,0]} castShadow>
          <sphereGeometry args={[1,9,8]} />
          <meshStandardMaterial color="#586f53" />
        </mesh>
      </group>
    )))}
    <Character keys={keys} />
  </>;
}

export default function PlayPrototype() {
  const keys = useRef<Controls>({ ...EMPTY });
  const [isPaused, setPaused] = useState(false);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (key) { event.preventDefault(); if (!event.repeat) keys.current[key] = true; }
    };
    const up = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (key) { event.preventDefault(); keys.current[key] = false; }
    };
    const reset = () => { keys.current = { ...EMPTY }; };
    window.addEventListener("keydown",down);
    window.addEventListener("keyup",up);
    window.addEventListener("blur",reset);
    return () => { window.removeEventListener("keydown",down); window.removeEventListener("keyup",up); window.removeEventListener("blur",reset); };
  }, []);
  function move(key: Key, pressed: boolean) {
    if (!isPaused) keys.current[key] = pressed;
  }
  function togglePause() {
    keys.current = { ...EMPTY };
    setPaused(p => !p);
  }
  return (
    <main className={styles.root}>
      <Canvas shadows dpr={[1,1.75]} camera={{ position:[6,5.5,8], fov:55, near:0.1, far:90 }} frameloop={isPaused ? "never" : "always"}>
        <Neighborhood keys={keys} />
      </Canvas>
      <header className={styles.header}>
        <div><strong>COTONOU / 3D</strong><span>SIMULATEUR · PROTOTYPE 01</span></div>
        <a href="/">Retour à l’exposition ↗</a>
      </header>
      <div className={styles.help}><strong>Explorer le quartier</strong><span>W A S D / flèches pour se déplacer</span><span>Les bâtiments bloquent le passage</span></div>
      <button className={styles.pause} type="button" onClick={togglePause} aria-pressed={isPaused}>{isPaused ? "Reprendre" : "Pause"}</button>
      <div className={styles.pad} aria-label="Commandes tactiles">
        {(["forward","left","backward","right"] as Key[]).map(key => (
          <button type="button" key={key} className={styles[key]} aria-label={key} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);move(key,true);}} onPointerUp={()=>move(key,false)} onPointerCancel={()=>move(key,false)} onLostPointerCapture={()=>move(key,false)}>
            {({forward:"↑",backward:"↓",left:"←",right:"→"} as Record<Key,string>)[key]}
          </button>
        ))}
      </div>
      {isPaused && <div className={styles.paused}>EN PAUSE</div>}
    </main>
  );
}
