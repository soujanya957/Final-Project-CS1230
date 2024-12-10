import React, { useMemo, useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

function generateLSystem({ axiom, rules, iterations }) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    //for each iteration
    let next = "";
    for (let char of current) {
      next += rules[char] || char; //add rule for each char in axiom to next
    }
    current = next;
  }
  return current;
}

export default function Plant({
  rotate = 1,
  iterations,
  theta = 25,
  scale = 1,
  u = 0.2,
  x,
  y,
  z,
}) {
  const mtl = useLoader(MTLLoader, "/models/Vines/Vines.mtl");
  const obj = useLoader(OBJLoader, "/models/Vines/Vines.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("/models/Vines/Vines_BaseColor.png");
    if (mtl.materials["Vines_mat"]) {
      mtl.materials["Vines_mat"].map = texture;
      mtl.materials["Vines_mat"].needsUpdate = true;
    }
  }, [mtl]);

  const branches = useMemo(() => {
    const axiom = "F";
    const rules = {
      F: "F[+F&F]/F[-F^F]$F",
    };

    return generateLSystem({ axiom, rules, iterations });
  }, [iterations]);

  const groupRef = useRef();

  const drawPlant = () => {
    const transforms = [];
    const stack = [];
    let currentTransform = {
      position: new THREE.Vector3(0, 0, 0), // origin
      rotation: new THREE.Euler(0, 0, 0),
    };

    for (let char of branches) {
      const rad = THREE.MathUtils.degToRad(theta);
      if (char === "F") {
        // Move forward and create a branch
        const direction = new THREE.Vector3(0, scale, 0); // move up by scale
        direction.applyEuler(currentTransform.rotation); // apply euler transform

        const newPosition = currentTransform.position.clone().add(direction); // new position = cur pos + dir

        // add branch w current transform
        transforms.push({
          position: newPosition.clone(),
          rotation: currentTransform.rotation.clone(),
          scale: new THREE.Vector3(scale, scale, scale),
        });

        currentTransform.position.copy(newPosition);
      } else if (char === "+") {
        //cc around z
        currentTransform.rotation.z -= rad;
      } else if (char === "-") {
        //ccw around z
        currentTransform.rotation.z += rad;
      } else if (char === "&") {
        //down around x
        currentTransform.rotation.x += rad;
      } else if (char === "^") {
        //up around x
        currentTransform.rotation.x -= rad;
      } else if (char === "/") {
        //cw around y
        currentTransform.rotation.y -= rad * rotate;
      } else if (char === "$") {
        //ccw around y
        currentTransform.rotation.y += rad * rotate;
      } else if (char === "[") {
        // Save curr state
        stack.push({
          position: currentTransform.position.clone(),
          rotation: currentTransform.rotation.clone(),
        });
      } else if (char === "]") {
        // Restore prev state
        const savedTransform = stack.pop();
        currentTransform.position.copy(savedTransform.position);
        currentTransform.rotation.copy(savedTransform.rotation);
      }
    }

    return transforms;
  };

  const transforms = drawPlant();

  return (
    <group ref={groupRef} scale={[u, u, u]} position={[x, y, z]}>
      {transforms.map((transform, idx) => (
        <mesh
          key={idx}
          geometry={obj.children[0].geometry}
          position={transform.position}
          rotation={transform.rotation}
          scale={transform.scale}
          material={mtl.materials["Vines_mat"]}
        ></mesh>
      ))}
    </group>
  );
}
