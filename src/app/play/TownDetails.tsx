"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { PlayerAvatar } from "./PlayerAvatar";
import type { Appearance } from "./appearance";
import type { TimeOfDay } from "./StreetAtmosphere";

type Stop = { x: number; z: number; pause?: number };
type Resident = { route: Stop[]; pace: number; appearance: Appearance };
const RESIDENTS: Resident[] = [
  { route: [{x:3.2,z:9,pause:1.2},{x:3.2,z:12.1,pause:2.5},{x:5.7,z:12.1,pause:1.6},{x:5.7,z:9,pause:2}], pace:0.9, appearance:{body:"feminine",skin:1,hair:0,outfit:2,hairstyle:"afro"} },
  { route: [{x:-2.9,z:-10.2,pause:1},{x:-2.9,z:-13,pause:2.4},{x:-5.4,z:-13,pause:2},{x:-5.4,z:-10.2,pause:1.5}], pace:1.15, appearance:{body:"masculine",skin:3,hair:1,outfit:1,hairstyle:"short"} },
  { route: [{x:8.5,z:9,pause:3},{x:8.5,z:12.1,pause:1},{x:10.8,z:12.1,pause:2},{x:10.8,z:9,pause:1.5}], pace:0.76, appearance:{body:"feminine",skin:0,hair:0,outfit:4,hairstyle:"bun"} },
  { route: [{x:-8,z:11,pause:2},{x:-8,z:13,pause:2.4},{x:-10.7,z:13,pause:3},{x:-10.7,z:11,pause:1}], pace:1.05, appearance:{body:"masculine",skin:2,hair:0,outfit:3,hairstyle:"short"} },
];
const TURN_RATE = 7;
function Pedestrian({ resident }: {resident:Resident}) {
  const group = useRef<Group>(null);
  const velocity = useRef(0);
  const destination = useRef(1);
  const pause = useRef(resident.route[0].pause ?? 0);
  const target = resident.route;
  useFrame((_, frameDelta) => {
    const actor = group.current;
    if (!actor) return;
    const dt = Math.min(frameDelta, 0.05);
    if (pause.current > 0) {
      pause.current = Math.max(0, pause.current - dt);
      velocity.current = 0;
      return;
    }
    const point = target[destination.current];
    const dx = point.x - actor.position.x;
    const dz = point.z - actor.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.12) {
      actor.position.set(point.x, 0, point.z);
      destination.current = (destination.current + 1) % target.length;
      pause.current = point.pause ?? 1;
      velocity.current = 0;
      return;
    }
    const angle = Math.atan2(dx, dz);
    const difference = Math.atan2(Math.sin(angle - actor.rotation.y), Math.cos(angle - actor.rotation.y));
    actor.rotation.y += difference * Math.min(1, TURN_RATE * dt);
    const alignment = Math.max(0, 1 - Math.abs(difference) / Math.PI);
    const pace = resident.pace * (0.35 + alignment * 0.65);
    const distanceThisFrame = Math.min(distance, pace * dt);
    actor.position.x += (dx / distance) * distanceThisFrame;
    actor.position.z += (dz / distance) * distanceThisFrame;
    velocity.current = pace;
  });
  return <group ref={group} position={[target[0].x,0,target[0].z]}>
    <PlayerAvatar appearance={resident.appearance} speed={velocity}/>
  </group>;
}
export function TownDetails({time}:{time:TimeOfDay}) {
  return <>
    {RESIDENTS.slice(0,time==="night"?2:4).map((resident,i)=><Pedestrian key={i} resident={resident}/>)}
    {[-11,-4,4,11].map((x,i)=><group key={x} position={[x,0,14.6]}>
      <mesh position={[0,0.62,0]} castShadow><boxGeometry args={[2.4,1.1,1.15]}/><meshStandardMaterial color={["#a97850","#71918a","#c28c72","#bba57e"][i]}/></mesh>
      <mesh position={[0,1.3,0]} castShadow><boxGeometry args={[2.7,0.17,1.6]}/><meshStandardMaterial color={i%2?"#356d6c":"#a65d48"}/></mesh>
      {[-0.68,0.68].map(side=><mesh key={side} position={[side,0.98,0.61]}><boxGeometry args={[0.42,0.32,0.08]}/><meshStandardMaterial color="#344d50"/></mesh>)}
    </group>)}
    {[-14,-8,8,14].map((x,i)=><group key={x} position={[x,0,-14]}>
      <mesh position={[0,0.42,0]} castShadow><boxGeometry args={[1.7,0.76,1.1]}/><meshStandardMaterial color="#866f57"/></mesh>
      <mesh position={[0,1.02,0]} castShadow><coneGeometry args={[1.4,0.64,4]}/><meshStandardMaterial color={i%2?"#c9a057":"#b65f4b"}/></mesh>
      {[0,1,2].map(n=><mesh key={n} position={[-0.5+n*0.48,0.88,0.2]}><sphereGeometry args={[0.2,8,6]}/><meshStandardMaterial color={n%2?"#74a05c":"#d99e54"}/></mesh>)}
    </group>)}
    {[[-14,3],[14,-3],[-14,12],[14,12]].map(([x,z],i)=><group key={i} position={[x,0,z]}>
      <mesh position={[0,0.45,0]}><cylinderGeometry args={[0.55,0.55,0.3,10]}/><meshStandardMaterial color="#a48c6d"/></mesh>
      <mesh position={[0,1.02,0]} castShadow><sphereGeometry args={[0.78,9,7]}/><meshStandardMaterial color="#668559"/></mesh>
    </group>)}
  </>;
}
