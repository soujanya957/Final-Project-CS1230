import React, { useRef } from "react";
import { SpotLightHelper, DirectionalLightHelper } from "three";
import { useHelper } from "@react-three/drei";

export default function Lights() {
  const spotLightRef = useRef();
  const dirLightRef = useRef();

  // // Attach helpers using the `useHelper` hook
  useHelper(spotLightRef, SpotLightHelper, "red"); // Adds a SpotLightHelper
  useHelper(dirLightRef, DirectionalLightHelper, 2, "cyan"); // Adds a DirectionalLightHelper
  return (
    <>
      <ambientLight intensity={4} color="#e2edff" />

      {/* bruh spotlight not doing anything */}
      <spotLight
        ref={spotLightRef}
        position={[5, 7, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
      />
      <directionalLight ref={dirLightRef} position={[-5, 5, 5]} intensity={1} />
    </>
  );
  {
    /* <directionalLightHelper /> */
  }
}
