import React, { useState, useEffect } from "react";
import * as THREE from "three";

const num_particles = 75; // Number of points in the cloud (adjust for performance)

export default function Clouds({ position, radius }) {
  const [cloudPoints, setCloudPoints] = useState(null); // Store the cloud points in state

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("textures/clouds.webp", (texture) => {
      // Create a geometry for the points (particles)
      const geometry = new THREE.BufferGeometry();
      const positions = [];

      // Create points (particles) within a spherical region
      for (let i = 0; i < num_particles; i++) {

         // Generate random angle and distance within the circular radius
         const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 2π)
         const distance = Math.sqrt(Math.random()) * radius; // Random distance within radius
         
         // Convert polar coordinates to Cartesian coordinates
         const x = Math.cos(angle) * distance;
         const z = Math.sin(angle) * distance;
         const y = Math.random() * 0.75 + 12;

        positions.push(x, y, z);
      }

      // Set the geometry attributes
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    //   geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    //   geometry.setAttribute("opacity", new THREE.Float32BufferAttribute(opacities, 1));

      // Create the material for the points (particles) with the texture
      const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        map: texture, // Use the loaded texture
        transparent: true,
        opacity: 0.7,
        alphaTest: 0.5, // Adjust this for visibility
        blending: THREE.AdditiveBlending, // Helps create a glowing effect
      });

      // Create the points (cloud particles)
      const points = new THREE.Points(geometry, material);
      setCloudPoints(points); // Store the cloud points in state
    });
  }, [radius]); // Re-run if the radius or textureUrl prop changes

  return (
    <group position={position}>
      {cloudPoints && <primitive object={cloudPoints} />}
    </group>
  );
}




//   // Function to initialize rain particles
//   const initializeRain = (rainArray) => {
//     for (let i = 0; i < num_rain; i++) {
//       // Generate random angle and distance within the circular radius
//       const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 2π)
//       const distance = Math.sqrt(Math.random()) * radius; // Random distance within radius

//       // Convert polar coordinates to Cartesian coordinates
//       const x = Math.cos(angle) * distance;
//       const z = Math.sin(angle) * distance;

//       // Set x, y, and z
//       rainArray[i * 3] = x; // x-coordinate
//       rainArray[i * 3 + 1] = Math.random() * 4 + 7; // y-coordinate (height, falling down)
//       rainArray[i * 3 + 2] = z; // z-coordinate
//     }
//   };

//   // Function to update the rain's position
//   const updateRain = (rainArray) => {
//     for (let i = 0; i < num_rain; i++) {
//       rainArray[i * 3 + 1] -= 0.06; // Make the raindrops fall
//       if (rainArray[i * 3 + 1] < 10) {
//         // Reset raindrops off-screen
//         rainArray[i * 3 + 1] = Math.random() * 3 + 10;
//       }
//     }
//   };

//   // Initialize the rain on component mount
//   useEffect(() => {
//     // Initialize rain positions only once
//     initializeRain(rainArray);

//     if (rainref.current) {
//       rainref.current.geometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(rainArray, 3)
//       );
//     }
//   }, [rainArray]);

//   // Update the rain's positions to animate falling
//   useFrame(() => {
//     if (rainref.current) {
//       updateRain(rainArray);

//       // Only update the position attribute if it exists
//       if (rainref.current.geometry.attributes) {
//         rainref.current.geometry.attributes.position.needsUpdate = true;
//       }
//     }
//   });
