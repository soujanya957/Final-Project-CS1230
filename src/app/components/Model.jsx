import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Model({ mtlpath, objpath, texpath, mat, u, x, y, z }) {
  const mtl = useLoader(MTLLoader, mtlpath);
  const obj = useLoader(OBJLoader, objpath, (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(texpath);
    if (mtl.materials[mat]) {
      mtl.materials[mat].map = texture;
      mtl.materials[mat].needsUpdate = true;
    }
  }, [mat, mtl, texpath]);

  return (
    <group position={[x, y, z]}>
      <mesh
        geometry={obj.children[0].geometry}
        scale={u}
        material={mtl.materials[mat]}
      ></mesh>
    </group>
  );
}
