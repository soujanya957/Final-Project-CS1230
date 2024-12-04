import React from "react";
import { MeshStandardMaterial } from "three";

export default function Table() {
  return (
    <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[10, 1, 6]} /> {/* width, height, depth */}
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
