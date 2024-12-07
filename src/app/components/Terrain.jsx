import React, { useMemo } from "react";
import * as THREE from "three";

export default function Terrain({ resolution = 100, radius }) {
  const grassTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      "/textures/grass.jpeg",
      () => console.log("Texture loaded"),
      undefined,
      (err) => console.error("Texture load error", err)
    );
  }, []);

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

  function generateTerrain(resolution, randomVectors, radius) {
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    const uvs = [];

    const getColor = (normal) => [
      Math.abs(normal[0]),
      Math.abs(normal[1]),
      Math.abs(normal[2]),
    ];

    for (let x = 0; x <= resolution; x++) {
      for (let y = 0; y <= resolution; y++) {
        const u = x / resolution;
        const v = y / resolution;

        const height = computePerlin(u * 16, v * 16, randomVectors) * 0.05;

        let posX = (u - 0.5) * 2 * radius;
        let posY = height * radius;
        let posZ = (v - 0.5) * 2 * radius;

        // Apply circular mask
        const distance = Math.sqrt(posX * posX + posZ * posZ);
        if (distance > radius) {
          const scale = radius / distance;
          posX *= scale;
          posZ *= scale;
        }

        positions.push(posX, posY, posZ);

        const normal = [0, 1, 0];
        normals.push(...normal);

        const color = getColor(normal);
        colors.push(...color);

        // Add UV coordinates
        uvs.push(u, v);

        // Add indices for triangles
        if (x < resolution && y < resolution) {
          const topLeft = x * (resolution + 1) + y;
          const topRight = topLeft + 1;
          const bottomLeft = (x + 1) * (resolution + 1) + y;
          const bottomRight = bottomLeft + 1;

          indices.push(topLeft, topRight, bottomLeft);
          indices.push(topRight, bottomRight, bottomLeft);
        }
      }
    }
    return { positions, normals, colors, indices, uvs };
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
    const data = generateTerrain(resolution, randomVectors, radius);

    // console.log("Terrain Colors:", data.colors);
    // console.log("Terrain Positions:", data.positions);
    // console.log("Terrain Normals:", data.normals);

    return data;
  }, [resolution]);

  // Create BufferGeometry and attach attributes
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(terrainData.positions), 3)
    );
    geom.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(terrainData.normals), 3)
    );
    geom.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(terrainData.uvs), 2)
    );
    geom.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(terrainData.colors), 3)
    );
    geom.setIndex(
      new THREE.BufferAttribute(new Uint32Array(terrainData.indices), 1)
    );
    return geom;
  }, [terrainData]);

  return (
    <>
      <mesh geometry={geometry} position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]}>
        {/* <bufferGeometry>
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
      </bufferGeometry> */}
        <meshPhongMaterial
          map={grassTexture}
          vertexColors={false}
          wireframe={false}
          flatShading={false}
        />
      </mesh>
    </>
  );
}
