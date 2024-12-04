import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import GlassSphere from "./GlassSphere";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import Table from "./Table";
import Lights from "./Lights";
import Terrain from "./Terrain";

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
        <gridHelper args={[10, 10]} />

        <Lights />
        <primitive object={obj} scale={0.1} />

        <GlassSphere />
        <Terrain />
        <Table />
        <OrbitControls ref={orbitRef} />
        {/* makes it crash :( */}
        {/* <Environment files={"/studio.exr"} /> */}
      </Canvas>
    </>
  );
};

export default Scene;
