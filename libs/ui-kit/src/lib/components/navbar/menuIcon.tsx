'use client';

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { registerGsapPlugins } from "../../utils/registerGsapPlugins";

import { mergeRefs } from "../../utils/mergeRefs";

import { cn } from "../../utils/cn";

const MENU_SHAPES = {
    MENU: [
        'M4 5h16', // Top Line
        'M4 19h16', // Bottom Line
        'M4 12h16', // Middle Line
    ],
    CLOSE: [
        'M18 6 6 18', // Backslash
        'm6 6 12 12', // Forwardslash
        'M12 12L12 12', // Center Point
    ]
};

const ICON_SIZE = 24;

interface MenuIconProps extends React.SVGAttributes<SVGSVGElement> {
    isOpen: boolean;
}

const MenuIcon = React.forwardRef<SVGSVGElement, MenuIconProps>(
    ({
        className,
        isOpen = false
    }, ref) => {
        const iconRef = useRef<SVGSVGElement>(null);
        const iconPathRef = useRef<Array<(SVGPathElement | null)>>([]);
        const tlRef = useRef<gsap.core.Timeline>(null);

        const mergedRef = mergeRefs([iconRef, ref]);

        // Animation
        useGSAP(() => {
            const icon = iconRef.current;
            const iconPath = iconPathRef.current;

            if (!icon || !iconPath) return;

            // MorphSVG Plugin Registration
            registerGsapPlugins();

            tlRef.current?.kill();
            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    transformOrigin: '50% 50%',
                    duration: 0.6,
                    ease: 'expo.inOut'
                }
            });

            // SVG Morph
            iconPath.forEach((path, i) => {
                tl.to(path, {
                    morphSVG: {
                        shape: MENU_SHAPES.CLOSE[i],
                        type: 'rotational'
                    },
                    opacity: i === 2 ? 0 : 1,
                    ease: i === 2 ? 'back.out' : 'expo.inOut'
                }, i === 2 ? 0 : 0.1);
            });

            // Rotation
            tl.to(icon, {
                rotate: 90,
                duration: 0.4,
                ease: 'back.out'
            }, 0.1);

            // Initial State
            tlRef.current = tl;
            tl.progress(isOpen ? 1 : 0);
        }, { scope: iconRef });

        // Toggle
        useLayoutEffect(() => {
            const tl = tlRef.current;
            if (!tl) return;

            isOpen ? tl.play() : tl.reverse();
        }, [isOpen]);

        return (
            <svg
                ref={ mergedRef }
                viewBox={ `0 0 ${ICON_SIZE} ${ICON_SIZE}` }
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                vectorEffect='non-scaling-stroke'
                className={ cn('transform-gpu will-change-transform', className) }
            >
                {
                    MENU_SHAPES.MENU.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            ref={ (e) => { iconPathRef.current[i] = e } }
                            className='transform-gpu will-change-d'
                        />
                    ))
                }
            </svg>
        );
    }
);

MenuIcon.displayName = 'MenuIcon'

export { MenuIcon, MenuIconProps };

// Lucide React Icons
// Menu
// <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
//Close
// <path d="M18 6 6 18"/><path d="m6 6 12 12"/>