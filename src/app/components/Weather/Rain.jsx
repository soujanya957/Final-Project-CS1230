import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import PropTypes from "prop-types";
import Clouds from "./Clouds";

export default function Rain({ position = [0, 0, 0], radius, intensity }) {
  const rainref = useRef();
  const lightningRef = useRef();
  const lightningMeshRef = useRef();
  const [lightningVisible, setLightningVisible] = React.useState(false);
  const [lightningPosition, setLightningPosition] = React.useState(null);

  const { scene, camera } = useThree();

  const speedIntensity = Math.max(2.0, intensity * 5.0);
  const num_rain = Math.max(1, Math.floor(150 * intensity));
  const rainArray = new Float32Array(num_rain * 3);

  const texture = new THREE.TextureLoader().load("/textures/raindrop.png");

  const initializeRain = (rainArray) => {
    for (let i = 0; i < num_rain; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * (radius - 0.5);
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      rainArray[i * 3] = x;
      rainArray[i * 3 + 1] = Math.random() * 4 + 7;
      rainArray[i * 3 + 2] = z;
    }
  };

  const updateRain = (rainArray) => {
    for (let i = 0; i < num_rain; i++) {
      rainArray[i * 3 + 1] -= 0.01 * speedIntensity;
      if (rainArray[i * 3 + 1] < 10) {
        rainArray[i * 3 + 1] = Math.random() * 3 + 10;
      }
    }
  };

  useEffect(() => {
    initializeRain(rainArray);

    if (rainref.current) {
      rainref.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(rainArray, 3)
      );
    }
  }, [rainArray]);

  useFrame(() => {
    if (rainref.current) {
      updateRain(rainArray);
      if (rainref.current.geometry.attributes) {
        rainref.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Randomly toggle lightning visibility
    if (Math.random() < 0.005) {
      const lightningStartX = position[0] + (Math.random() - 0.5) * radius * 2;
      const lightningStartY = position[1] + 5;
      const lightningStartZ = position[2] + (Math.random() - 0.5) * radius * 2;
      
      setLightningPosition([lightningStartX, lightningStartY, lightningStartZ]);
      setLightningVisible(true);
      setTimeout(() => setLightningVisible(false), 200); // Lightning lasts 200ms
    }
  });

  // Lightning bolt geometry
  const createLightning = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    if (!lightningPosition) return geometry;

    const [startX, startY, startZ] = lightningPosition;

    const endX = startX + (Math.random() - 0.5) * radius * 0.2;
    const endY = position[1]; // Ground level
    const endZ = startZ + (Math.random() - 0.5) * radius * 0.2;

    // Generate intermediate points for jagged path
    const numSegments = 6; // Number of segments
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      const x = THREE.MathUtils.lerp(startX, endX, t) + (Math.random() - 0.5) * 0.3;
      const y = THREE.MathUtils.lerp(startY, endY, t);
      const z = THREE.MathUtils.lerp(startZ, endZ, t) + (Math.random() - 0.5) * 0.3;
      vertices.push(x, y, z);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  };

  return (
    <>
      <group>
        {/* Rain */}
        <points ref={rainref} position={[position[0], position[1] - 11, position[2]]} renderOrder={1}>
          <pointsMaterial size={0.07} map={texture} transparent={true} />
        </points>

        {/* Clouds */}
        <Clouds position={[position[0], position[1] - 11, position[2]]} radius={radius - 1} weatherType={"rain"} />

        {/* Lightning */}
        {lightningVisible && lightningPosition && (
          <>
            <line ref={lightningRef} position={[position[0], position[1] - 11, position[2]]}>
              <bufferGeometry attach="geometry" {...createLightning()} />
              <lineBasicMaterial 
                attach="material" 
                color="white" 
                linewidth={5} 
                transparent={true}
                opacity={0.8}
              />
            </line>

            {/* Mesh for Selective Bloom */}
            <mesh 
              ref={lightningMeshRef} 
              position={lightningPosition}
              visible={false}
            >
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>

            {/* Selective Bloom Effect */}
            <EffectComposer>
              <SelectiveBloom 
                selection={[lightningMeshRef.current]} 
                intensity={3} 
                kernelSize={5} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.5}
              />
            </EffectComposer>
          </>
        )}
      </group>
    </>
  );
}

// PropTypes validation
Rain.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number.isRequired,
  intensity: PropTypes.number.isRequired,
};