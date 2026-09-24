"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import type { ElementRef } from "react";
import type { PerspectiveCamera } from "three";
import { HotelDuLacExterior } from "./HotelDuLacExterior";
import { GoldenTulipExterior } from "./GoldenTulipExterior";
import { SofitelExterior } from "./SofitelExterior";
import { NovotelExterior } from "./NovotelExterior";
import { hotelStudies } from "./hotels";
import type { HotelStudy } from "./hotels";

type CotonouSceneProps = {
  onSelectHotel: (hotel: HotelStudy) => void;
  activeHotelId?: string;
  focusHotelId?: string;
};

type Block = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
};

const HOTEL_DU_LAC_POSITION: [number, number, number] = [4.6, 0, 1.7];
const SOFITEL_POSITION: [number, number, number] = [-4.7, 0, -2.2];
const GOLDEN_TULIP_POSITION: [number, number, number] = [-1.7, 0, -3.1];
const NOVOTEL_POSITION: [number, number, number] = [1.7, 0, -2.1];

const FOCUS_VIEWS: Record<
  string,
  {
    camera: [number, number, number];
    target: [number, number, number];
    minDistance: number;
    maxDistance: number;
  }
> = {
  "hotel-du-lac": {
    camera: [8.25, 3.25, -3.65],
    target: [4.6, 1.0, 1.35],
    minDistance: 3.4,
    maxDistance: 9.5,
  },
  sofitel: {
    camera: [-9.85, 4.35, -7.9],
    target: [-4.62, 1.72, -2.35],
    minDistance: 4.8,
    maxDistance: 12.5,
  },
  "golden-tulip": {
    camera: [-5.95, 3.6, -7.85],
    target: [-1.65, 1.35, -3.15],
    minDistance: 4.2,
    maxDistance: 11.5,
  },
  novotel: {
    camera: [6.2, 3.45, -6.55],
    target: [1.75, 1.2, -2.35],
    minDistance: 4.0,
    maxDistance: 11.0,
  },
};

function CameraRig({ focusHotelId }: { focusHotelId?: string }) {
  const { camera, size } = useThree();
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.fov =
      size.width <= 720 ? 46 : size.width <= 1024 ? 40 : 34;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const view = focusHotelId ? FOCUS_VIEWS[focusHotelId] : undefined;
    const cameraTarget = view
      ? { x: view.camera[0], y: view.camera[1], z: view.camera[2] }
      : { x: 10.5, y: 9.5, z: 13.5 };
    const orbitTarget = view
      ? { x: view.target[0], y: view.target[1], z: view.target[2] }
      : { x: 0, y: 0, z: 0.2 };

    const timeline = gsap.timeline({
      defaults: { duration: view ? 2.35 : 2.0, ease: "power3.inOut" },
    });

    timeline.to(
      camera.position,
      {
        ...cameraTarget,
        onUpdate: () => controls.update(),
      },
      0,
    );

    timeline.to(
      controls.target,
      {
        ...orbitTarget,
        onUpdate: () => controls.update(),
      },
      0,
    );

    return () => {
      timeline.kill();
    };
  }, [camera, focusHotelId]);

  const view = focusHotelId ? FOCUS_VIEWS[focusHotelId] : undefined;

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minDistance={view?.minDistance ?? 8.5}
      maxDistance={view?.maxDistance ?? 20}
      minPolarAngle={view ? 0.62 : 0.55}
      maxPolarAngle={view ? 1.44 : 1.18}
      target={view?.target ?? [0, 0, 0.2]}
    />
  );
}

function CityBlocks() {
  const blocks = useMemo<Block[]>(() => {
    const result: Block[] = [];

    for (let row = 0; row < 7; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        if ((row + column) % 5 === 0 || column === 4) continue;

        const x = -6.3 + column * 1.4;
        const z = -4.1 + row * 1.35;

        if (Math.hypot(x - 4.6, z - 1.7) < 2.35) continue;
        if (Math.hypot(x + 4.7, z + 2.2) < 3.25) continue;
        if (Math.hypot(x + 1.7, z + 3.1) < 2.7) continue;
        if (Math.hypot(x - 1.7, z + 2.1) < 2.85) continue;

        const width = 0.52 + ((column * 3 + row) % 4) * 0.08;
        const depth = 0.48 + ((row * 5 + column) % 3) * 0.09;
        const height = 0.18 + ((row * 7 + column * 2) % 6) * 0.09;

        result.push({
          key: `${row}-${column}`,
          position: [x, height / 2, z],
          scale: [width, height, depth],
        });
      }
    }

    return result;
  }, []);

  return (
    <group>
      {blocks.map((block) => (
        <mesh
          key={block.key}
          position={block.position}
          scale={block.scale}
          castShadow
          receiveShadow
        >
          <boxGeometry />
          <meshStandardMaterial color="#b7b1a6" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Roads() {
  return (
    <group position={[0, 0.012, 0]}>
      {[-2.7, 0.05, 2.75].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15.5, 0.2]} />
          <meshBasicMaterial color="#918d85" />
        </mesh>
      ))}
      {[-3.5, 0.1, 3.65].map((x) => (
        <mesh
          key={x}
          position={[x, 0, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[10.2, 0.18]} />
          <meshBasicMaterial color="#918d85" />
        </mesh>
      ))}
    </group>
  );
}

function WaterBand() {
  return (
    <mesh
      position={[0, -0.035, 5.25]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[19, 3.8, 1, 1]} />
      <meshStandardMaterial
        color="#738489"
        roughness={0.35}
        metalness={0.08}
      />
    </mesh>
  );
}

function HotelMarker({
  hotel,
  active,
  focused,
  onSelect,
}: {
  hotel: HotelStudy;
  active: boolean;
  focused: boolean;
  onSelect: () => void;
}) {
  const isHotelDuLac = hotel.id === "hotel-du-lac";
  const isSofitel = hotel.id === "sofitel";
  const isGoldenTulip = hotel.id === "golden-tulip";
  const isNovotel = hotel.id === "novotel";
  const markerY = isSofitel
    ? 4.05
    : isGoldenTulip
      ? 3.55
      : isNovotel
        ? 3.45
        : isHotelDuLac
          ? 3.18
          : 0.82;

  return (
    <group position={hotel.position}>
      {!hotel.exteriorReady && (
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.36, 0.64]} />
          <meshStandardMaterial
            color={active ? "#292927" : "#827d73"}
            roughness={0.82}
          />
        </mesh>
      )}

      <group visible={!focused}>
        <mesh position={[0, markerY, 0]}>
          <cylinderGeometry args={[0.012, 0.012, hotel.exteriorReady ? 0.7 : 0.92, 10]} />
          <meshBasicMaterial color="#292927" />
        </mesh>

        <mesh position={[0, markerY + (hotel.exteriorReady ? 0.38 : 0.48), 0]}>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshBasicMaterial color="#292927" />
        </mesh>
      </group>

      <Html
        center
        position={[0, markerY + (hotel.exteriorReady ? 0.78 : 0.8), 0]}
        distanceFactor={8.5}
        zIndexRange={[20, 0]}
        style={{
          opacity: focused ? 0 : 1,
          pointerEvents: focused ? "none" : "auto",
          transition: "opacity 180ms ease",
        }}
      >
        <button
          type="button"
          className={`hotel-marker${active ? " hotel-marker--active" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          aria-label={`Sélectionner ${hotel.name}`}
          tabIndex={focused ? -1 : 0}
          aria-hidden={focused}
        >
          <span className="hotel-marker__index">{hotel.index}</span>
          <span className="hotel-marker__name">{hotel.shortName}</span>
        </button>
      </Html>
    </group>
  );
}

export function CotonouScene({
  onSelectHotel,
  activeHotelId,
  focusHotelId,
}: CotonouSceneProps) {
  return (
    <>
      <color attach="background" args={["#d8d2c6"]} />
      <fog attach="fog" args={["#d8d2c6", 12, 27]} />

      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#e8e3d9", "#77736c", 1.35]} />
      <directionalLight
        position={[-5, 11, 7]}
        intensity={2.4}
        color="#fff4dc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#c9c0b1" roughness={1} />
      </mesh>

      <WaterBand />
      <Roads />
      <CityBlocks />

      <HotelDuLacExterior position={HOTEL_DU_LAC_POSITION} />
      <SofitelExterior position={SOFITEL_POSITION} />
      <GoldenTulipExterior position={GOLDEN_TULIP_POSITION} />
      <NovotelExterior position={NOVOTEL_POSITION} />

      {hotelStudies.map((hotel) => (
        <HotelMarker
          key={hotel.id}
          hotel={hotel}
          active={activeHotelId === hotel.id}
          focused={focusHotelId === hotel.id}
          onSelect={() => onSelectHotel(hotel)}
        />
      ))}

      <CameraRig focusHotelId={focusHotelId} />
    </>
  );
}
