import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PlayerMovement = () => {
  const speed = 0.05;
  const direction = useRef(new THREE.Vector3());
  const keys = useRef({});

  // Key press event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update camera position in the render loop
  useFrame(({ camera }) => {
    // Reset direction each frame
    direction.current.set(0, 0, 0);

    // Calculate movement based on camera's current orientation
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Flatten the direction to only move on the horizontal plane
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Create a perpendicular vector for strafing (RIGHT side)
    const strafeDirection = new THREE.Vector3(
      cameraDirection.z,
      0,
      -cameraDirection.x
    );

    // Forward and backward movement (relative to camera direction)
    if (keys.current['w']) {
      direction.current.add(cameraDirection.clone().multiplyScalar(speed));
    }
    if (keys.current['s']) {
      direction.current.sub(cameraDirection.clone().multiplyScalar(speed));
    }

    // Left and right strafing
    if (keys.current['a']) {
      direction.current.sub(strafeDirection.clone().multiplyScalar(speed));
    }
    if (keys.current['d']) {
      direction.current.add(strafeDirection.clone().multiplyScalar(speed));
    }

    // Vertical movement
    if (keys.current[' ']) { // Space to go up
      direction.current.y += speed;
    }
    if (keys.current['meta']) { // Command (meta) key to go down
      direction.current.y -= speed;
    }

    // Apply movement
    if (direction.current.length() > 0) {
      camera.position.add(direction.current);
    }
  });

  return null;
};

export default PlayerMovement;