import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Grass({ 
  terrainData, 
  density = 5000, 
  windSpeed = 1, 
  clumping = 0.5 
}) {
  const grassRef = useRef();
  const clock = useRef(new THREE.Clock());

  // Create a more realistic grass blade geometry
  const bladeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    
    // More organic grass blade shape with curved segments
    const grassBladeVertices = [];
    const grassBladeIndices = [];

    // Base parameters for grass blade
    const bladeWidth = 0.025;
    const bladeHeight = 0.15;
    const segments = 8;

    // Generate vertices with natural curve
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      
      // Create natural curve - more bend towards the top
      const curveFactor = Math.pow(progress, 2);
      const sidewaysBend = Math.sin(progress * Math.PI) * 0.03 * curveFactor;
      
      // Left and right vertices
      grassBladeVertices.push(
        -bladeWidth/2 + sidewaysBend, 
        progress * bladeHeight, 
        0
      );
      grassBladeVertices.push(
        bladeWidth/2 + sidewaysBend, 
        progress * bladeHeight, 
        0
      );
    }

    // Create triangles connecting the vertices
    for (let i = 0; i < segments; i++) {
      const bottomLeft = i * 2;
      const bottomRight = i * 2 + 1;
      const topLeft = (i + 1) * 2;
      const topRight = (i + 1) * 2 + 1;

      grassBladeIndices.push(bottomLeft, bottomRight, topLeft);
      grassBladeIndices.push(bottomRight, topRight, topLeft);
    }

    // Convert to Float32Array and Uint16Array
    const vertices = new Float32Array(grassBladeVertices);
    const indices = new Uint16Array(grassBladeIndices);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  // Generate grass blade geometries with improved clumping
  const grassData = useMemo(() => {
    const positions = [];
    const scales = [];
    const offsets = [];
    const orientations = []; // To store quaternion orientations
    const stretches = []; // To vary height of grass blades

    const { positions: terrainPositions } = terrainData;
    const terrainPositionArray = new Float32Array(terrainPositions);

    for (let i = 0; i < density; i++) {
      // Clumping logic: reduce randomness based on clumping factor
      const randomness = 1 - clumping;

      // Randomly pick a position from the terrain with clumping consideration
      const index = Math.floor(Math.random() * (terrainPositionArray.length / 3)) * 3;
      const x = terrainPositionArray[index] + 
        (Math.random() - 0.5) * randomness * 0.5;
      const y = terrainPositionArray[index + 1];
      const z = terrainPositionArray[index + 2] + 
        (Math.random() - 0.5) * randomness * 0.5;

      positions.push(x, y, z);

      // Varied scale with clumping influence
      const baseScale = 0.5 + Math.random() * 0.5;
      scales.push(baseScale * (1 + clumping * 0.5)); 

      // Random offset for more natural swaying
      offsets.push(Math.random() * Math.PI * 2);

      // Define random growth directions using quaternions
      const quaternion = new THREE.Quaternion();
      const rotationAxes = [
        new THREE.Vector3(0, 1, 0), // Y
        new THREE.Vector3(1, 0, 0), // X
        new THREE.Vector3(0, 0, 1), // Z
      ];

      // Apply random rotations around each axis
      for (const axis of rotationAxes) {
        const angle = Math.random() * (Math.PI / 4); // Adjust range as needed
        const x = axis.x * Math.sin(angle / 2);
        const y = axis.y * Math.sin(angle / 2);
        const z = axis.z * Math.sin(angle / 2);
        const w = Math.cos(angle / 2);
        const quaternionPart = new THREE.Quaternion(x, y, z, w);
        quaternion.multiply(quaternionPart); // Combine rotations
      }

      orientations.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

      // Define variety in height
      stretches.push(i < density / 3 ? Math.random() * 1.8 : Math.random());
    }

    return { positions, scales, offsets, orientations, stretches };
  }, [terrainData, density, clumping]);

  // Animation for grass swaying with more dynamic movement
  useFrame(() => {
    const elapsedTime = clock.current.getElapsedTime();

    for (let i = 0; i < density; i++) {
      const dummy = new THREE.Object3D();

      const positionIndex = i * 3;
      dummy.position.set(
        grassData.positions[positionIndex],
        grassData.positions[positionIndex + 1],
        grassData.positions[positionIndex + 2]
      );

      // Apply quaternion orientation
      const quaternionIndex = i * 4;
      dummy.quaternion.set(
        grassData.orientations[quaternionIndex],
        grassData.orientations[quaternionIndex + 1],
        grassData.orientations[quaternionIndex + 2],
        grassData.orientations[quaternionIndex + 3]
      );

      // More complex swaying with additional noise
      const sway = Math.sin(elapsedTime * windSpeed + grassData.offsets[i]) * 0.05;
      dummy.rotation.z += sway; // Adjusting rotation based on sway

      dummy.scale.set(
        grassData.scales[i] * grassData.stretches[i], 
        grassData.scales[i], 
        grassData.scales[i]
      );

      dummy.updateMatrix();
      grassRef.current.setMatrixAt(i, dummy.matrix);
    }

    grassRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={grassRef}
      args={[
        bladeGeometry, 
        new THREE.MeshPhongMaterial({ 
          color: "green", 
          side: THREE.DoubleSide,
          flatShading: false 
        }), 
        density
      ]}
    />
  );
}