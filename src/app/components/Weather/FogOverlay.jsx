// FogOverlay.js
import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FogOverlay = ({ isInsideFog }) => {
  const fogRef = useRef();

  // Update the position of the fog overlay to follow the camera
  useFrame(({ camera }) => {
    if (isInsideFog && fogRef.current) {
      // Position the fog overlay in front of the camera
      fogRef.current.position.copy(camera.position);
      fogRef.current.position.z -= 5; // Adjust the distance as needed
      fogRef.current.lookAt(camera.position.x, camera.position.y, camera.position.z + 1);
    }
  });

  if (!isInsideFog) return null; // Return null if not inside fog

  return (
    <mesh ref={fogRef}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        color="white"
        transparent
        opacity={0.5} // Adjust opacity for fog effect
        depthWrite={false} // Disable writing to depth buffer
      />
    </mesh>
  );
};

export default FogOverlay;