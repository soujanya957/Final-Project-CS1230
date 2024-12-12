import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function AnimatedCow({ position, scale }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Cow/cow6.glb");

  // animation mixer
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log(actions);
    actions["rigAction"].play(); //  name of the animation
    scene.traverse((child) => {
      if (child.isMesh) {
        child.transparency = 0;
        child.opacity = 1;
        child.alphaMode = "OPAQUE";
      }
    });
  }, [actions, scene]);

  return (
    <>
      <primitive
        object={scene}
        ref={group}
        position={position}
        scale={scale}
        opacity={1}
      />
    </>
  );
}
