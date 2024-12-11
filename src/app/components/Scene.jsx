import React, { useRef, useState, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import { Leva, useControls } from "leva";
import * as THREE from "three";

import GlassSphere from "./GlassSphere";
import Table from "./Table";
import Lights from "./Lights";
import Plant from "./Plant";
import Model from "./Model";
import Clock from "./Clock";
import GlassBowlStand from "./GlassBowlStand";
import DeskLamp from "./DeskLamp";
import PointLamp from "./PointerLamp";
import PlayerMovement from "./PlayerMovement";
import Marigold from "./Marigold";

const Scene = () => {
  const orbitRef = useRef();

  const [lightingState, setLightingState] = useState({
    skyColor: new THREE.Color(0x87ceeb),
    sunPosition: [0, 50, 0],
    spotLightIntensity: 1,
    ambientIntensity: 0.5,
    colorTemp: 6500,
  });

  // const boundaries = useControls(
  //   "Boundaries",
  //   {
  //     debug: false,
  //     x: { value: 12, min: 0, max: 40 },
  //     y: { value: 8, min: 0, max: 40 },
  //     z: { value: 20, min: 0, max: 40 },
  //   },
  //   { collapsed: true }
  // );

  // const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  // const scaleX = Math.max(0.5, size[0] / 1920);
  // const scaleY = Math.max(0.5, size[1] / 1080);
  // const responsiveBoundaries = {
  //   x: boundaries.x * scaleX,
  //   y: boundaries.y * scaleY,
  //   z: boundaries.z,
  // };

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
        <Environment preset="sunset" background />
        <Lights position={[0, 6, 10]} />
        <Table position={[0, -7.5, 0]} castShadow receiveShadow />
        {/* <mesh visible={boundaries.debug}>
          <boxGeometry
            args={[
              responsiveBoundaries.x,
              responsiveBoundaries.y,
              responsiveBoundaries.z,
            ]}
          >
            <meshStandardMaterial
              color="orange"
              transparent
              opacity={0.5}
            ></meshStandardMaterial>
          </boxGeometry>
        </mesh> */}

        <DeskLamp position={[-5, -3.125, -2]} />
        {/* Secondary Desk Lamp if the scene is not brough enough*/}
        <PointLamp position={[4, -3.125, -3]} />
        {<gridHelper args={[10, 10]} />}
        {/* Terrarium Focused Components} */}
        <GlassSphere position={[0, 1, 0]} />
        <GlassBowlStand position={[0, -2, 0]} castShadow receiveShadow />
        {/* Giraffe */}
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
        {/* Tree */}
        {/* <Model
          objpath={"/models/Tree/tree01.obj"}
          mtlpath={"/models/Tree/tree01.mtl"}
          texpath={"/models/Tree/tree_texture.png"}
          mat={"Mat"}
          u={0.006}
          x={0}
          y={0}
          z={0}
        /> */}
        {/* Cow */}
        <Model
          objpath={"/models/Cow/Cow.obj"}
          mtlpath={"/models/Cow/Cow.mtl"}
          texpath={"/models/Cow/Cow_BaseColor.png"}
          mat={"Cow_mat"}
          u={0.1}
          x={1.5}
          y={0}
          z={0}
        />

        {/* Rabbit */}
        <Model
          objpath={"/models/Rabbit/Mesh_Rabbit.obj"}
          mtlpath={"/models/Rabbit/Mesh_Rabbit.mtl"}
          texpath={"/models/Rabbit/Tex_Rabbit.png"}
          mat={"initialShadingGroup"}
          u={0.005}
          x={-1}
          y={0.2}
          z={-1}
        />

        <Marigold />

        <Plant iterations={2} x={0} y={0} z={2} u={0.1} />
        <Plant iterations={1} x={0} y={0} z={-2} u={0.1} />
        {/* <Plant iterations={2} x={-2} y={0} z={0} u={0.1} rotate={Math.PI} />
        <Plant iterations={1} x={2} y={0} z={0} u={0.1} rotate={Math.PI} /> */}
        <Clock
          position={[5, -2.025, 0]}
          rotation={[0, -Math.PI / 2, Math.PI / 10]} // Rotate 45 degrees around Y-axis
          castShadow={true}
        />
        <OrbitControls ref={orbitRef} />
        <PlayerMovement />
      </Canvas>
    </>
  );
};

export default Scene;
