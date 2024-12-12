import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import { Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { randFloat, randInt } from "three/src/math/MathUtils.js";
import Firefly from "./Firefly";

// Preload the GLTF model
useGLTF.preload("/models/Firefly/firefly_minecraft.glb");

function remap(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

// forces
const limits = new Vector3();
const wander = new Vector3();
const horizontalWander = new Vector3();
const steering = new Vector3();
const alignment = new Vector3();
const avoidance = new Vector3();
const cohesion = new Vector3();

export const Boids = ({ radius }) => {
  const {
    NUM_BOIDS,
    MIN_SCALE,
    MAX_SCALE,
    MIN_SPEED,
    MAX_SPEED,
    MAX_STEERING,
  } = useControls(
    "Boid Settings",
    {
      NUM_BOIDS: { value: 10, min: 1, max: 30, step: 1 },
      MIN_SCALE: { value: 0.001, min: 0.001, max: 0.001, step: 0.001 },
      MAX_SCALE: { value: 0.001, min: 0.001, max: 0.001, step: 0.001 },
      MIN_SPEED: { value: 0.5, min: 0, max: 10, step: 0.1 },
      MAX_SPEED: { value: 1.5, min: 0, max: 10, step: 0.1 },
      MAX_STEERING: { value: 0.1, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const { threeD, ALIGNMENT, AVOIDANCE, COHESION } = useControls(
    "Boid Rules",
    {
      threeD: { value: true },
      ALIGNMENT: { value: true },
      AVOIDANCE: { value: true },
      COHESION: { value: true },
    },
    { collapsed: true }
  );

  const { ALIGN_RADIUS, ALIGN_STRENGTH, ALIGN_CIRCLE } = useControls(
    "Alignment",
    {
      ALIGN_CIRCLE: false,
      ALIGN_RADIUS: { value: 1.2, min: 0, max: 10, step: 0.1 },
      ALIGN_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { AVOID_RADIUS, AVOID_STRENGTH, AVOID_CIRCLE } = useControls(
    "Avoidance",
    {
      AVOID_CIRCLE: false,
      AVOID_RADIUS: { value: 0.8, min: 0, max: 2 },
      AVOID_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  const { COHESION_RADIUS, COHESION_STRENGTH, COHESION_CIRCLE } = useControls(
    "Cohesion",
    {
      COHESION_CIRCLE: false,
      COHESION_RADIUS: { value: 1, min: 0, max: 2 },
      COHESION_STRENGTH: { value: 2, min: 0, max: 10, step: 1 },
    },
    { collapsed: true }
  );

  function randomInSphere(radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    return new Vector3(x, y, z);
  }

  const boids = useMemo(() => {
    return Array.from({ length: NUM_BOIDS }, () => {
      const scale = randFloat(MIN_SCALE, MAX_SCALE);
      return {
        position: randomInSphere(radius - scale), // Start within valid bounds
        velocity: new Vector3(0, 0, 0),
        wander: randFloat(0, Math.PI * 2),
        scale: scale,
        wanderRadius: radius - scale, // Constrain wander radius
      };
    });
  }, [NUM_BOIDS, MIN_SCALE, MAX_SCALE, radius, threeD]);

  useFrame((_, delta) => {
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];

      // WANDER
      boid.wander += randFloat(-0.05, 0.05);

      wander.set(
        Math.cos(boid.wander) * boid.wanderRadius,
        Math.sin(boid.wander) * boid.wanderRadius,
        0
      );

      wander.normalize();
      //wander.multiplyScalar(WANDER_STRENGTH);

      // RESET FORCES
      limits.multiplyScalar(0);
      steering.multiplyScalar(0);
      alignment.multiplyScalar(0);
      avoidance.multiplyScalar(0);
      cohesion.multiplyScalar(0);

      const distanceFromCenter = boid.position.length();
      // LIMITS
      if (distanceFromCenter + 1 > radius) {
        // Reflect the boid back into the sphere
        boid.position.setLength(radius - 1); // Adjust position to stay within bounds
        boid.velocity.reflect(boid.position.clone().normalize()); // Reflect velocity
        boid.wander += Math.PI; // Change wander direction
      }
      limits.normalize();
      limits.multiplyScalar(50);

      let totalCohesion = 0;
      // Loop through all boids
      for (let b = 0; b < boids.length; b++) {
        if (b === i) {
          // skip to get only other boids
          continue;
        }
        const other = boids[b];
        let d = boid.position.distanceTo(other.position);
        // ALIGNMENT
        if (d > 0 && d < ALIGN_RADIUS) {
          const copy = other.velocity.clone();
          copy.normalize();
          copy.divideScalar(d);
          alignment.add(copy);
        }

        // AVOID
        if (d > 0 && d < AVOID_RADIUS) {
          const diff = boid.position.clone().sub(other.position);
          diff.normalize();
          diff.divideScalar(d);
        }

        // COHESION
        if (d > 0 && d < COHESION_RADIUS) {
          cohesion.add(other.position);
          totalCohesion++;
        }
      }

      horizontalWander.set(
        Math.cos(boid.wander) * boid.wanderRadius,
        0,
        Math.sin(boid.wander) * boid.wanderRadius
      );

      horizontalWander.normalize();
      horizontalWander.multiplyScalar(2);

      steering.multiplyScalar(0);

      steering.add(limits);
      steering.add(wander);

      if (ALIGNMENT) {
        alignment.normalize();
        alignment.multiplyScalar(ALIGN_STRENGTH);
        steering.add(alignment);
      }

      //   if (AVOIDANCE) {
      //     avoidance.normalize();
      //     avoidance.multiplyScalar(AVOID_STRENGTH);
      //     steering.add(avoidance);
      //   }

      //   if (COHESION && totalCohesion > 0) {
      //     cohesion.divideScalar(totalCohesion);
      //     cohesion.sub(boid.position);
      //     cohesion.normalize();
      //     cohesion.multiplyScalar(COHESION_STRENGTH);
      //     steering.add(cohesion);
      //   }

      steering.clampLength(0, MAX_STEERING * delta);
      boid.velocity.add(steering);
      boid.velocity.clampLength(
        0,
        remap(boid.scale, MIN_SCALE, MAX_SCALE, MAX_SPEED, MIN_SPEED) * delta
      );

      // APPLY VELOCITY
      boid.position.add(boid.velocity);
    }
  });

  return boids.map((boid, index) => (
    <Boid
      key={index}
      position={boid.position}
      scale={boid.scale}
      velocity={boid.velocity}
      animation={"Fish_Armature|Swimming_Fast"}
      wanderCircle={false} // visualize spherical bounds in which boid will wander
      wanderRadius={boid.wanderRadius}
      alignCircle={ALIGN_CIRCLE} // visualize spherical bounds in which surrounding boids will align with curr boid
      alignRadius={ALIGN_RADIUS / boid.scale}
      avoidCircle={AVOID_CIRCLE}
      avoidRadius={AVOID_RADIUS / boid.scale}
      cohesionCircle={COHESION_CIRCLE}
      cohesionRadius={COHESION_RADIUS / boid.scale}
    />
  ));
};

const Boid = ({
  position,
  animation,
  velocity,
  wanderCircle,
  wanderRadius,
  alignCircle,
  alignRadius,
  avoidCircle,
  avoidRadius,
  cohesionCircle,
  cohesionRadius,
  ...props
}) => {
  const { scene, animations } = useGLTF(
    "/models/Firefly/firefly_minecraft.glb"
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, [clone]);

  useEffect(() => {
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [animation]);

  // so boid looks at direction we are facing
  useFrame(() => {
    const target = group.current.clone(false);
    target.lookAt(group.current.position.clone().add(velocity));
    group.current.quaternion.slerp(target.quaternion, 0.1);

    group.current.position.copy(position);
  });

  return (
    <group {...props} ref={group} position={position}>
      {/* <Firefly position={position} /> */}
      <primitive object={clone} rotation-y={Math.PI / 2} />
      <mesh visible={wanderCircle}>
        <sphereGeometry args={[wanderRadius, 32]} />
        <meshBasicMaterial color={"red"} wireframe />
      </mesh>
      <mesh visible={alignCircle}>
        <sphereGeometry args={[alignRadius, 32]} />
        <meshBasicMaterial color={"green"} wireframe />
      </mesh>
      <mesh visible={avoidCircle}>
        <sphereGeometry args={[avoidRadius, 32]} />
        <meshBasicMaterial color={"blue"} wireframe />
      </mesh>

      <mesh visible={cohesionCircle}>
        <sphereGeometry args={[cohesionRadius, 32]} />
        <meshBasicMaterial color={"yellow"} wireframe />
      </mesh>
    </group>
  );
};
