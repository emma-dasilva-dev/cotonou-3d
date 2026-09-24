"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { HotelStudy, hotelStudies } from "./hotels";

type CotonouSceneProps = {
  onSelectHotel: (hotel: HotelStudy) => void;
  activeHotelId?: string;
};

type Block = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
};

function CityBlocks() {
  const blocks = useMemo<Block[]>(() => {
    const result: Block[] = [];

    for (let row = 0; row < 7; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        if ((row + column) % 5 === 0 || column === 4) continue;

        const width = 0.52 + ((column * 3 + row) % 4) * 0.08;
        const depth = 0.48 + ((row * 5 + column) % 3) * 0.09;
        const height = 0.18 + ((row * 7 + column * 2) % 6) * 0.09;

        result.push({
          key: `${row}-${column}`,
          position: [
            -6.3 + column * 1.4,
            height / 2,
            -4.1 + row * 1.35,
          ],
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
        <mesh key={x} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
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
  onSelect,
}: {
  hotel: HotelStudy;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <group position={hotel.position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.36, 0.64]} />
        <meshStandardMaterial
          color={active ? "#292927" : "#827d73"}
          roughness={0.82}
        />
      </mesh>

      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.92, 10]} />
        <meshBasicMaterial color="#292927" />
      </mesh>

      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.07, 18, 18]} />
        <meshBasicMaterial color="#292927" />
      </mesh>

      <Html
        center
        position={[0, 1.62, 0]}
        distanceFactor={8.5}
        zIndexRange={[20, 0]}
      >
        <button
          type="button"
          className={`hotel-marker${active ? " hotel-marker--active" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          aria-label={`Select ${hotel.name}`}
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

      {hotelStudies.map((hotel) => (
        <HotelMarker
          key={hotel.id}
          hotel={hotel}
          active={activeHotelId === hotel.id}
          onSelect={() => onSelectHotel(hotel)}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={8.5}
        maxDistance={20}
        minPolarAngle={0.55}
        maxPolarAngle={1.18}
        target={[0, 0, 0.2]}
      />
    </>
  );
}
