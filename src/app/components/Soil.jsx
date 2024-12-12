import React, { useMemo } from "react";
import * as THREE from "three";

export default function Soil({ innerRadius, position }) {
const soilHeight = 0.5; // Adjust this value for the desired height of the soil
const geometry = useMemo(() => {
  const sphereGeom = new THREE.SphereGeometry(innerRadius, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2 + soilHeight); // Control the height of the soil
  return sphereGeom;
}, [innerRadius, soilHeight]);

  const soilTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      "/textures/soil_texture.jpeg",
      () => console.log("Soil texture loaded"),
      undefined,
      (err) => console.error("Soil texture load error", err)
    );
  }, []);

  return (
    <mesh geometry={geometry} position={position} receiveShadow castShadow>
      <meshPhongMaterial map={soilTexture} />
    </mesh>
  );
}
