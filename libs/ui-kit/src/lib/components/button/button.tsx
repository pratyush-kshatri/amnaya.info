'use client';

import React, { useEffect, useRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import gsap from 'gsap';

import { mergeRefs } from '../../utils/mergeRefs';

import { registerGsapPlugins } from '../../utils/registerGsapPlugins';

import { cn } from '../../utils/cn';
import { useGSAP } from '@gsap/react';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 select-none',
    'rounded-md font-medium px-4 py-2 bg-surface',
    'transform-gpu',
  ],
  {
    variants: {
      variant: {
        primary: 'text-primary outline outline-primary shadow-md shadow-primary focus-visible:ring-primary',
        secondary: 'text-secondary outline outline-secondary shadow-md shadow-secondary focus-visible:ring-secondary',
        accent: 'text-accent outline outline-accent shadow-md shadow-accent focus-visible:ring-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

// Polymorphism
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        asChild = false,
        children,
        ...props
    }, ref) => {
        const Component = asChild ? Slot : 'button';

        const buttonRef = useRef<HTMLButtonElement | null>(null);
        const mergedRef = mergeRefs([buttonRef, ref]);

        useEffect(() => {
            registerGsapPlugins();
        }, []);

        useGSAP(() => {
            if (typeof window === 'undefined' || !buttonRef.current || buttonRef.current.disabled) return;
            const element = buttonRef.current;

            gsap.set(element, {
                transformOrigin: 'center',
                force3D: true
            });

            // helper
            // const isTouch = () => window.matchMedia && window.matchMedia('(pointer: coarse)').matches;


            // let hoverTween: gsap.core.Tween | null = null;
            let pressTween: gsap.core.Tween | null = null;

            // Click
            const onPointerDown = (e: PointerEvent) => {
                pressTween?.kill();
                pressTween = gsap.to(element, {
                    scale: 0.975,
                    duration: 0.1,
                    ease: 'power1.out',
                    overwrite: true,
                });
            };
            const onPointerUp = () => {
                pressTween?.kill();
                pressTween = gsap.to(element, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'elastic.out',
                    overwrite: true,
                });
            };

            // Hover
            // const onPointerEnter = () => {
            //     if (isTouch()) return;
            //     hoverTween?.kill();
            //     hoverTween = gsap.to(element, {
            //         scale: 1.025,
            //         duration: 0.1,
            //         ease: 'power2.out',
            //         overwrite: true,
            //     });
            // };
            // const onPointerLeave = () => {
            //     if (isTouch()) return;
            //     hoverTween?.kill();
            //     hoverTween = gsap.to(element, {
            //         scale: 1,
            //         duration: 0.2,
            //         ease: 'elastic.out',
            //         overwrite: true,
            //     });
            // };

            // Keyboard
            // const onFocus = () => {
            //     if (isTouch()) return;
            //     hoverTween?.kill();
            //     hoverTween = gsap.to(element, {
            //         scale: 1.02,
            //         duration: 0.2,
            //         ease: 'power3.out',
            //         overwrite: true
            //     });
            // };
            // const onBlur = () => {
            //     hoverTween?.kill();
            //     hoverTween = gsap.to(element, {
            //         scale: 1,
            //         duration: 0.2,
            //         ease: 'power3.out',
            //         overwrite: true
            //     });
            // };

            element.addEventListener('pointerdown', onPointerDown);
            element.addEventListener('pointerup', onPointerUp);
            element.addEventListener('pointercancel', onPointerUp);
            // element.addEventListener('pointerenter', onPointerEnter);
            // element.addEventListener('pointerleave', onPointerLeave);
            // element.addEventListener('focus', onFocus);
            // element.addEventListener('blur', onBlur);

            return () => {
                element.removeEventListener('pointerdown', onPointerDown);
                element.removeEventListener('pointerup', onPointerUp);
                element.removeEventListener('pointercancel', onPointerUp);
                // element.removeEventListener('pointerenter', onPointerEnter);
                // element.removeEventListener('pointerleave', onPointerLeave);
                // element.removeEventListener('focus', onFocus);
                // element.removeEventListener('blur', onBlur);
                // hoverTween?.kill();
                pressTween?.kill();
            };
        }, { scope: buttonRef, dependencies: [props.disabled] });

        const style: React.CSSProperties = { willChange: 'transform' };

        return (
        <Component
            ref={mergedRef}
            className={cn(buttonVariants({ variant }), className)}
            style={style}
            {...props}
        >
            {children}
        </Component>
        );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
