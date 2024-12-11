import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PlayerMovement = () => {
  const speed = 0.075;
  const direction = useRef(new THREE.Vector3());
  const keys = useRef({});
  const cubeRef = useRef();
  const [showCube, setShowCube] = useState(false); // State to manage cube invisibility for start

  // Key press event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key.toLowerCase()] = true;

      // Toggle cube visibility with "t" key
      if (event.key.toLowerCase() === 't') {
        setShowCube((prev) => !prev); // Toggle the cube visibility
      }
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

  // Update camera and cube position in the render loop
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
    if (keys.current['u']) { // Move cube up
      direction.current.y += speed;
    }
    if (keys.current['p']) { // Move cube down
      direction.current.y -= speed;
    }

    // Apply movement to camera
    if (direction.current.length() > 0) {
      camera.position.add(direction.current);
    }

    // Position the cube directly in front of the camera if it's being shown
    if (showCube && cubeRef.current) {
      const distanceInFront = 1.5; // Distance in front of the camera
      const heightOffset = -0.5; // Adjust this to lower or raise the cube

      cubeRef.current.position.copy(
        camera.position
          .clone()
          .add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(distanceInFront))
          .add(new THREE.Vector3(0, heightOffset + direction.current.y, 0)) // Adjust position based on up/down movement
      );

      // Match the cube's rotation to the camera's rotation
      cubeRef.current.rotation.copy(camera.rotation);
    }
  });

  return (
    <>
      {/* Player Character (Cube) */}
      {showCube && ( // Conditionally render the cube
        <mesh ref={cubeRef} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} /> {/* Dimensions of the cube */}
          <meshStandardMaterial color="orange" />
        </mesh>
      )}
    </>
  );
};

export default PlayerMovement;