'use client';

import React, { useRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { mergeRefs } from '../../utils/mergeRefs';

import { cn } from '../../utils/cn';

// Tailwind
const buttonVariants = cva(
  [
    'inline-flex items-center justify-between whitespace-nowrap cursor-pointer select-none',
    'rounded-md font-medium px-4 py-2 bg-surface overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'transform-gpu backface-hidden will-change-transform subpixel-antialiased',
  ],
  {
    variants: {
      variant: {
        primary: 'text-primary border border-primary focus-visible:ring-primary',
        secondary: 'text-secondary border border-secondary focus-visible:ring-secondary',
        accent: 'text-accent border border-accent focus-visible:ring-accent',
        ghost: 'text-foreground bg-transparent focus-visible:ring-foreground'
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const iconClasses = 'inline-flex shrink-0 items-center justify-center pointer-events-none';

// Polymorphism
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        asChild = false,
        icon,
        iconClassName,
        children,
        ...props
    }, ref) => {
        const Component = asChild ? Slot : 'button';

        const buttonRef = useRef<HTMLButtonElement>(null);
        const iconRef = useRef<HTMLSpanElement>(null);

        const mergedRef = mergeRefs([buttonRef, ref]);

        const { contextSafe } = useGSAP({ scope: buttonRef });

        // Press Animation
        const handlePointerDown = contextSafe(() => {
          if (props.disabled) return;

          gsap.to([buttonRef.current, iconRef.current], {
            scale: 0.975,
            duration: 0.1,
            ease: 'power3.out',
            overwrite: true
          });
        });
        const handlePointerUp = contextSafe(() => {
          if (props.disabled) return;

          gsap.to([buttonRef.current, iconRef.current], {
            scale: 1,
            duration: 0.2,
            ease: 'elastic.out',
            overwrite: true
          });
        });

        return (
        <Component
            ref={ mergedRef }
            className={ cn(buttonVariants({ variant, className })) }
            onPointerDown={ handlePointerDown }
            onPointerUp={ handlePointerUp }
            onPointerLeave={ handlePointerUp }
            onPointerCancel={ handlePointerUp }
            { ...props }
        >
          { asChild ? (
            children
          ) : (
            <>
              { icon && (
                <span
                  ref={ iconRef }
                  className={ cn(iconClasses, iconClassName) }
                >
                  { icon }
                </span>
              ) }
              { children }
            </>
          ) }
          
        </Component>
        );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
