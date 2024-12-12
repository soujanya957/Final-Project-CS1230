import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { useThree, useFrame } from "@react-three/fiber";

import { Boids } from ".//Boids";
import Terrain from "./Terrain";
import WavyPond from "./Pond";
import Weather from "./Weather";
import FogOverlay from "./Weather/FogOverlay";
import Soil from "./Soil";


export default function GlassSphere({ position }) {
  const radius = 3;
  
  // Control parameter for glass thickness
  const { thickness } = useControls("Glass Material", {
    thickness: { value: 0.2, min: 0, max: 5, step: 0.1 }, // Control for glass thickness
  });

  // Calculate the inner radius based on the thickness
  const innerRadius = 3 - thickness; // Adjust 3 based on the outer sphere radius

  // const pondRef = useRef();

  // Access the camera using useThree
  const { camera, scene } = useThree(); // Correctly access the camera

  // Determine if the camera is inside the glass sphere (fog area)
  const isInsideGlassSphere = () => camera.position.length() <= radius;

  // Weather controls
  const { weatherType, intensity, windSpeed } = useControls("Weather", {
    weatherType: {
      value: "rainy",
      options: ["sunny", "rainy", "foggy", "snowy"], // Available weather types
    },
    intensity: { value: 1, min: 1, max: 10, step: 0.1 },
    windSpeed: { value: 2, min: 0.1, max: 10, step: 0.5 },
  });

  // Fog settings
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0xb0c4de, 0.1); // Light Steel Blue fog
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Animation loop to check camera position and weather type
  useFrame(() => {
    const isInsideGlassSphere = camera.position.length() < innerRadius;

    // Update fog parameters based on camera position and weather type
    if (
      isInsideGlassSphere &&
      (weatherType === "foggy" || weatherType === "snowy")
    ) {
      scene.fog.color.set(0xb0e0e6); // Powder Blue for fog
      const effectiveIntensity = intensity > 2 ? intensity / 2 : 1;
      scene.fog.density = 0.25 * effectiveIntensity; // Increase density for visibility
    } else {
      scene.fog.color.set(0xffffff); // Default color outside
      scene.fog.density = 0.0; // No fog outside or when not foggy
    }

    // Swaying effect for terrain or other elements
    const terrain = scene.getObjectByName("terrain");
    if (terrain) {
      const time = Date.now() * 0.001; // Get the current time
      terrain.rotation.z = Math.sin(time * 2) * 0.05; // Swaying effect
      terrain.rotation.x = Math.cos(time * 2) * 0.02; // Slight tilt
    }
  });

  const materialRef = useRef();
  const frostColor = useRef(new THREE.Color("white")); // Initial sphere color

  useFrame(() => {
    if (materialRef.current) {
      if (weatherType === "snowy") {
        // Gradually transition to blue
        frostColor.current.lerp(new THREE.Color("lightblue"), 1); // change to 0.2 for faster transition to blue
      } else {
        // Reset to white if not snowy
        frostColor.current.lerp(new THREE.Color("white"), 0.1); // change to 0.2 for faster transition to white
      }
      // Apply the updated color
      materialRef.current.color.copy(frostColor.current);
    }
  });

  return (
    <group position={position}>
      {/* Outer glass sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          thickness={thickness}
          transmission={1} // High value for clear glass
          roughness={0} // Default value for roughness
          ior={1.5} // Default index of refraction
          chromaticAberration={0.005} // Default chromatic aberration
          clearcoat={0.5} // Default clearcoat
          clearcoatRoughness={0.5} // Default clearcoat roughness
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner sphere to represent the thickness of the glass */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[innerRadius, 64, 64]} />
        <MeshTransmissionMaterial
          thickness={thickness}
          transmission={1} // High value for clear glass
          roughness={0} // Default value for roughness
          ior={1.5} // Default index of refraction
          chromaticAberration={0.005} // Default chromatic aberration
          clearcoat={0.5} // Default clearcoat
          clearcoatRoughness={0.5} // Default clearcoat roughness
          transparent
          opacity={0.0} // Make the inner sphere invisible
          backside={false} // Disable backside rendering for the inner layer
          depthWrite={false} // Disable depth writing for the inner layer
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ambient light inside the sphere */}
      <ambientLight intensity={1} color={0xffffff} />

    {/* <Soil innerRadius={innerRadius} /> */}
    <Terrain radius={innerRadius} castShadow receiveShadow />

      {/* Weather Effects */}
      <Weather
        weatherType={weatherType}
        intensity={intensity}
        windSpeed={windSpeed}
        radius={innerRadius} // Constrain effects to the sphere's inner radius
      />

      <WavyPond radius={innerRadius} />
    </group>
  );
}
