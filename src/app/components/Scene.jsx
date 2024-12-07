import React, { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls, Environment} from "@react-three/drei";

import { Leva } from "leva";
import GlassSphere from "./GlassSphere";

import Table from "./Table";
import Lights from "./Lights";
import Terrain from "./Terrain";
import Plant from "./Plant";
import Rain from "./Rain";
import Model from "./Model";
import Clock from "./Clock";

const Scene = () => {
  const orbitRef = useRef();

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
        { <gridHelper args={[10, 10]} /> }
        { <Environment preset="sunset" background /> }

        <Lights />

        {/* GIRAFFE */}
        <Model
          objpath={"/models/Giraffe.obj"}
          mtlpath={"/models/Giraffe.mtl"}
          texpath={"/models/Giraffe_BaseColor.png"}
          mat={"Giraffe_mat"}
          u={0.1}
          x={1}
          y={0}
          z={-1}
        />

        {/* Sheep */}
        <Model
          objpath={"/models/Sheep/Sheep.obj"}
          mtlpath={"/models/Sheep/Sheep.mtl"}
          texpath={"/models/Sheep/Sheep_BaseColor.png"}
          mat={"Sheep_mat"}
          u={0.1}
          x={-1}
          y={0}
          z={1}
        />

        <Plant iterations={2} x={-1} y={0} z={-1} />
        <Plant iterations={3} x={1} y={0} z={1} u={0.1} />
        <Plant iterations={1} x={0} y={0} z={1} />

        <Table position={[0, -4, 0]} castShadow receiveShadow />
        <GlassSphere position={[0, 1, 0]} />

        <Table position={[0, -6, 0]} castShadow receiveShadow />
        <GlassSphere position={[0, 1, 0]} />
        <Rain />

        {/* Clock */}
        <Clock
          position={[5, -0.55, 0]}
          rotation={[0, -Math.PI / 2, Math.PI / 10]} // Rotate 45 degrees around Y-axis
          castShadow={true} // Ensure shadows are cast
        />

        <OrbitControls ref={orbitRef} />
        {/* makes it crash :( */}
        {/* <Environment files={"/studio.exr"} /> */}
      </Canvas>
    </>
  );
};

export default Scene;
