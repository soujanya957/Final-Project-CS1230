import React, { useRef, useMemo } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';

const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const PointLamp = ({ position = [0, 0, 0] }) => {
  // Refs for precise head articulation
  const headRef = useRef();
  const lightRef = useRef();
  const targetRef = useRef();

  // Lamp controls with color temperature
  const { 
    headRotationX,
    headRotationY,
    lightIntensity,
    colorTemperature
  } = useControls('Desk Lamp', {
    // Default Head Rotations 
    headRotationX: { 
      value: -0.9, 
      min: -Math.PI / 2, // Increased limit to 90 degrees down
      max: Math.PI / 4,  // Limited to 45 degrees up
      step: 0.05 
    },
    headRotationY: { 
      value: -0.5, // Set to 0 to face the front
      min: -Math.PI,  // Increased limit to 180 degrees left
      max: Math.PI,   // Increased limit to 180 degrees right
      step: 0.05 
    },
    
    // Light Properties
    lightIntensity: { 
      value: 50,  // Set to default intensity of 30
      min: 0, 
      max: 200, 
      step: 0.5 
    },
    // Color temperature slider
    colorTemperature: { 
      value: 0.5, 
      min: 0, 
      max: 1, 
      step: 0.01,
      label: 'Color Temperature' 
    }
  });

  // Compute color based on color temperature
  const computedColor = useMemo(() => {
    // Cool white (bluish) to warm white (orangey)
    const coolColor = '#F0F8FF';  // Alice Blue (cool white)
    const warmColor = '#FFA500';  // Orange (warm white)
    
    return interpolateColor(coolColor, warmColor, colorTemperature);
  }, [colorTemperature]);

  return (
    <group position={position} rotation={[0, Math.PI, 0]} scale={2.5}>
      {/* Solid Base (Now Fixed) */}
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 64]} />
          <meshStandardMaterial color="#3C3C3C" roughness={0.7} metalness={0.6} />
        </mesh>

        {/* First Joint (Now Fixed) */}
        <group position={[0, 0.2, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="#505050" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Arm (Now Fixed) */}
          <group position={[0, 1.5, 0]}> {/* Adjusted height */}
            <mesh rotation={[Math.PI, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 3.5, 64]} />
              <meshStandardMaterial color="#606060" roughness={0.6} metalness={0.7} />
            </mesh>

            {/* Lamp Head with Controlled Rotational Control */}
            <group 
              ref={headRef} 
              position={[0, 2, 0]}
              rotation={[headRotationX, headRotationY, 0]}
            >
              {/* Longer Lamp Shade */}
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.8, 64]} />
                <meshStandardMaterial color="#E0E0E0" opacity={0.9} />
              </mesh>

              {/* Bulb Area */}
              <mesh position={[0, 0, -0.4]}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial 
                  color="#FFFF00" 
                  emissive={computedColor} 
                  emissiveIntensity={0.5} 
                />
              </mesh>

              {/* Target for Precise Light Direction */}
              <object3D 
                ref={targetRef} 
                position={[0, 0, -5]} 
              />

              {/* Spot Light with Dynamic Targeting and Color */}
              <spotLight
                ref={lightRef}
                position={[0, 0, -0.5]}
                target={targetRef.current}
                angle={Math.PI / 4}
                penumbra={0.5}
                intensity={lightIntensity}
                color={computedColor}
                distance={10}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={20}
                shadow-camera-near={0.5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
                shadow-camera-right={5}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default PointLamp;