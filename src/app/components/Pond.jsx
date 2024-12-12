import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WavyPond({ radius = 2 }) {
  const meshRef = useRef();

  const pondGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const centerX = 0;
    const centerY = 0;
    const maxRadius = radius * 0.3;
    
    shape.moveTo(centerX + maxRadius, centerY);
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const radiusVariation = maxRadius * (0.8 + Math.sin(angle * 3) * 0.2);
      const x = centerX + Math.cos(angle) * radiusVariation;
      const y = centerY + Math.sin(angle) * radiusVariation;
      shape.lineTo(x, y);
    }
    
    const extrudeSettings = {
      steps: 1,
      depth: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.075,
      bevelSegments: 5
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    
    return geometry;
  }, [radius]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.getAttribute('position');
    
    if (!meshRef.current.geometry.attributes.originPosition) {
      meshRef.current.geometry.setAttribute(
        'originPosition', 
        new THREE.Float32BufferAttribute(positions.array.slice(), 3)
      );
    }
    
    const originalPositions = meshRef.current.geometry.attributes.originPosition.array;

    for (let i = 0; i < positions.count; i++) {
      const originalX = originalPositions[i * 3];
      const originalY = originalPositions[i * 3 + 1];
      const originalZ = originalPositions[i * 3 + 2];

      const distanceFromCenter = Math.sqrt(originalX * originalX + originalZ * originalZ);
      
      const wave1 = Math.sin(distanceFromCenter * 2 + time * 1.5) * 0.05;
      const wave2 = Math.cos(time * 1.2 + originalX * 0.3) * 0.04;
      const wave3 = Math.sin(originalZ * 0.4 + time * 0.8) * 0.03;

      const edgeFalloff = 1 - Math.min(1, distanceFromCenter / (radius * 0.7));
      
      if (originalY > 0) {
        positions.array[i * 3 + 1] = originalY + (wave1 + wave2 + wave3) * edgeFalloff;
      }
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation-x={-Math.PI / 2}
      position={[-1, radius-3.75, 1]}
      scale={[1, 1, 1]}
    >
      <primitive attach="geometry" object={pondGeometry} />
      <meshPhysicalMaterial 
        color="#4169E1" 
        transmission={0.8}
        roughness={0.2}
        thickness={0.05}
        ior={1.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
