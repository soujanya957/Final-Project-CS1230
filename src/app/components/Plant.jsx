import React, { useMemo, useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

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

export default function Plant({ iterations, theta = 25, scale = 1, x, y, z }) {
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
    console.log(mtl.materials);
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
    const stack = []; // Stack to save transformations
    let currentTransform = {
      position: new THREE.Vector3(0, 0, 0), // Start at the origin
      rotation: new THREE.Euler(0, 0, 0), // No initial rotation
    };

    for (let char of branches) {
      if (char === "F") {
        // Move forward and create a branch
        const direction = new THREE.Vector3(0, scale, 0); // Upward by `scale`
        direction.applyEuler(currentTransform.rotation); // Apply rotation to direction

        const newPosition = currentTransform.position.clone().add(direction); // Calculate new position

        // Add a branch with the current transform
        transforms.push({
          position: newPosition.clone(),
          rotation: currentTransform.rotation.clone(),
          scale: new THREE.Vector3(scale, scale, scale),
        });

        // Update current position to the new position
        currentTransform.position.copy(newPosition);
      } else if (char === "+") {
        // Rotate clockwise around the Z-axis
        currentTransform.rotation.z -= THREE.MathUtils.degToRad(theta);
      } else if (char === "-") {
        // Rotate counterclockwise around the Z-axis
        currentTransform.rotation.z += THREE.MathUtils.degToRad(theta);
      } else if (char === "&") {
        // Rotate downward around the X-axis (pitch down)
        currentTransform.rotation.x += THREE.MathUtils.degToRad(theta);
      } else if (char === "^") {
        // Rotate upward around the X-axis (pitch up)
        currentTransform.rotation.x -= THREE.MathUtils.degToRad(theta);
      } else if (char === "/") {
        // Rotate clockwise around the Y-axis (yaw right)
        currentTransform.rotation.y -= THREE.MathUtils.degToRad(theta);
      } else if (char === "\\") {
        // Rotate counterclockwise around the Y-axis (yaw left)
        currentTransform.rotation.y += THREE.MathUtils.degToRad(theta);
      } else if (char === "[") {
        // Save the current state
        stack.push({
          position: currentTransform.position.clone(),
          rotation: currentTransform.rotation.clone(),
        });
      } else if (char === "]") {
        // Restore the previous state
        const savedTransform = stack.pop();
        currentTransform.position.copy(savedTransform.position);
        currentTransform.rotation.copy(savedTransform.rotation);
      }
    }

    return transforms;
  };

  const transforms = drawPlant();

  return (
    <group ref={groupRef} scale={[0.2, 0.2, 0.2]} position={[x, y, z]}>
      {transforms.map((transform, idx) => (
        <mesh
          key={idx}
          geometry={obj.children[0].geometry}
          position={transform.position}
          rotation={transform.rotation}
          scale={transform.scale}
        >
          {/* <meshStandardMaterial color="brown" /> */}
        </mesh>
      ))}
    </group>
  );
}
