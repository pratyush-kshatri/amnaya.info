'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import fragmentShader from './fragment.glsl?raw';
import vertexShader from './vertex.glsl?raw';

const Background = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uResolution: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    const { clock, size } = state;

    if (meshRef.current) {
      const mesh = meshRef.current.material as THREE.ShaderMaterial;

      mesh.uniforms.uTime.value = clock.getElapsedTime();
      mesh.uniforms.uResolution.value.set(
        size.width,
        size.height
      );
    }
  });

  return (
    <mesh
      ref={ meshRef }
      scale={ [viewport.width, viewport.height, 1] }
    >
      <planeGeometry args={ [1, 1] } />
      <shaderMaterial
        vertexShader={ vertexShader }
        fragmentShader={ fragmentShader }
        uniforms={ uniforms }
        depthWrite={ false }
      />
    </mesh>
  );
};

export { Background };