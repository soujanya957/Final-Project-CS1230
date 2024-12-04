import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls, useHelper } from "@react-three/drei";
import { Leva } from "leva";
import GlassSphere from "./GlassSphere";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { SpotLightHelper, DirectionalLightHelper } from "three";

const Scene = () => {
  const orbitRef = useRef();
  const mtl = useLoader(MTLLoader, "/models/Giraffe.mtl");
  const obj = useLoader(OBJLoader, "/models/Giraffe.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("/models/Giraffe_BaseColor.png");
    if (mtl.materials["Giraffe_mat"]) {
      mtl.materials["Giraffe_mat"].map = texture;
      mtl.materials["Giraffe_mat"].needsUpdate = true;
    }
  }, [mtl]);

  const spotLightRef = useRef();
  const dirLightRef = useRef();

  // // Attach helpers using the `useHelper` hook
  // useHelper(spotLightRef, SpotLightHelper, "cyan"); // Adds a SpotLightHelper
  // useHelper(dirLightRef, DirectionalLightHelper, 2); // Adds a DirectionalLightHelper

  //npm i
  //npm run dev

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
        <primitive object={obj} scale={0.15} />
        {/* <directionalLight position={[1, 2, 3]} intensity={0.8} /> */}
        <ambientLight intensity={0.3} />
        <spotLight
          ref={spotLightRef}
          position={[50, 50, 50]}
          angle={0.2}
          penumbra={0.5}
          intensity={1.5}
        />

        <directionalLight
          ref={dirLightRef}
          position={[-5, 5, 5]}
          intensity={1}
        />

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
