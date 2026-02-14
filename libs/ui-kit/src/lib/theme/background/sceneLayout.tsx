'use client';

import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import { View } from "@react-three/drei";

import { Background } from "./background";

import { Ui3D } from "../../utils/ui3d";

interface SceneLayoutProps {
    children: React.ReactNode;
}

const SceneLayout = ({children}: SceneLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ containerRef }
            className='relative w-full h-screen bg-background text-foreground'
        >
            <div className='absolute inset-0 z-0 pointer-events-none'>
                {/* Global Canvas */}
                <Canvas
                    eventSource={ containerRef as React.RefObject<HTMLElement> }
                    className='!absolute inset-0'
                    dpr={ [1, 1.5] }
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    camera={{ position: [0, 0, 5], fov: 75 }}
                >
                    <Background />
                    <Ui3D.Out />
                    <View.Port />

                    <ambientLight intensity={ 0.5 } />
                    <directionalLight position={ [10, 10, 5] } intensity={ 1 } />
                </Canvas>
            </div>

            { children }
        </div>
    );
}

export { SceneLayout };
