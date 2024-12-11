import React, { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const num_particles = 75; // Number of points in the cloud (adjust for performance)

export default function Clouds({ position, radius, weatherType }) {
  const [cloudPoints, setCloudPoints] = useState(null); // Store the cloud points in state
  const [isThundering, setIsThundering] = useState(false); // Control thunder state
  const [flashColor, setFlashColor] = useState(0xffffe0); // Store the current flash color
  const [lightningStrike, setLightningStrike] = useState(null); // Lightning geometry

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("textures/clouds.webp", (texture) => {
      // Create a geometry for the points (particles)
      const geometry = new THREE.BufferGeometry();
      const positions = [];

      // Create points (particles) within a spherical region
      for (let i = 0; i < num_particles; i++) {
        const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 2π)
        const distance = Math.sqrt(Math.random()) * radius; // Random distance within radius
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.random() * 0.75 + 12; // Cloud height
        positions.push(x, y, z);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        map: texture,
        transparent: true,
        opacity: 0.7,
        alphaTest: 0.5,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      setCloudPoints(points);
    });
  }, [radius]);

  useFrame(() => {
    if (weatherType === "rain") {
      // Randomly trigger thunder
      if (Math.random() < 0.01) {
        setFlashColor(Math.random() < 0.5 ? 0xffffe0 : 0xadd8e6); // Yellow or Blue flash
        setIsThundering(true);

        // Randomly select a point in the cloud for lightning
        const startX = Math.random() * radius - radius / 2;
        const startY = 12 + Math.random() * 0.75;
        const startZ = Math.random() * radius - radius / 2;

        const endX = startX + (Math.random() - 0.5) * 0.5; // Slight horizontal variation
        const endY = startY - (1 + Math.random() * 1.5); // Random height for the strike
        const endZ = startZ + (Math.random() - 0.5) * 0.5;

        const lightningGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(startX, startY, startZ),
          new THREE.Vector3(endX, endY, endZ),
        ]);

        const lightningMaterial = new THREE.LineBasicMaterial({
          color: flashColor,
          transparent: true,
          opacity: 1,
        });

        const lightning = new THREE.Line(lightningGeometry, lightningMaterial);
        setLightningStrike(lightning);

        // Remove the lightning after a short duration
        setTimeout(() => {
          setIsThundering(false);
          setLightningStrike(null);
        }, 200);
      }

      if (cloudPoints) {
        const material = cloudPoints.material;
        material.color.set(isThundering ? flashColor : 0xffffff);
        material.opacity = isThundering ? 1.0 : 0.7;
      }
    }
  });

  return (
    <group position={position}>
      {cloudPoints && <primitive object={cloudPoints} />}
      {lightningStrike && <primitive object={lightningStrike} />}
    </group>
  );
}