import React, { useMemo } from "react";

export default function Terrain({ resolution = 100 }) {
  function interpolate(A, B, alpha) {
    return A + (3 * alpha ** 2 - 2 * alpha ** 3) * (B - A);
  }
  function computePerlin(x, y, randomVectors) {
    const x1 = Math.floor(x);
    const x2 = x1 + 1;
    const y1 = Math.floor(y);
    const y2 = y1 + 1;

    const upperL = [x - x1, y - y1];
    const upperR = [x - x2, y - y1];
    const lowerR = [x - x2, y - y2];
    const lowerL = [x - x1, y - y2];

    const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

    const A = dot(upperL, randomVectors[`${x1},${y1}`] || [0, 0]);
    const B = dot(upperR, randomVectors[`${x2},${y1}`] || [0, 0]);
    const C = dot(lowerR, randomVectors[`${x2},${y2}`] || [0, 0]);
    const D = dot(lowerL, randomVectors[`${x1},${y2}`] || [0, 0]);

    const u = x - x1;
    const v = y - y1;

    const AB = interpolate(A, B, u);
    const DC = interpolate(D, C, u);

    return interpolate(AB, DC, v);
  }

  function generateTerrain(resolution, randomVectors) {
    const positions = [];
    const normals = [];
    const colors = [];

    // change this to get real colors
    const getColor = (normal) => [
      Math.abs(normal[0]),
      Math.abs(normal[1]),
      Math.abs(normal[2]),
    ];

    function sampleRandomVector(x, y) {
      return (
        randomVectors[`${x},${y}`] || [
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ]
      );
    }

    for (let x = 0; x <= resolution; x++) {
      for (let y = 0; y <= resolution; y++) {
        const height = computePerlin(
          x / resolution,
          y / resolution,
          randomVectors
        );

        const position = [
          (x * 2) / resolution,
          height * 3,
          (y * 2) / resolution,
        ];

        // change this to get real normals
        const normal = [0, 0, 1]; // Approximate normals for now

        positions.push(...position);
        normals.push(...normal);
        colors.push(...getColor(normal));
      }
    }

    return { positions, normals, colors };
  }

  const terrainData = useMemo(() => {
    const randomVectors = {};
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        randomVectors[`${i},${j}`] = [
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ];
      }
    }
    return generateTerrain(resolution, randomVectors);
  }, [resolution]);

  return (
    <mesh scale={[1, 1, 1]} position={[3, 1, 5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(terrainData.positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-normal"
          array={new Float32Array(terrainData.normals)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={new Float32Array(terrainData.colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial vertexColors wireframe />
    </mesh>
  );
}
