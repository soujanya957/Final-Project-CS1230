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

const GlassSphere = () => {
  const materialProps = useControls({
    thickness: { value: 0.3, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.5, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.01, min: 0, max: 1 },
    backside: { value: true },
  });
  const sphereRef = useRef();

  //animates things
  // useFrame(() => {
  //   if (sphereRef.current) {
  //     sphereRef.current.rotation.y += 0.005;
  //   }
  // });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[2, 32, 32]} />
      {/* <meshPhysicalMaterial
        transmission={1} // Allows light to pass through (fully transmissive)
        thickness={0.5} // Simulates thickness for light refraction
        roughness={0} // Smooth surface (0 for perfect smoothness)
        metalness={0} // No metallic property
        ior={1.5} // Index of refraction for glass
        envMapIntensity={1} // Environment map intensity for reflections
        clearcoat={1} // Enhances surface reflections
        clearcoatRoughness={0} // Clear coat is smooth
        attenuationDistance={0} // Control light attenuation (0 for infinite)
        attenuationColor="white" // Light color passing through
        color="#ffffff" // Base color of the glass
      /> */}
      <MeshTransmissionMaterial {...materialProps} />
    </mesh>
  );
};

const Scene = () => {
  const orbitRef = useRef();
  return (
    <>
      <Leva />
      <Canvas
        gl={{
          outputEncoding: sRGBEncoding,
          toneMapping: ACESFilmicToneMapping,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        {/* <directionalLight position={[1, 2, 3]} intensity={0.8} /> */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />

        <GlassSphere />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        <OrbitControls ref={orbitRef} />
        <Environment files={"/studio.exr"} />
      </Canvas>
    </>
  );
};

export default Scene;
