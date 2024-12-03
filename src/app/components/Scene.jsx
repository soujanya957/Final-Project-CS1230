import React, { useRef } from "react";
import {
  Canvas,
  useFrame,
  sRGBEncoding,
  ACESFilmicToneMapping,
  useLoader,
} from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import { Leva } from "leva";
import GlassSphere from "./GlassSphere";

const Scene = () => {
  const orbitRef = useRef();
  const obj = useLoader(OBJLoader, "/giraffe.obj");

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
        <primitive object={obj} scale={0.1} />
        {/* <directionalLight position={[1, 2, 3]} intensity={0.8} /> */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.2}
          penumbra={0.5}
          intensity={1.5}
        />
        <directionalLight position={[-5, 5, 5]} intensity={1} />

        <GlassSphere />
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
