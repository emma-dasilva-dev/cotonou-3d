"use client";

import {
  Billboard,
  Html,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ElementRef } from "react";
import type { Group } from "three";
import { HotelDuLacExterior } from "./HotelDuLacExterior";
import {
  getHotelDuLacHotspot,
  hotelDuLacHotspots,
} from "./hotelHotspots";
import { hotelStudies } from "./hotels";
import type { HotelHotspot } from "./hotelHotspots";
import type { HotelStudy } from "./hotels";

type CotonouSceneProps = {
  onSelectHotel: (hotel: HotelStudy) => void;
  onSelectHotspot: (hotspot: HotelHotspot) => void;
  activeHotelId?: string;
  focusHotelId?: string;
  activeHotspotId?: string;
  showHotspots?: boolean;
};

type Block = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
};

const HOTEL_DU_LAC_POSITION: [number, number, number] = [4.6, 0, 1.7];

function CameraRig({
  focusHotelId,
  activeHotspotId,
}: {
  focusHotelId?: string;
  activeHotspotId?: string;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const focused = focusHotelId === "hotel-du-lac";
    const hotspot = focused ? getHotelDuLacHotspot(activeHotspotId) : undefined;

    const cameraTarget = hotspot
      ? {
          x: hotspot.cameraPosition[0],
          y: hotspot.cameraPosition[1],
          z: hotspot.cameraPosition[2],
        }
      : focused
        ? { x: 8.25, y: 3.25, z: -3.65 }
        : { x: 10.5, y: 9.5, z: 13.5 };

    const orbitTarget = hotspot
      ? {
          x: hotspot.cameraTarget[0],
          y: hotspot.cameraTarget[1],
          z: hotspot.cameraTarget[2],
        }
      : focused
        ? { x: 4.6, y: 1.0, z: 1.35 }
        : { x: 0, y: 0, z: 0.2 };

    const timeline = gsap.timeline({
      defaults: {
        duration: hotspot ? 1.45 : focused ? 2.35 : 2.0,
        ease: "power3.inOut",
      },
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
  }, [camera, focusHotelId, activeHotspotId]);

  const focused = focusHotelId === "hotel-du-lac";
  const hotspot = focused ? getHotelDuLacHotspot(activeHotspotId) : undefined;
  const target: [number, number, number] = hotspot?.cameraTarget ??
    (focused ? [4.6, 1, 1.35] : [0, 0, 0.2]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minDistance={focused ? 2.8 : 8.5}
      maxDistance={focused ? 9.5 : 20}
      minPolarAngle={focused ? 0.58 : 0.55}
      maxPolarAngle={focused ? 1.46 : 1.18}
      target={target}
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
  const markerY = isHotelDuLac ? 3.18 : 0.82;

  return (
    <group position={hotel.position}>
      {!isHotelDuLac && (
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
          <cylinderGeometry args={[0.012, 0.012, isHotelDuLac ? 0.7 : 0.92, 10]} />
          <meshBasicMaterial color="#292927" />
        </mesh>

        <mesh position={[0, markerY + (isHotelDuLac ? 0.38 : 0.48), 0]}>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshBasicMaterial color="#292927" />
        </mesh>
      </group>

      <Html
        center
        position={[0, markerY + (isHotelDuLac ? 0.78 : 0.8), 0]}
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

function HotspotMarker({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: HotelHotspot;
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<Group>(null);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;

    const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.12;
    pulseRef.current.scale.setScalar(pulse);
  });

  const width = hotspot.label.length > 7 ? 1.55 : 1.3;
  const accent = active ? "#a84936" : "#b44c39";

  return (
    <group position={hotspot.position}>
      <mesh position={[0, 0.36, 0]} renderOrder={98}>
        <cylinderGeometry args={[0.012, 0.012, 0.72, 12]} />
        <meshBasicMaterial
          color={accent}
          depthTest={false}
          depthWrite={false}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Billboard position={[0, 0.82, 0]} follow>
        <group
          scale={hovered || active ? 1.1 : 1}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0.18, 0, -0.02]} renderOrder={97}>
            <planeGeometry args={[width + 0.72, 0.58]} />
            <meshBasicMaterial
              transparent
              opacity={0.001}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          <group
            ref={pulseRef}
            position={[-width / 2 - 0.22, 0, 0.04]}
          >
            <mesh renderOrder={102}>
              <ringGeometry args={[0.11, 0.15, 36]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={0.95}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, 0, 0.008]} renderOrder={103}>
              <circleGeometry args={[0.045, 28]} />
              <meshBasicMaterial
                color="#eee9de"
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          </group>

          <RoundedBox
            args={[width, 0.34, 0.045]}
            radius={0.1}
            smoothness={5}
            position={[0.18, 0, 0]}
            renderOrder={100}
          >
            <meshBasicMaterial
              color={active ? "#292927" : "#eee9de"}
              transparent
              opacity={0.98}
              depthTest={false}
              depthWrite={false}
            />
          </RoundedBox>

          <Text
            position={[0.18, 0, 0.04]}
            fontSize={0.105}
            letterSpacing={0.055}
            color={active ? "#eee9de" : "#292927"}
            anchorX="center"
            anchorY="middle"
            renderOrder={104}
            material-depthTest={false}
            material-depthWrite={false}
          >
            {hotspot.label.toUpperCase()}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}

function HotelDuLacHotspots({
  activeHotspotId,
  onSelectHotspot,
}: {
  activeHotspotId?: string;
  onSelectHotspot: (hotspot: HotelHotspot) => void;
}) {
  return (
    <group>
      {hotelDuLacHotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          active={activeHotspotId === hotspot.id}
          onSelect={() => onSelectHotspot(hotspot)}
        />
      ))}
    </group>
  );
}

export function CotonouScene({
  onSelectHotel,
  onSelectHotspot,
  activeHotelId,
  focusHotelId,
  activeHotspotId,
  showHotspots = false,
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

      {hotelStudies.map((hotel) => (
        <HotelMarker
          key={hotel.id}
          hotel={hotel}
          active={activeHotelId === hotel.id}
          focused={focusHotelId === hotel.id}
          onSelect={() => onSelectHotel(hotel)}
        />
      ))}

      {showHotspots && focusHotelId === "hotel-du-lac" && (
        <HotelDuLacHotspots
          activeHotspotId={activeHotspotId}
          onSelectHotspot={onSelectHotspot}
        />
      )}

      <CameraRig
        focusHotelId={focusHotelId}
        activeHotspotId={activeHotspotId}
      />
    </>
  );
}
