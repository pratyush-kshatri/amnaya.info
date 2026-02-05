'use client';

import React, { useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createPortal } from "react-dom";

import { cn } from "../../utils/cn";

// Tailwind
const tooltipClasses = 'fixed top-0 left-0 z-[51] pointer-events-none flex items-center px-2 py-1 rounded-full bg-foreground text-surface text-xs font-medium';

interface TooltipRef {
    show: () => void;
    hide: () => void;
    move: (e: React.PointerEvent | PointerEvent) => void;
}

interface TooltipProps {
    className?: string;
    children: React.ReactNode;
}

const Tooltip = React.forwardRef<TooltipRef, TooltipProps> (
    ({
        className,
        children
    }, ref) => {
        const tooltipRef = useRef<HTMLDivElement>(null);
        const xTo = useRef<gsap.QuickToFunc | null>(null);
        const yTo = useRef<gsap.QuickToFunc | null>(null);
        const delayRef = useRef<gsap.core.Tween | null>(null);

        useGSAP(() => {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;

            // Initial State
            gsap.set(tooltip, {
                autoAlpha: 0,
                scale: 0,
                xPercent: 30,
                yPercent: -50
            });

            xTo.current = gsap.quickTo(tooltip, 'x', {
                duration: 0.15,
                ease: 'expo.out'
            });
            yTo.current = gsap.quickTo(tooltip, 'y', {
                duration: 0.15,
                ease: 'expo.out'
            })
        }, { scope: tooltipRef });

        useImperativeHandle(ref, () => ({
            show: () => {
                delayRef.current?.kill();

                delayRef.current = gsap.delayedCall(1, () => {
                    gsap.to(tooltipRef.current, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.2
                    });
                });
            },
            hide: () => {
                delayRef.current?.kill();

                gsap.to(tooltipRef.current, {
                    autoAlpha: 0,
                    scale: 0,
                    duration: 0.2
                })
            },
            move: (e) => {
                xTo.current?.(e.clientX);
                yTo.current?.(e.clientY)
            }
        }));

        return typeof document !== 'undefined' ? createPortal(
            <div
                ref={ tooltipRef }
                className={ cn(tooltipClasses, className) }
            >
                { children }
            </div>,
            document.body
        ) : null;
    }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip, TooltipRef };