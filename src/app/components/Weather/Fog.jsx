import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Fog = ({ radius, intensity }) => {
  const fogRef = useRef();

  useFrame(() => {
    if (fogRef.current) {
      // Pulsating opacity effect
      fogRef.current.material.opacity =
        0.2 + Math.sin(Date.now() * 0.0005) * 0.05 * intensity;
    }
  });

  return (
    <mesh ref={fogRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        transparent
        opacity={0.3 * (intensity / 5)}
        color={0xf0f0f0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Fog;