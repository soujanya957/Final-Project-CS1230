import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Water({ position, size = [5, 5], waveSpeed = 0.1 }) {
  const waterRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const geometry = waterRef.current.geometry;
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.sin(positions[i] * 0.3 + time * waveSpeed) * 0.2;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh position={position} ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size[0], size[1], 50, 50]} />
      <meshPhysicalMaterial
        color="#4fa4f6"
        roughness={0.3}
        metalness={0.5}
        clearcoat={1}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}