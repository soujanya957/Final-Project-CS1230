import React from "react";
import Model from "./Model";

export default function Marigold() {
  const positions = [
    [-1.2, 0.2, 1.8],
    [-1.3, 0.2, 1.9],
    [-1.5, 0.2, 1.7],
    [1, 0.2, -1.8],
    [1.3, 0.2, -1.9],
    [1.5, 0.2, -1.7],
  ];

  return (
    <>
      {/* marigold */}
      {positions.map((position, index) => (
        <Model
          key={index}
          objpath={"/models/marigold/DesertMarigold.obj"}
          mtlpath={"/models/marigold/DesertMarigold.mtl"}
          texpath={"/models/marigold/DesertMarigold_BaseColor.png"}
          mat={"DesertMarigold_mat"}
          u={0.05}
          x={position[0]}
          y={position[1]}
          z={position[2]}
        />
      ))}
    </>
  );
}
