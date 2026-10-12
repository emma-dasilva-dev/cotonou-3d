"use client";

import { useMemo } from "react";
import type { ColorRepresentation } from "three";

export type TimeOfDay = "morning" | "afternoon" | "sunset" | "night";
export const TIMES: { id: TimeOfDay; label: string }[] = [
  { id: "morning", label: "Matin" },
  { id: "afternoon", label: "Après-midi" },
  { id: "sunset", label: "Coucher du soleil" },
  { id: "night", label: "Nuit" },
];
const PALETTE: Record<TimeOfDay, {
  sky: ColorRepresentation; fog: ColorRepresentation; ambient: number;
  sun: number; sunColor: ColorRepresentation; ground: ColorRepresentation;
}> = {
  morning: { sky: "#bdd8d6", fog: "#bdd8d6", ambient: 1.45, sun: 1.85, sunColor: "#fff0d5", ground: "#b4aa93" },
  afternoon: { sky: "#b5d3df", fog: "#b5d3df", ambient: 1.55, sun: 2.2, sunColor: "#fff9e9", ground: "#b7ad96" },
  sunset: { sky: "#d99a88", fog: "#d99a88", ambient: 0.95, sun: 1.35, sunColor: "#ffae72", ground: "#a99486" },
  night: { sky: "#16283b", fog: "#16283b", ambient: 0.48, sun: 0.22, sunColor: "#91add1", ground: "#676a70" },
};

export function StreetAtmosphere({ time }: { time: TimeOfDay }) {
  const mood = PALETTE[time];
  const lamps = useMemo(() => [
    [-2.8, -14], [2.8, -9], [-2.8, 3], [2.8, 13],
    [-14, -2.7], [-6, 2.7], [8, -2.7], [15, 2.7],
  ] as const, []);
  const dark = time === "night" || time === "sunset";

  return <>
    <color attach="background" args={[mood.sky]} />
    <fog attach="fog" args={[mood.fog, 20, 59]} />
    <ambientLight intensity={mood.ambient} />
    <directionalLight position={time === "sunset" ? [-10, 6, -5] : [5, 13, 7]}
      intensity={mood.sun} color={mood.sunColor} castShadow shadow-mapSize={[1024, 1024]} />
    {lamps.map(([x, z], index) => <group key={index} position={[x, 0, z]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 4.3, 7]} />
        <meshStandardMaterial color="#444b48" roughness={0.84} />
      </mesh>
      <mesh position={[0.35, 4.22, 0]}>
        <boxGeometry args={[0.75, 0.07, 0.09]} />
        <meshStandardMaterial color="#444b48" />
      </mesh>
      <mesh position={[0.72, 4.15, 0]}>
        <boxGeometry args={[0.4, 0.13, 0.32]} />
        <meshStandardMaterial color={dark ? "#ffe1a3" : "#b7bcb2"}
          emissive={dark ? "#ffbb59" : "#000000"} emissiveIntensity={dark ? 2 : 0} />
      </mesh>
      {dark && index % 2 === 0 && <pointLight position={[0.72, 3.95, 0]}
        color="#ffc981" intensity={time === "night" ? 10 : 4} distance={8} decay={2} />}
    </group>)}
    {/* A distant solar disc gives the district an identifiable skyline. */}
    {time !== "night" && <mesh position={time === "sunset" ? [-16, 9, -27] : [14, 24, -28]}>
      <sphereGeometry args={[time === "sunset" ? 2.6 : 1.5, 24, 16]} />
      <meshBasicMaterial color={time === "sunset" ? "#ffe3a1" : "#fff6d9"} fog={false} />
    </mesh>}
    {time === "night" && <mesh position={[-14, 21, -29]}>
      <sphereGeometry args={[1.2, 20, 16]} />
      <meshBasicMaterial color="#edf0d6" fog={false} />
    </mesh>}
  </>;
}
