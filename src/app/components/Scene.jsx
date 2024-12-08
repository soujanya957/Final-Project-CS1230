import React, { useRef, useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as THREE from "three";

import GlassSphere from "./GlassSphere";
import Table from "./Table";
import Lights from "./Lights";
import Terrain from "./Terrain";
import Plant from "./Plant";
import Rain from "./Rain";
import Model from "./Model";
import Clock from "./Clock";
import GlassBowlStand from "./GlassBowlStand";
import DeskLamp from "./DeskLamp";

const Scene = () => {
  const orbitRef = useRef();

  const [lightingState, setLightingState] = useState({
    skyColor: new THREE.Color(0x87ceeb),
    sunPosition: [0, 50, 0],
    spotLightIntensity: 1,
    ambientIntensity: 0.5,
    colorTemp: 6500,
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
        {<Environment preset="sunset" background />}
        <Lights position={[0, 6, 10]} />
        <Table position={[0, -7.5, 0]} castShadow receiveShadow />
        <Clock
          position={[5, -2, 2]}
          rotation={[0, -Math.PI / 2, Math.PI / 10]} // Rotate 45 degrees around Y-axis
          castShadow={true} // Ensure shadows are cast
        />

        <DeskLamp position={[-5, -3.125, -2]} />
        {/* Secondary Desk Lamp if the scene is not brough enough*/} 
        <DeskLamp position={[5, -3.125, -2]} />
        {<gridHelper args={[10, 10]} />}

        {/* Terrarium Focused Components} */}
        <GlassSphere position={[0, 1, 0]} />
        <GlassBowlStand position={[0, -2, 0]} castShadow receiveShadow />
        {/* <Rain position={[0,1,0]} /> */}

        <Plant iterations={2} x={-1} y={0} z={-1} />
        <Plant iterations={3} x={1} y={0} z={1} u={0.1} />
        <Plant iterations={1} x={0} y={0} z={1} />

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

        <OrbitControls ref={orbitRef} />
      </Canvas>
    </>
  );
};

export default Scene;
