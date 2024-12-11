import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";

import Clouds from "./Clouds";

const Snow = ({ position = [0, -0.75, 0], radius, intensity, windSpeed }) => {
  const snowRef = useRef();
  
  // Increased from 300 to 600 to generate more snowflakes
  const num_snow = Math.max(1, Math.floor(50 * intensity * 2)); 
  const [snowArray] = useState(new Float32Array(num_snow * 3)); // Create a buffer for snowflakes

  // Texture Loader
  const textureLoader = new THREE.TextureLoader();
  const snowflakeTexture = textureLoader.load("textures/snowflake.png"); // Adjust the path as necessary

  // Initialize snowflakes positions
  const initializeSnow = (snowArray) => {
    for (let i = 0; i < num_snow; i++) {
      const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 2π)
      const distance = Math.random() * radius - 0.5; // Random distance within radius

      // Convert polar coordinates to Cartesian coordinates
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Set x, y, and z
      snowArray[i * 3] = x; // x-coordinate
      snowArray[i * 3 + 1] = Math.random() * radius * 0.5 + radius * 0.5 - 0.75 ; // y-coordinate (starting above the terrain)
      snowArray[i * 3 + 2] = z; // z-coordinate
    }
  };

  // Update snowflakes position
  const updateSnow = (snowArray) => {
    for (let i = 0; i < num_snow; i++) {
      snowArray[i * 3 + 1] -= 0.005 * windSpeed; // Increased falling speed
      
      if (snowArray[i * 3 + 1] < -0.25) {
        // Reset snowflakes if they go below the terrain
        snowArray[i * 3 + 1] = Math.random() * radius * 0.5 + radius * 0.5 - 0.75; // Random height above the terrain
        
        // Regenerate x and z positions to maintain circular distribution
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * (radius - 0.5);
        snowArray[i * 3] = Math.cos(angle) * distance; // Random x position
        snowArray[i * 3 + 2] = Math.sin(angle) * distance; // Random z position
      }
    }
  };

  // Initialize the snow on component mount
  useEffect(() => {
    // Initialize snow positions only once
    initializeSnow(snowArray);

    if (snowRef.current) {
      snowRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(snowArray, 3)
      );
    }
  }, [snowArray]);

  // Update the snow's positions to animate falling
  useFrame(() => {
    if (snowRef.current) {
      updateSnow(snowArray);

      // Only update the position attribute if it exists
      if (snowRef.current.geometry.attributes) {
        snowRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <points ref={snowRef} position={position} renderOrder={1}>
        <pointsMaterial
          size={0.1} // Adjust size as needed
          map={snowflakeTexture} // Use the snowflake texture
          transparent={true}
          depthTest={false} // Optional: to make overlapping flakes more visible
          opacity={0.8} // Optional: adjust opacity if needed
        />
      </points>
      <Clouds position={[position[0], position[1] - 10, position[2]]} radius={radius - 1.5} weatherType={"snow"}/>
    </group>
  );
};

// PropTypes validation
Snow.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number.isRequired,
  intensity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number,
};

export default Snow;