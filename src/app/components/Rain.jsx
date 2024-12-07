import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Rain() {
    const rainref = useRef();
  const [rainArray] = useState(new Float32Array(200 * 3));  // 200 particles, 3 values (x, y, z) each
  const [geometry] = useState(new THREE.BufferGeometry());  // BufferGeometry for the rain particles

  const texture = new THREE.TextureLoader().load('/textures/circular-texture.png');

  // Function to initialize rain particles
  const initializeRain = (rainArray) => {
    for (let i = 0; i < 200; i++) {
      rainArray[i * 3] = Math.random() * 3;        // Random x
      rainArray[i * 3 + 1] = Math.random() * 3 + 8;  // Random y (falling down)
      rainArray[i * 3 + 2] = Math.random() * 3;        // Random z
    }
  };

  // Function to update the rain's position
  const updateRain = (rainArray) => {
    for (let i = 0; i < 200; i++) {
      rainArray[i * 3 + 1] -= 0.05;  // Make the raindrops fall
      if (rainArray[i * 3 + 1] < 9) {
        rainArray[i * 3 + 1] = Math.random() * 3 + 10;  // Reset raindrops when they go off-screen
      }
    }
  };

  // Initialize the rain on component mount
  useEffect(() => {
    // Initialize rain positions only once
    initializeRain(rainArray);

    if (rainref.current) {
        rainref.current.geometry.setAttribute("position", new THREE.BufferAttribute(rainArray, 3));
    }
    //geometry.setAttribute("position", new THREE.BufferAttribute(rainArray, 3));  // Set position attribute

    // Ensure the geometry is properly initialized
    //geometry.attributes.position.needsUpdate = true;  // Mark the position attribute for update
  }, [rainArray]);

  // Update the rain's positions to animate falling
  useFrame(() => {
    if (rainref.current) {
        updateRain(rainArray);

        // Only update the position attribute if it exists
        if (rainref.current.geometry.attributes) {
            rainref.current.geometry.attributes.position.needsUpdate = true;
        }
    }
   
  });

  return (
    <points ref = {rainref} position={[-1.5, -10, -1.5]} castShadow receiveShadow>
      
      <pointsMaterial size={0.05} map={texture} transparent={true}/>
    </points>
  );
}
