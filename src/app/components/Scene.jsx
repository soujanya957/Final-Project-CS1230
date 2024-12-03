import React, { useRef } from "react";
import {
  Canvas,
  useFrame,
  sRGBEncoding,
  ACESFilmicToneMapping,
} from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { useControls, Leva } from "leva";
import { CSG } from "@react-three/csg";
import { BackSide } from "three";

const GlassSphere = ({ outerRadius, innerRadius }) => {
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
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      {/* Inner sphere */}
      <mesh scale={0.8}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          side={BackSide}
          color="87CEEB"
        />
      </mesh>
    </>
  );
};

const Scene = () => {
  const orbitRef = useRef();
  return (
    <>
      <Leva />
      <Canvas
        shadows
        gl={{
          outputEncoding: sRGBEncoding,
          toneMapping: ACESFilmicToneMapping,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        {/* <directionalLight position={[1, 2, 3]} intensity={0.8} /> */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.2}
          penumbra={0.5}
          intensity={1.5}
        />
        <directionalLight position={[-5, 5, 5]} intensity={1} />

        <GlassSphere outerRadius={5} innerRadius={2} />
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        <OrbitControls ref={orbitRef} />
        {/* makes it crash :( */}
        {/* <Environment files={"/studio.exr"} /> */}
      </Canvas>
    </>
  );
};

export default Scene;
