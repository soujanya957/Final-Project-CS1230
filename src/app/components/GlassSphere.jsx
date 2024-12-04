import React from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { BackSide } from "three";

export default function GlassSphere() {
  const materialProps = useControls({
    thickness: { value: 2.8, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.5, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.1, min: 0, max: 1 },
    backside: { value: true },
  });

  return (
    <>
      {/* Outer sphere */}
      <mesh castShadow recieveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshTransmissionMaterial {...materialProps} color="white" />
      </mesh>

      {/* Inner sphere */}
      <mesh scale={0.8} castShadow recieveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          side={BackSide}
          color="white"
        />
      </mesh>
    </>
  );
}
