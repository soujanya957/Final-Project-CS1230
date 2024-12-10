import React, { useMemo, useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Model from "./Model";

// L-System Rules and Parameters
function generateLSystem({ axiom, rules, iterations }) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (let char of current) {
      next += rules[char] || char;
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
  const mtl = useLoader(MTLLoader, "/models/branch/PUSHILIN_Tree_branch.mtl");
  const obj = useLoader(
    OBJLoader,
    "/models/branch/PUSHILIN_Tree_branch.obj",
    (loader) => {
      mtl.preload();
      loader.setMaterials(mtl);
    }
  );

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(
      "/models/branch/PUSHILIN_tree_branch.png"
    );
    if (mtl.materials["a"]) {
      mtl.materials["a"].map = texture;
      mtl.materials["a"].needsUpdate = true;
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

  const { transforms, endpoints } = useMemo(() => {
    const drawPlant = () => {
      const transforms = [];
      const endpoints = []; // To store positions for leaves
      const stack = [];
      let currentTransform = {
        position: new THREE.Vector3(0, 0, 0), // origin
        rotation: new THREE.Euler(0, 0, 0),
      };

      for (let i = 0; i < branches.length; i++) {
        const char = branches[i];
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

          // If this is the last "F" in the string, add to endpoints
          if (
            branches
              .slice(i + 1)
              .split("")
              .every((c) => c !== "F") // No more "F" after this
          ) {
            endpoints.push(newPosition.clone());
          }

          currentTransform.position.copy(newPosition);
        } else if (char === "+") {
          // cc around z
          currentTransform.rotation.z -= rad;
        } else if (char === "-") {
          // ccw around z
          currentTransform.rotation.z += rad;
        } else if (char === "&") {
          // down around x
          currentTransform.rotation.x += rad;
        } else if (char === "^") {
          // up around x
          currentTransform.rotation.x -= rad;
        } else if (char === "/") {
          // cw around y
          currentTransform.rotation.y -= rad * rotate;
        } else if (char === "$") {
          // ccw around y
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

      return { transforms, endpoints };
    };
    return drawPlant();
  }, [branches, rotate, scale, theta]);

  return (
    <group ref={groupRef} scale={[u, u, u]} position={[x, y, z]}>
      {transforms.map((transform, idx) => (
        <mesh
          key={idx}
          geometry={obj.children[0].geometry}
          position={transform.position}
          rotation={transform.rotation}
          scale={transform.scale}
          material={mtl.materials["a"]}
        ></mesh>
      ))}
      <Model
        mtlpath={"/models/bucket/528 Bucket.mtl"}
        objpath={"/models/bucket/528 Bucket.obj"}
        texpath={"/models/bucket/528 Bucket.png"}
        mat={"Mat"}
        x={transforms[0].position.x}
        y={transforms[0].position.y - 1}
        z={transforms[0].position.z}
        u={0.05}
      />
      {endpoints.map((position, idx) => (
        <Model
          key={`leaf-${idx}`}
          mtlpath="/models/Leaf/PUSHILIN_leaf.mtl"
          objpath="/models/Leaf/PUSHILIN_leaf.obj"
          texpath="/models/Leaf/PUSHILIN_leaf.png"
          mat="None"
          u={0.5}
          x={position.x}
          y={position.y}
          z={position.z}
        />
      ))}
    </group>
  );
}
