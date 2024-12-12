import * as THREE from 'three';
import { extend } from '@react-three/fiber';

class GrassMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        map: { value: null },
        alphaMap: { value: null }
      },
      vertexShader: `
        uniform float time;
        attribute vec3 offset;
        attribute vec4 orientation;
        attribute float stretch;
        attribute float halfRootAngleSin;
        attribute float halfRootAngleCos;

        varying vec2 vUv;

        void main() {
          vUv = uv;
          
          // Complex vertex transformation for grass blade movement
          vec3 transformed = position;
          transformed.y *= stretch;
          
          // Apply rotation based on orientation
          vec3 axis = normalize(orientation.xyz);
          float angle = 2.0 * acos(orientation.w);
          mat3 rotationMatrix = mat3(
            cos(angle) + axis.x * axis.x * (1.0 - cos(angle)),
            axis.x * axis.y * (1.0 - cos(angle)) - axis.z * sin(angle),
            axis.x * axis.z * (1.0 - cos(angle)) + axis.y * sin(angle),
            
            axis.y * axis.x * (1.0 - cos(angle)) + axis.z * sin(angle),
            cos(angle) + axis.y * axis.y * (1.0 - cos(angle)),
            axis.y * axis.z * (1.0 - cos(angle)) - axis.x * sin(angle),
            
            axis.z * axis.x * (1.0 - cos(angle)) - axis.y * sin(angle),
            axis.z * axis.y * (1.0 - cos(angle)) + axis.x * sin(angle),
            cos(angle) + axis.z * axis.z * (1.0 - cos(angle))
          );
          
          transformed = rotationMatrix * transformed;
          
          // Wind effect
          float windStrength = sin(time + transformed.x * 0.1 + transformed.z * 0.1) * 0.1;
          transformed.x += windStrength;
          transformed.z += windStrength * 0.5;
          
          vec3 worldPosition = offset + transformed;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform sampler2D alphaMap;
        
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(map, vUv);
          float alpha = texture2D(alphaMap, vUv).r;
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }
}

extend({ GrassMaterial });

export default GrassMaterial;