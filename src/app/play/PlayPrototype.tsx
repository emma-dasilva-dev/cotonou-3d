"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
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
const NPC_POSITION = new Vector3(0, 0, -5.5);
const TALK_RADIUS = 1.8;
const DELIVERY_POSITION = new Vector3(0, 0, 6);
const DELIVERY_RADIUS = 1.5;
type Mission = "available" | "active" | "completed";
const SAVE_KEY = "cotonou-life-prototype03";
function canWalk(x: number, z: number) {
  if (Math.abs(x) > 10.8 || Math.abs(z) > 10.8) return false;
  if (Math.hypot(x - NPC_POSITION.x, z - NPC_POSITION.z) < 0.56) return false;
  return !BUILDINGS.some(b =>
    Math.abs(x - b.x) < b.width / 2 + 0.34 &&
    Math.abs(z - b.z) < b.depth / 2 + 0.34
  );
}

function Character({ keys, locked, onProximity, onDeliveryProximity }: { keys: React.RefObject<Controls>; locked: React.RefObject<boolean>; onProximity: (near: boolean) => void; onDeliveryProximity: (near: boolean) => void }) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const position = useRef(START.clone());
  const direction = useRef(new Vector3());
  const desiredCamera = useRef(new Vector3());
  const wasNear = useRef(false);
  const wasNearDelivery = useRef(false);
  useFrame((_, dt) => {
    if (!group.current) return;
    const input = locked.current ? EMPTY : keys.current;
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
    const near = position.current.distanceTo(NPC_POSITION) <= TALK_RADIUS;
    if (near !== wasNear.current) {
      wasNear.current = near;
      onProximity(near);
    }
    const nearDelivery = position.current.distanceTo(DELIVERY_POSITION) <= DELIVERY_RADIUS;
    if (nearDelivery !== wasNearDelivery.current) {
      wasNearDelivery.current = nearDelivery;
      onDeliveryProximity(nearDelivery);
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

function Resident() {
  return (
    <group position={[NPC_POSITION.x, 0, NPC_POSITION.z]}>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.32, 1.02, 6, 12]} />
        <meshStandardMaterial color="#bc7849" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.87, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 10]} />
        <meshStandardMaterial color="#75472f" />
      </mesh>
      <mesh position={[0, 2.23, 0]}>
        <sphereGeometry args={[0.2, 12, 8]} />
        <meshStandardMaterial color="#282624" />
      </mesh>
      <mesh position={[0, 2.78, 0]}>
        <sphereGeometry args={[0.27, 20, 12]} />
        <meshBasicMaterial color="#faf2de" />
      </mesh>
    </group>
  );
}

function Neighborhood({ keys, locked, onProximity, onDeliveryProximity, mission }: { keys: React.RefObject<Controls>; locked: React.RefObject<boolean>; onProximity: (near: boolean) => void; onDeliveryProximity: (near: boolean) => void; mission: Mission }) {
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
    <Resident />
    {mission === "active" && <group position={[DELIVERY_POSITION.x,0,DELIVERY_POSITION.z]}>
      <mesh position={[0,0.12,0]}><cylinderGeometry args={[0.8,0.8,0.05,32]} /><meshStandardMaterial color="#d4b269" emissive="#826329" emissiveIntensity={0.2} /></mesh>
      <mesh position={[0,1.25,0]}><boxGeometry args={[0.75,0.9,0.6]} /><meshStandardMaterial color="#5c7667" /></mesh>
      <mesh position={[0,2.3,0]}><octahedronGeometry args={[0.4]} /><meshBasicMaterial color="#f4d482" /></mesh>
    </group>}
    <Character keys={keys} locked={locked} onProximity={onProximity} onDeliveryProximity={onDeliveryProximity} />
  </>;
}

export default function PlayPrototype() {
  const keys = useRef<Controls>({ ...EMPTY });
  const [isPaused, setPaused] = useState(false);
  const [mission, setMission] = useState<Mission>("available");
  const [wallet, setWallet] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const missionRef = useRef<Mission>("available");
  const [nearDelivery, setNearDelivery] = useState(false);
  const deliveryRef = useRef(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const data: unknown = JSON.parse(saved);
        if (data && typeof data === "object" && "mission" in data && "wallet" in data) {
          const state = data as { mission: unknown; wallet: unknown };
          if (state.mission === "available" || state.mission === "active" || state.mission === "completed") {
            missionRef.current = state.mission;
            setMission(state.mission);
            if (typeof state.wallet === "number" && Number.isFinite(state.wallet) && state.wallet >= 0) setWallet(Math.floor(state.wallet));
          }
        }
      }
    } catch { /* Invalid save: begin a fresh prototype session. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(SAVE_KEY, JSON.stringify({ mission, wallet }));
  }, [loaded, mission, wallet]);
  function acceptMission() {
    if (!loaded || missionRef.current !== "available") return;
    missionRef.current = "active"; setMission("active"); closeDialogue();
  }
  function deliver() {
    if (!loaded || !deliveryRef.current || missionRef.current !== "active" || pausedRef.current || dialogueRef.current) return;
    missionRef.current = "completed";
    setMission("completed");
    setWallet(value => value + 1500);
  }
  const [nearResident, setNearResident] = useState(false);
  const nearRef = useRef(false);
  const [dialogue, setDialogue] = useState(false);
  const locked = useRef(false);
  const dialogueRef = useRef(false);
  const pausedRef = useRef(false);
  const onProximity = (near: boolean) => { nearRef.current = near; setNearResident(near); };
  const onDeliveryProximity = (near: boolean) => { deliveryRef.current = near; setNearDelivery(near); };
  function closeDialogue() { dialogueRef.current = false; setDialogue(false); locked.current = pausedRef.current; }
  function startDialogue() {
    if (!nearRef.current || dialogueRef.current || pausedRef.current) return;
    keys.current = { ...EMPTY };
    dialogueRef.current = true;
    locked.current = true;
    setDialogue(true);
  }
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === "KeyE" && !event.repeat) {
        if (deliveryRef.current && missionRef.current === "active" && !pausedRef.current && !dialogueRef.current) {
          event.preventDefault();
          missionRef.current = "completed"; setMission("completed"); setWallet(value => value + 1500);
          return;
        }
        if (nearRef.current && !dialogueRef.current && !pausedRef.current) {
          event.preventDefault();
          keys.current = { ...EMPTY };
          dialogueRef.current = true;
          locked.current = true;
          setDialogue(true);
        }
        return;
      }
      if (event.code === "Escape" && dialogueRef.current) {
        dialogueRef.current = false; setDialogue(false); locked.current = pausedRef.current;
        return;
      }
      const key = KEY_MAP[event.code];
      if (key) { event.preventDefault(); if (!event.repeat && !locked.current) keys.current[key] = true; }
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
    if (!locked.current) keys.current[key] = pressed;
  }
  function togglePause() {
    keys.current = { ...EMPTY };
    const next = !pausedRef.current;
    pausedRef.current = next;
    locked.current = next || dialogueRef.current;
    setPaused(next);
  }
  return (
    <main className={styles.root}>
      <Canvas shadows dpr={[1,1.75]} camera={{ position:[6,5.5,8], fov:55, near:0.1, far:90 }} frameloop={isPaused ? "never" : "always"}>
        <Neighborhood keys={keys} locked={locked} onProximity={onProximity} onDeliveryProximity={onDeliveryProximity} mission={mission} />
      </Canvas>
      <header className={styles.header}>
        <div><strong>COTONOU / 3D</strong><span>SIMULATEUR · PROTOTYPE 03</span></div>
        <a href="/">Retour à l’exposition ↗</a>
      </header>
      <aside className={styles.missionHud} aria-live="polite"><strong>{wallet.toLocaleString("fr-FR")} FCFA</strong><span>{mission === "available" ? "Nouvelle mission : parlez à Aïcha" : mission === "active" ? "Première course · Livrez au marqueur jaune" : "Première course terminée · +1 500 FCFA"}</span></aside>
      <div className={styles.help}><strong>Explorer le quartier</strong><span>W A S D / flèches pour se déplacer</span><span>Approchez-vous du résident en orange, puis appuyez sur E.</span></div>
      {nearResident && !dialogue && !isPaused && <button type="button" className={styles.interact} onClick={startDialogue}>E · Parler à Aïcha</button>}
      {nearDelivery && mission === "active" && !dialogue && !isPaused && <button type="button" className={styles.deliver} onClick={deliver}>E · Livrer le colis</button>}
      {dialogue && <section role="dialog" aria-modal="true" aria-labelledby="resident-name" className={styles.dialogue}>
        <span className={styles.dialogueEyebrow}>RENCONTRE · HABITANTE DU QUARTIER</span>
        <h2 id="resident-name">Aïcha</h2>
        <p>{mission === "available" ? "Salut ! Bienvenue dans le quartier. Tu peux m’aider ? Dépose ce colis au point de livraison, de l’autre côté de la rue. Je te donnerai 1 500 FCFA." : mission === "active" ? "Le colis t’attend ! Suis le marqueur jaune au sud du quartier pour terminer ta course." : "Merci pour ton aide ! Ton paiement de 1 500 FCFA a été ajouté à ton portefeuille."}</p>
        {mission === "available" && <button type="button" onClick={acceptMission} autoFocus>Accepter la course · 1 500 FCFA</button>}
        <button type="button" onClick={closeDialogue} autoFocus={mission !== "available"}>{mission === "available" ? "Pas maintenant" : "Fermer"}</button>
      </section>}
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
