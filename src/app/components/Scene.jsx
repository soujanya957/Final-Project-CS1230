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
import Plant from "./Plant";

const Scene = () => {
  const orbitRef = useRef();

  const mtl = useLoader(MTLLoader, "/models/Giraffe.mtl");
  const obj = useLoader(OBJLoader, "/models/Giraffe.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  const mtlRac = useLoader(MTLLoader, "/models/Raccoon/Mesh_Raccoon.mtl");
  const objRac = useLoader(
    OBJLoader,
    "/models/Raccoon/Mesh_Raccoon.obj",
    (loader) => {
      mtlRac.preload();
      loader.setMaterials(mtlRac);
    }
  );

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("/models/Giraffe_BaseColor.png");
    if (mtl.materials["Giraffe_mat"]) {
      mtl.materials["Giraffe_mat"].map = texture;
      mtl.materials["Giraffe_mat"].needsUpdate = true;
    }
    const RactextureLoader = new TextureLoader();
    const textureRac = RactextureLoader.load("/models/Raccoon/Raccoon.png");
    if (mtlRac.materials["lambert2SG"]) {
      mtlRac.materials["lambert2SG"].map = textureRac;
      mtlRac.materials["lambert2SG"].needsUpdate = true;
    }
    console.log(mtlRac.materials);
  }, [mtl, mtlRac]);

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
        {/* <gridHelper args={[10, 10]} /> */}

        <Lights />
        <primitive object={obj} scale={0.1} />
        <primitive
          object={objRac}
          scale={0.01}
          material={mtlRac.materials["lambert2SG"]}
        />

        <Plant iterations={2} x={-1} y={0} z={-1} />
        <Plant iterations={3} x={1} y={0} z={1} u={0.1} />
        <Plant iterations={1} x={0} y={0} z={1} />
        {/* <GlassSphere /> */}
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
