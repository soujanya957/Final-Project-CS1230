import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const numRain = 150;

export default function NRain({ radius, pondRef, position }) {
  const rainRef = useRef();
  const rainArray = new Float32Array(numRain * 3);
  const texture = new THREE.TextureLoader().load("/textures/raindrop.png");

  // Initialize raindrops
  const initializeRain = () => {
    for (let i = 0; i < numRain; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * radius;

      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      rainArray[i * 3] = x;
      rainArray[i * 3 + 1] = Math.random() * 4 + 7;
      rainArray[i * 3 + 2] = z;
    }
  };

  // Update raindrop positions
  const updateRain = () => {
    for (let i = 0; i < numRain; i++) {
      rainArray[i * 3 + 1] -= 0.06;

      const x = rainArray[i * 3];
      const y = rainArray[i * 3 + 1];
      const z = rainArray[i * 3 + 2];

      if (y <= 0 && Math.sqrt(x * x + z * z) <= radius) {
        if (pondRef.current) pondRef.current.addRipple(x, z);
        rainArray[i * 3 + 1] = Math.random() * 4 + 7;
      }

      if (y < -2) {
        rainArray[i * 3 + 1] = Math.random() * 4 + 7;
      }
    }
  };

  useEffect(() => {
    initializeRain();
    if (rainRef.current) {
      rainRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(rainArray, 3)
      );
    }
  }, []);

  useFrame(() => {
    if (rainRef.current) {
      updateRain();
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={rainRef} position={position}>
      <bufferGeometry />
      <pointsMaterial
        size={0.07}
        map={texture}
        transparent={true}
        depthWrite={false}
        alphaTest={0.5}
      />
    </points>
  );
}