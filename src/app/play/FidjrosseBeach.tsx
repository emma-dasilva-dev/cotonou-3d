"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import type { TimeOfDay } from "./StreetAtmosphere";
import { PlayerAvatar } from "./PlayerAvatar";
import type { Appearance } from "./appearance";

function Atlantic() {
  const foam = useRef<Group>(null);
  const water = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (water.current) water.current.position.y = -0.12 + Math.sin(clock.elapsedTime * 1.15) * 0.055;
    if (foam.current) foam.current.position.z = Math.sin(clock.elapsedTime * 0.7) * 0.45;
  });
  return <group>
    <mesh ref={water} position={[0, -0.12, -23]} receiveShadow>
      <boxGeometry args={[60, 0.18, 37]} />
      <meshStandardMaterial color="#317d91" roughness={0.44} metalness={0.08} />
    </mesh>
    <group ref={foam}>
    {[-5.5, -7.5, -10].map((z, i) => <mesh key={z} position={[0, 0.025, z]}>
      <boxGeometry args={[34 - i * 2, 0.018, 0.14]} />
      <meshBasicMaterial color="#e2efe2" transparent opacity={0.65 - i * 0.12} />
    </mesh>)}
    </group>
  </group>;
}

function Palm({ x, z, height = 4 }: { x: number; z: number; height?: number }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, height / 2, 0]} rotation={[0, 0, 0.09]} castShadow>
      <cylinderGeometry args={[0.13, 0.23, height, 8]} />
      <meshStandardMaterial color="#817058" roughness={1} />
    </mesh>
    {Array.from({ length: 7 }, (_, i) => {
      const a = i * Math.PI * 2 / 7;
      return <group key={i} position={[0.23, height, 0]} rotation={[0, a, 0]}>
        <mesh position={[0, -0.22, 1.16]} rotation={[0.24, 0, 0]} castShadow>
          <sphereGeometry args={[0.44, 7, 5]} />
          <meshStandardMaterial color={i % 2 ? "#477955" : "#5c8b57"} />
        </mesh>
        <mesh position={[0, -0.24, 1.9]} scale={[0.45, 0.17, 1.75]} castShadow>
          <sphereGeometry args={[1, 8, 5]} />
          <meshStandardMaterial color="#59874f" side={2} />
        </mesh>
      </group>;
    })}
  </group>;
}

function BeachHut({ x, z, color }: { x: number; z: number; color: string }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[1.3, 1.65, 0.75, 8]} />
      <meshStandardMaterial color="#b69c69" />
    </mesh>
    <mesh position={[0, 1.86, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
      <coneGeometry args={[1.85, 1.0, 8]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
    {[-0.95, 0.95].map(px => [-0.65, 0.65].map(pz => <mesh key={px + ":" + pz} position={[px, 0.75, pz]}>
      <cylinderGeometry args={[0.075, 0.08, 1.5, 6]} />
      <meshStandardMaterial color="#776149" />
    </mesh>))}
  </group>;
}


function Beachgoer({ x, z, shirt, walking, phase }: { x: number; z: number; shirt: string; walking: boolean; phase: number }) {
  const root = useRef<Group>(null);
  const speed = useRef(0);
  const appearances: Appearance[] = [
    {body:"feminine",skin:1,hair:0,outfit:2,hairstyle:"afro"},
    {body:"masculine",skin:2,hair:1,outfit:1,hairstyle:"short"},
    {body:"feminine",skin:3,hair:0,outfit:3,hairstyle:"bun"},
    {body:"masculine",skin:0,hair:0,outfit:4,hairstyle:"short"},
  ];
  const selected = appearances[shirt === "#cf795a" ? 0 : shirt === "#3a8695" ? 1 : shirt === "#d1aa4b" ? 2 : 3];
  useFrame(({ clock }) => {
    if (!root.current || !walking) return;
    const t = clock.elapsedTime * 0.35 + phase;
    root.current.position.x = x + Math.sin(t) * 2;
    root.current.position.z = z + Math.cos(t) * 0.65;
    root.current.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
    speed.current = 1.3;
  });
  return <group ref={root} position={[x, 0, z]}><PlayerAvatar appearance={selected} speed={speed} /></group>;
}

export function FidjrosseBeach({ time }: { time: TimeOfDay }) {
  const night = time === "night";
  const sky = night ? "#1d3047" : time === "sunset" ? "#e5a18b" : "#a8d8df";
  return <>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky, 26, 78]} />
    <ambientLight intensity={night ? 0.7 : 1.7} />
    <directionalLight position={[-6, 12, 9]} intensity={night ? 0.45 : 2} color={time === "sunset" ? "#ffd6ac" : "#fff2d9"} castShadow />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 55]} />
      <meshStandardMaterial color="#cfb287" roughness={1} />
    </mesh>
    <Atlantic />
    {/* Naturalistic shoreline layers remain on the sand side of the walk boundary. */}
    {[-3,-2,-1].map((z,i) => <mesh key={z} position={[0,0.024+i*0.002,z]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[34-i*1.5,0.17]} /><meshBasicMaterial color="#efe0bd" transparent opacity={0.4+i*0.12} />
    </mesh>)}
    <mesh position={[0, 0.035, 13]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[38, 3.2]} />
      <meshStandardMaterial color="#b49b76" />
    </mesh>
    {[[-13, 10], [-8, 16], [9, 12], [14, 17]].map(([x,z],i) => <Palm key={i} x={x} z={z} height={3.6+i*0.3} />)}
    {/* Refreshment kiosks, beach seating and shaded outdoor gathering spaces. */}
    {[-12,12].map((x,i)=><group key={x} position={[x,0,8]}>
      <mesh position={[0,0.85,0]} castShadow><boxGeometry args={[2.6,1.7,1.4]}/><meshStandardMaterial color={i?"#a57954":"#c39c6d"}/></mesh>
      <mesh position={[0,1.85,0]} castShadow><boxGeometry args={[3,0.25,1.8]}/><meshStandardMaterial color={i?"#4f8982":"#b87357"}/></mesh>
      {[-0.8,0,0.8].map(pos=><mesh key={pos} position={[pos,1.6,0.74]}><boxGeometry args={[0.22,0.26,0.18]}/><meshStandardMaterial color={i?"#d8b74b":"#79a46b"}/></mesh>)}
    </group>)}
    {[-7,-3,3,7].map((x,i)=><group key={x} position={[x,0,11]}>
      <mesh position={[0,0.56,0]} castShadow><cylinderGeometry args={[0.7,0.7,0.12,10]}/><meshStandardMaterial color="#8f7252"/></mesh>
      <mesh position={[0,0.3,0]}><cylinderGeometry args={[0.075,0.08,0.55,8]}/><meshStandardMaterial color="#695d4a"/></mesh>
      {[-1,1].map(dir=><mesh key={dir} position={[dir*1.15,0.26,0]} rotation={[0,0,dir*0.08]} castShadow><boxGeometry args={[0.62,0.25,0.7]}/><meshStandardMaterial color={i%2?"#6a9a93":"#c18b59"}/></mesh>)}
    </group>)}
    <BeachHut x={-9} z={1} color="#ab8051" />
    <BeachHut x={9} z={3} color="#987d55" />
    {[[-2,2,"#cc6b4f"],[4,0,"#dfbc5d"]].map(([x,z,c],i) => <group key={i} position={[Number(x),0,Number(z)]}>
      <mesh position={[0,1.35,0]}>
        <cylinderGeometry args={[0.05,0.07,2.7,7]} />
        <meshStandardMaterial color="#d8d0bc" />
      </mesh>
      <mesh position={[0,2.6,0]} castShadow>
        <coneGeometry args={[1.7,0.42,8]} />
        <meshStandardMaterial color={String(c)} />
      </mesh>
    </group>)}
    <group position={[6,0,-1]}>
      <mesh position={[0,0.37,0]} castShadow>
        <boxGeometry args={[1.8,0.2,0.72]} />
        <meshStandardMaterial color="#9c7351" />
      </mesh>
      <mesh position={[0,0.16,0]}>
        <boxGeometry args={[1.6,0.24,0.5]} />
        <meshStandardMaterial color="#785b44" />
      </mesh>
    </group>
    <Beachgoer x={-5} z={5} shirt="#cf795a" walking={false} phase={0} />
    {!night && <Beachgoer x={2} z={4} shirt="#3a8695" walking phase={0} />}
    {!night && <Beachgoer x={-3} z={9} shirt="#d1aa4b" walking phase={2} />}
    {time === "afternoon" && <Beachgoer x={9} z={9} shirt="#6d6c94" walking phase={4} />}
    {night && <pointLight position={[9,3,3]} intensity={6} color="#ffcb84" distance={10} />}
  </>;
}
