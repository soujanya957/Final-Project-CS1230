import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const Firefly = ({
  light = false,
  bodyColor = 0xffe066, // Yellow body
  wingColor = 0xffd700, // Golden yellow wings
  lightColor = 0xffff00, // Bright yellow light
  initialPosition = [0, 0, 0],
}) => {
  const groupRef = useRef(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const scale = 0.05; // Smaller scale

    // Body
    const flyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.9, 4); // Adjusted dimensions
    const flyMaterial = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 1,
      flatShading: true,
    });
    const body = new THREE.Mesh(flyGeometry, flyMaterial);
    body.rotation.y = 45 * (Math.PI / 180);
    group.add(body);

    // Right Wing
    const wingGeometry = new THREE.BoxGeometry(0.25, 0.6, 0.6); // Adjusted dimensions
    wingGeometry.translate(0, -0.3, 0);

    const rightWing = new THREE.Mesh(
      wingGeometry,
      new THREE.MeshStandardMaterial({
        color: wingColor,
        roughness: 1,
        flatShading: true,
      })
    );
    rightWing.position.set(0.4, 0.1, 0);
    rightWing.rotation.z = Math.PI / 4;
    group.add(rightWing);

    // Left Wing
    const leftWing = rightWing.clone();
    leftWing.position.x = -0.4;
    leftWing.rotation.z = -Math.PI / 4;
    group.add(leftWing);

    // Light
    if (light) {
      const pointLight = new THREE.PointLight(lightColor, 1, 5); // Static yellow light
      pointLight.position.set(0, -0.5, 0);
      group.add(pointLight);
    }

    // Set initial position and scale
    group.position.set(...initialPosition);
    group.scale.set(scale, scale, scale);

    // Cleanup function
    return () => {
      flyGeometry.dispose();
      flyMaterial.dispose();
      wingGeometry.dispose();
      rightWing.material.dispose();
      leftWing.material.dispose();
    };
  }, [bodyColor, wingColor, lightColor, light, initialPosition]);

  return (
    <group ref={groupRef}>
      {/* Add Text */}
      <Text
        position={[1, 0, 0]} // Offset from the firefly
        fontSize={0.2}
        color="yellow" // Yellow text
      >
        hello
      </Text>
    </group>
  );
};

export default Firefly;
