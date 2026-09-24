"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, ShaderMaterial } from "three";

type AnimatedWaterSurfaceProps = {
  position: [number, number, number];
  size: [number, number];
  color?: string;
  lightColor?: string;
  amplitude?: number;
  speed?: number;
  opacity?: number;
  segments?: [number, number];
};

const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uSpeed;

  varying float vWave;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 transformed = position;

    float waveA = sin((position.x * 1.45) + (uTime * uSpeed)) * 0.55;
    float waveB = cos((position.y * 1.9) - (uTime * uSpeed * 0.72)) * 0.35;
    float waveC = sin(((position.x + position.y) * 2.4) + (uTime * uSpeed * 0.45)) * 0.10;

    float wave = (waveA + waveB + waveC) * uAmplitude;
    transformed.z += wave;
    vWave = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uLightColor;
  uniform float uTime;
  uniform float uOpacity;

  varying float vWave;
  varying vec2 vUv;

  void main() {
    float shimmer =
      sin((vUv.x * 18.0) + (uTime * 0.55)) *
      cos((vUv.y * 13.0) - (uTime * 0.38));

    float mixAmount = clamp(0.24 + (vWave * 5.0) + (shimmer * 0.055), 0.0, 0.46);
    vec3 color = mix(uColor, uLightColor, mixAmount);

    gl_FragColor = vec4(color, uOpacity);
  }
`;

export function AnimatedWaterSurface({
  position,
  size,
  color = "#6f858b",
  lightColor = "#9db0b4",
  amplitude = 0.035,
  speed = 0.72,
  opacity = 0.92,
  segments = [72, 28],
}: AnimatedWaterSurfaceProps) {
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uSpeed: { value: speed },
      uColor: { value: new Color(color) },
      uLightColor: { value: new Color(lightColor) },
      uOpacity: { value: opacity },
    }),
    [amplitude, speed, color, lightColor, opacity],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[size[0], size[1], segments[0], segments[1]]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={opacity < 1}
        side={DoubleSide}
        depthWrite={opacity >= 0.98}
      />
    </mesh>
  );
}
