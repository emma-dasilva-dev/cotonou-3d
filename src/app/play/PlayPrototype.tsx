"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { Group } from "three";
import styles from "./PlayPrototype.module.css";
import { PlayerAvatar } from "./PlayerAvatar";
import { APPEARANCE_KEY, DEFAULT_APPEARANCE, HAIR_COLORS, HAIRSTYLES, OUTFIT_COLORS, SKIN_COLORS, validateAppearance } from "./appearance";
import type { Appearance } from "./appearance";

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
const SHOP_POSITION = new Vector3(5, 0, -1.2);
const SHOP_RADIUS = 1.8;
const ITEMS = [
  { id: "water", name: "Eau fraîche", price: 250, description: "Une bouteille d’eau pour la route." },
  { id: "snack", name: "Petit goûter", price: 500, description: "Une pause gourmande dans le quartier." },
  { id: "shirt", name: "T-shirt coton", price: 1200, description: "Un vêtement simple pour votre collection." },
] as const;
type ItemId = (typeof ITEMS)[number]["id"];
type Inventory = Record<ItemId, number>;
const EMPTY_INVENTORY: Inventory = { water: 0, snack: 0, shirt: 0 };
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

function Character({ keys, locked, onProximity, onDeliveryProximity, onShopProximity, appearance }: { keys: React.RefObject<Controls>; locked: React.RefObject<boolean>; onProximity: (near: boolean) => void; onDeliveryProximity: (near: boolean) => void; onShopProximity: (near: boolean) => void; appearance: Appearance }) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const position = useRef(START.clone());
  const direction = useRef(new Vector3());
  const desiredCamera = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const speed = useRef(0);
  const wasNear = useRef(false);
  const wasNearDelivery = useRef(false);
  const wasNearShop = useRef(false);
  useFrame((_, dt) => {
    if (!group.current) return;
    const input = locked.current ? EMPTY : keys.current;
    const horizontal = Number(input.right) - Number(input.left);
    const vertical = Number(input.backward) - Number(input.forward);
    direction.current.set(horizontal, 0, vertical);
    if (direction.current.lengthSq() > 0) direction.current.normalize();
    const step = Math.min(dt, 0.05);
    const targetX = direction.current.x * 3.6;
    const targetZ = direction.current.z * 3.6;
    const ease = 1 - Math.exp(-(locked.current ? 20 : 11) * step);
    velocity.current.x += (targetX - velocity.current.x) * ease;
    velocity.current.z += (targetZ - velocity.current.z) * ease;
    const oldX = position.current.x;
    const oldZ = position.current.z;
    const nextX = oldX + velocity.current.x * step;
    const nextZ = oldZ + velocity.current.z * step;
    if (canWalk(nextX, oldZ)) position.current.x = nextX;
    else velocity.current.x = 0;
    if (canWalk(position.current.x, nextZ)) position.current.z = nextZ;
    else velocity.current.z = 0;
    const deltaX = position.current.x - oldX;
    const deltaZ = position.current.z - oldZ;
    speed.current = Math.hypot(deltaX, deltaZ) / Math.max(step, 0.0001);
    if (speed.current > 0.08) {
      const face = Math.atan2(deltaX, deltaZ);
      const turn = Math.atan2(Math.sin(face - group.current.rotation.y), Math.cos(face - group.current.rotation.y));
      group.current.rotation.y += turn * (1 - Math.exp(-12 * step));
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
    const nearShop = position.current.distanceTo(SHOP_POSITION) <= SHOP_RADIUS;
    if (nearShop !== wasNearShop.current) {
      wasNearShop.current = nearShop;
      onShopProximity(nearShop);
    }
    group.current.position.copy(position.current);
    // Fixed-angle follow camera; the character stays fully visible.
    desiredCamera.current.set(position.current.x + 6, 5.5, position.current.z + 8);
    camera.position.lerp(desiredCamera.current, 1 - Math.exp(-5 * dt));
    camera.lookAt(position.current.x, 1.1, position.current.z);
  });
  return <group ref={group}><PlayerAvatar speed={speed} appearance={appearance} /></group>;
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

function Neighborhood({ keys, locked, onProximity, onDeliveryProximity, onShopProximity, mission, appearance }: { keys: React.RefObject<Controls>; locked: React.RefObject<boolean>; onProximity: (near: boolean) => void; onDeliveryProximity: (near: boolean) => void; onShopProximity: (near: boolean) => void; mission: Mission; appearance: Appearance }) {
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
    <group position={[SHOP_POSITION.x,0,SHOP_POSITION.z]}>
      <mesh position={[0,0.75,0]} castShadow>
        <boxGeometry args={[1.45,1.5,0.65]} />
        <meshStandardMaterial color="#c59869" />
      </mesh>
      <mesh position={[0,1.64,0]} castShadow>
        <boxGeometry args={[1.85,0.18,0.92]} />
        <meshStandardMaterial color="#375c51" />
      </mesh>
      <mesh position={[0,2.25,0]}>
        <boxGeometry args={[1.5,0.42,0.12]} />
        <meshStandardMaterial color="#f1e7d3" />
      </mesh>
    </group>
    <Resident />
    {mission === "active" && <group position={[DELIVERY_POSITION.x,0,DELIVERY_POSITION.z]}>
      <mesh position={[0,0.12,0]}><cylinderGeometry args={[0.8,0.8,0.05,32]} /><meshStandardMaterial color="#d4b269" emissive="#826329" emissiveIntensity={0.2} /></mesh>
      <mesh position={[0,1.25,0]}><boxGeometry args={[0.75,0.9,0.6]} /><meshStandardMaterial color="#5c7667" /></mesh>
      <mesh position={[0,2.3,0]}><octahedronGeometry args={[0.4]} /><meshBasicMaterial color="#f4d482" /></mesh>
    </group>}
    <Character keys={keys} locked={locked} onProximity={onProximity} onDeliveryProximity={onDeliveryProximity} onShopProximity={onShopProximity} appearance={appearance} />
  </>;
}

export default function PlayPrototype() {
  const keys = useRef<Controls>({ ...EMPTY });
  const creatorOpenRef = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [appearance, setAppearance] = useState<Appearance>({ ...DEFAULT_APPEARANCE });
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [appearanceLoaded, setAppearanceLoaded] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(APPEARANCE_KEY);
      if (stored) setAppearance(validateAppearance(JSON.parse(stored)));
      else { creatorOpenRef.current = true; setCreatorOpen(true); }
    } catch { creatorOpenRef.current = true; setCreatorOpen(true); }
    setAppearanceLoaded(true);
  }, []);
  useEffect(() => {
    if (appearanceLoaded) localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearance));
  }, [appearance, appearanceLoaded]);
  function closeCreator() { creatorOpenRef.current = false; setCreatorOpen(false); }
  function openCreator() {
    if (!appearanceLoaded || pausedRef.current || shopOpenRef.current || dialogueRef.current) return;
    keys.current = { ...EMPTY };
    setBagOpen(false);
    creatorOpenRef.current = true; setCreatorOpen(true);
  }
  function updateAppearance(patch: Partial<Appearance>) {
    setAppearance(value => ({ ...value, ...patch }));
  }
  const [mission, setMission] = useState<Mission>("available");
  const [wallet, setWallet] = useState(0);
  const [inventory, setInventory] = useState<Inventory>({ ...EMPTY_INVENTORY });
  const inventoryRef = useRef<Inventory>({ ...EMPTY_INVENTORY });
  const walletRef = useRef(0);
  const [shopOpen, setShopOpen] = useState(false);
  const shopOpenRef = useRef(false);
  const [nearShop, setNearShop] = useState(false);
  const shopRef = useRef(false);
  const [shopMessage, setShopMessage] = useState("");
  const [bagOpen, setBagOpen] = useState(false);
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
            if (typeof state.wallet === "number" && Number.isSafeInteger(state.wallet) && state.wallet >= 0) {
              walletRef.current = state.wallet; setWallet(state.wallet);
            }
            if ("inventory" in data && data.inventory && typeof data.inventory === "object") {
              const values = data.inventory as Record<string, unknown>;
              const valid = Object.fromEntries(ITEMS.map(item => [item.id,
                typeof values[item.id] === "number" && Number.isSafeInteger(values[item.id]) && values[item.id] >= 0 && values[item.id] <= 10000 ? values[item.id] : 0
              ])) as Inventory;
              inventoryRef.current = valid; setInventory(valid);
            }
          }
        }
      }
    } catch { /* Invalid save: begin a fresh prototype session. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(SAVE_KEY, JSON.stringify({ mission, wallet, inventory }));
  }, [loaded, mission, wallet, inventory]);
  function acceptMission() {
    if (!loaded || missionRef.current !== "available") return;
    missionRef.current = "active"; setMission("active"); closeDialogue();
  }
  function deliver() {
    if (!loaded || !deliveryRef.current || missionRef.current !== "active" || pausedRef.current || dialogueRef.current) return;
    missionRef.current = "completed";
    setMission("completed");
    walletRef.current += 1500;
    setWallet(walletRef.current);
  }
  function openShop() {
    if (creatorOpenRef.current || !loaded || !shopRef.current || pausedRef.current || dialogueRef.current || shopOpenRef.current) return;
    keys.current = { ...EMPTY }; shopOpenRef.current = true; locked.current = true;
    setBagOpen(false); setShopMessage(""); setShopOpen(true);
  }
  function closeShop() {
    shopOpenRef.current = false; setShopOpen(false); setShopMessage("");
    locked.current = pausedRef.current || dialogueRef.current;
  }
  function purchase(id: ItemId) {
    if (!loaded || !shopOpenRef.current || !shopRef.current) return;
    const item = ITEMS.find(product => product.id === id);
    if (!item || walletRef.current < item.price) {
      setShopMessage("Solde insuffisant."); return;
    }
    if (inventoryRef.current[id] >= 10000) {
      setShopMessage("Limite de stockage atteinte."); return;
    }
    walletRef.current -= item.price;
    inventoryRef.current = { ...inventoryRef.current, [id]: inventoryRef.current[id] + 1 };
    setWallet(walletRef.current);
    setInventory(inventoryRef.current);
    setShopMessage(`${item.name} ajouté à votre inventaire.`);
  }
  function toggleBag() {
    if (creatorOpenRef.current || !loaded || pausedRef.current || shopOpenRef.current || dialogueRef.current) return;
    keys.current = { ...EMPTY };
    setBagOpen(value => { locked.current = !value; return !value; });
  }
  const onShopProximity = (near: boolean) => { shopRef.current = near; setNearShop(near); };
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
    if (creatorOpenRef.current || !nearRef.current || dialogueRef.current || pausedRef.current) return;
    keys.current = { ...EMPTY };
    dialogueRef.current = true;
    locked.current = true;
    setDialogue(true);
  }
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === "KeyE" && !event.repeat) {
        if (creatorOpenRef.current) return;
        if (shopRef.current && !shopOpenRef.current && !dialogueRef.current && !pausedRef.current && !locked.current) {
          event.preventDefault(); keys.current = { ...EMPTY }; shopOpenRef.current = true; locked.current = true;
          setShopMessage(""); setShopOpen(true); return;
        }
        if (deliveryRef.current && missionRef.current === "active" && !pausedRef.current && !dialogueRef.current) {
          event.preventDefault();
          missionRef.current = "completed"; setMission("completed"); walletRef.current += 1500; setWallet(walletRef.current);
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
      if (event.code === "Escape" && creatorOpenRef.current) { setCreatorOpen(false); return; }
      if (event.code === "Escape" && shopOpenRef.current) {
        shopOpenRef.current = false; setShopOpen(false); setShopMessage("");
        locked.current = pausedRef.current; return;
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
    if (!creatorOpenRef.current && !locked.current) keys.current[key] = pressed;
  }
  function togglePause() {
    if (creatorOpenRef.current) return;
    keys.current = { ...EMPTY };
    const next = !pausedRef.current;
    pausedRef.current = next;
    locked.current = next || dialogueRef.current;
    setPaused(next);
  }
  return (
    <main className={styles.root}>
      <Canvas shadows dpr={[1,1.75]} camera={{ position:[6,5.5,8], fov:55, near:0.1, far:90 }} frameloop={isPaused ? "never" : "always"}>
        <Neighborhood keys={keys} locked={locked} onProximity={onProximity} onDeliveryProximity={onDeliveryProximity} onShopProximity={onShopProximity} mission={mission} appearance={appearance} />
      </Canvas>
      <header className={styles.header}>
        <div><strong>COTONOU / 3D</strong><span>SIMULATEUR · PROTOTYPE 06</span></div>
        <a href="/">Retour à l’exposition ↗</a>
      </header>
      <button type="button" className={styles.creatorButton} onClick={openCreator} disabled={creatorOpen || dialogue || shopOpen || isPaused}>Personnage</button>
      {creatorOpen && <section role="dialog" aria-modal="true" aria-labelledby="creator-title" className={styles.creatorPanel}>
        <span className={styles.shopKicker}>MON IDENTITÉ · COTONOU</span>
        <h2 id="creator-title">Créer mon personnage</h2>
        <p>Personnalise ton apparence avant de découvrir le quartier.</p>
        {([
          { title: "Carnation", field: "skin", colors: SKIN_COLORS },
          { title: "Couleur des cheveux", field: "hair", colors: HAIR_COLORS },
          { title: "Vêtement", field: "outfit", colors: OUTFIT_COLORS },
        ] as const).map(group => <fieldset className={styles.creatorField} key={group.field}>
          <legend>{group.title}</legend>
          <div className={styles.swatches}>{group.colors.map((color, index) => <button
            key={color} type="button" title={`${group.title} ${index + 1}`}
            aria-label={`${group.title} ${index + 1}`} aria-pressed={appearance[group.field] === index}
            className={styles.swatch} style={{ backgroundColor: color }}
            onClick={() => updateAppearance({ [group.field]: index })} />)}</div>
        </fieldset>)}
        <fieldset className={styles.creatorField}><legend>Coiffure</legend>
          <div className={styles.styles}>{HAIRSTYLES.map((style,index)=><button key={style} type="button"
            aria-pressed={appearance.hairstyle === style} onClick={()=>updateAppearance({hairstyle:style})}>
            {["Courte","Afro","Chignon"][index]}</button>)}</div>
        </fieldset>
        <button className={styles.creatorDone} type="button" onClick={closeCreator}>Enregistrer et jouer</button>
      </section>}
      <aside className={styles.missionHud} aria-live="polite"><strong>{wallet.toLocaleString("fr-FR")} FCFA</strong><span>{mission === "available" ? "Nouvelle mission : parlez à Aïcha" : mission === "active" ? "Première course · Livrez au marqueur jaune" : "Première course terminée · +1 500 FCFA"}</span></aside>
      <button type="button" className={styles.bagButton} onClick={toggleBag} disabled={shopOpen || dialogue || isPaused} aria-expanded={bagOpen}>Inventaire ({Object.values(inventory).reduce((a,b)=>a+b,0)})</button>
      {bagOpen && <aside className={styles.bag} aria-label="Inventaire">
        <h2>Mon inventaire</h2>
        {ITEMS.map(item => <div key={item.id}><span>{item.name}</span><strong>× {inventory[item.id]}</strong></div>)}
        <button type="button" onClick={toggleBag}>Fermer</button>
      </aside>}
      <div className={styles.help}><strong>Explorer le quartier</strong><span>W A S D / flèches pour se déplacer</span><span>Approchez-vous du résident en orange, puis appuyez sur E.</span></div>
      {nearShop && !creatorOpen && !dialogue && !shopOpen && !bagOpen && !isPaused && <button type="button" className={styles.shopPrompt} onClick={openShop}>E · Ouvrir la boutique</button>}
      {shopOpen && <section className={styles.shopPanel} role="dialog" aria-modal="true" aria-labelledby="shop-heading">
        <span className={styles.shopKicker}>COMMERCE DE QUARTIER</span>
        <h2 id="shop-heading">La petite boutique</h2>
        <p>Votre solde : <strong>{wallet.toLocaleString("fr-FR")} FCFA</strong></p>
        <div className={styles.shopItems}>{ITEMS.map(item => <div className={styles.shopItem} key={item.id}>
          <div><strong>{item.name}</strong><span>{item.description}</span></div>
          <button type="button" disabled={!loaded || wallet < item.price} onClick={() => purchase(item.id)}>
            {item.price.toLocaleString("fr-FR")} FCFA · Acheter
          </button>
        </div>)}</div>
        <p aria-live="polite" className={styles.shopMessage}>{shopMessage}</p>
        <button type="button" className={styles.closeShop} onClick={closeShop}>Quitter la boutique</button>
      </section>}
      {nearResident && !creatorOpen && !dialogue && !shopOpen && !bagOpen && !isPaused && <button type="button" className={styles.interact} onClick={startDialogue}>E · Parler à Aïcha</button>}
      {nearDelivery && mission === "active" && !creatorOpen && !dialogue && !shopOpen && !bagOpen && !isPaused && <button type="button" className={styles.deliver} onClick={deliver}>E · Livrer le colis</button>}
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
