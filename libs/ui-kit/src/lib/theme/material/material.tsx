'use client';

import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from 'three';

interface MaterialProps {
    color?: string;
    track: React.RefObject<HTMLElement>;
}

const Material = ({
    color = '#FFFFFF',
    track
}: MaterialProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport, size } = useThree();

    useFrame(() => {
        const element = track.current;
        const mesh = meshRef.current;
        if (!element || !mesh) return;

        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            mesh.visible = false;
            return;
        }
        mesh.visible = true;

        // Convert - Px to Viewport
        //Size
        const width = (rect.width / size.width) * viewport.width;
        const height = (rect.height / size.height) * viewport.height;
        // Position
        const x = (rect.left / size.width) * viewport.width - viewport.width / 2 + width / 2;
        const y = -((rect.top / size.height) * viewport.height - viewport.height / 2 + height / 2);

        mesh.position.set(x, y, 0);
        mesh.scale.set(width, height, 1);
    });

    return (
        <RoundedBox
            ref={ meshRef }
            args={ [1, 1, 0.1] }
            radius={ 0.05 }
            smoothness={ 8 }
        >
            <MeshTransmissionMaterial
                backside
                samples={ 16 } // 32 - Production
                resolution={ 512 } // Refraction Quality
                transmission={ 1 }
                roughness={ 0.1 }
                thickness={ 0.5 } // Refraction Strength
                ior={ 1.45 }
                chromaticAberration={ 0.05 }
                anisotropy={ 0.1 }
                distortion={ 0.1 }
                distortionScale={ 0.3 }
                temporalDistortion={ 0.2 }
                clearcoat={ 1 }
                attenuationDistance={ 0.5 }
                attenuationColor={ color }
                color={ color }
            />
        </RoundedBox>
    );
}

export { Material };
