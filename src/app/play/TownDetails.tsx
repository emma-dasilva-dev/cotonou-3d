"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { PlayerAvatar } from "./PlayerAvatar";
import type { Appearance } from "./appearance";
import type { TimeOfDay } from "./StreetAtmosphere";

const RESIDENTS: { x:number; z:number; phase:number; move:boolean; appearance:Appearance }[] = [
  {x:3.2,z:9,phase:0,move:true,appearance:{body:"feminine",skin:1,hair:0,outfit:2,hairstyle:"afro"}},
  {x:-2.9,z:-10.2,phase:2,move:true,appearance:{body:"masculine",skin:3,hair:1,outfit:1,hairstyle:"short"}},
  {x:8.5,z:9,phase:4,move:false,appearance:{body:"feminine",skin:0,hair:0,outfit:4,hairstyle:"bun"}},
  {x:-8,z:11,phase:6,move:false,appearance:{body:"masculine",skin:2,hair:0,outfit:3,hairstyle:"short"}},
];
function Pedestrian({ resident }: {resident:(typeof RESIDENTS)[number]}) {
  const group=useRef<Group>(null);
  const velocity=useRef(0);
  useFrame(({clock})=>{
    if(!group.current || !resident.move)return;
    const t=clock.elapsedTime*0.34+resident.phase;
    group.current.position.x=resident.x+Math.sin(t)*0.85;
    group.current.position.z=resident.z+Math.cos(t)*0.5;
    group.current.rotation.y=Math.cos(t)>=0?Math.PI/2:-Math.PI/2;
    velocity.current=1;
  });
  return <group ref={group} position={[resident.x,0,resident.z]}><PlayerAvatar appearance={resident.appearance} speed={velocity}/></group>;
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
