"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { PlayerAvatar } from "./PlayerAvatar";
import type { Appearance } from "./appearance";

function Model({ appearance, turning }: { appearance: Appearance; turning: boolean }) {
  const group = useRef<Group>(null);
  const speed = useRef(0);
  useFrame((_, delta) => {
    if (group.current && turning) group.current.rotation.y += Math.min(delta, 0.05) * 0.45;
  });
  return <group ref={group}><PlayerAvatar appearance={appearance} speed={speed} /></group>;
}

export function CharacterPreview({ appearance, turning }: { appearance: Appearance; turning: boolean }) {
  return <Canvas aria-label="Aperçu 3D du personnage" camera={{ position: [0, 1.65, 5.3], fov: 32 }} dpr={[1, 1.5]}>
    <color attach="background" args={["#d8d5cb"]} />
    <ambientLight intensity={2.2} />
    <directionalLight position={[3, 5, 5]} intensity={2.5} />
    <Model appearance={appearance} turning={turning} />
  </Canvas>;
}
