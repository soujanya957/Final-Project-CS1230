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
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const Scene = () => {
  const orbitRef = useRef();
  const mtl = useLoader(MTLLoader, "/models/Giraffe.mtl");
  const obj = useLoader(OBJLoader, "/models/giraffe.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
    console.log(mtl);
  });

  return (
    <>
      <Leva />
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
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
