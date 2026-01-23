'use client';

import React, { useRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot, Slottable } from '@radix-ui/react-slot';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { mergeRefs } from '../../utils/mergeRefs';

import { cn } from '../../utils/cn';
import { Loader } from 'lucide-react';

// Tailwind
const buttonVariants = cva(
  [
    'inline-flex items-center whitespace-nowrap cursor-pointer select-none',
    'rounded-md font-medium px-4 py-2 bg-surface border overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'transform-gpu backface-hidden will-change-transform',
  ],
  {
    variants: {
      variant: {
        primary: 'text-primary border-primary focus-visible:ring-primary',
        secondary: 'text-secondary border-secondary focus-visible:ring-secondary',
        accent: 'text-accent border-accent focus-visible:ring-accent',
        ghost: 'text-foreground border-transparent bg-transparent focus-visible:ring-foreground'
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
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
      className,
      variant,
      asChild = false,
      loading = false,
      icon,
      children,
      ...props
  }, ref) => {
    const Component = asChild ? Slot : 'button';

    const buttonRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);

    const mergedRef = mergeRefs([buttonRef, ref]);

    useGSAP(() => {
      const button = buttonRef.current;
      if (!button || props.disabled || loading) return;

      // Press Animation
      const handlePointerDown = () => {
        gsap.to([button, iconRef.current], {
          scale: 0.975,
          duration: 0.1,
          ease: 'power2.out'
        });
      };
      const handlePointerUp = () => {
        gsap.to([button, iconRef.current], {
          scale: 1,
          duration: 0.2,
          ease: 'elastic.out(1, .6)'
        });
      };

      // Keyboard Support
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') handlePointerDown();
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') handlePointerUp();
      };

      button.addEventListener('pointerdown', handlePointerDown);
      button.addEventListener('pointerup', handlePointerUp);
      button.addEventListener('pointerleave', handlePointerUp);
      button.addEventListener('keydown', handleKeyDown);
      button.addEventListener('keyup', handleKeyUp);

      return () => {
        button.removeEventListener('pointerdown', handlePointerDown);
        button.removeEventListener('pointerup', handlePointerUp);
        button.removeEventListener('pointerleave', handlePointerUp);
        button.removeEventListener('keydown', handleKeyDown);
        button.removeEventListener('keyup', handleKeyUp);
      };
    }, { scope: buttonRef, dependencies: [props.disabled, loading] });

    return (
      <Component
        ref={ mergedRef }
        className={ cn(buttonVariants({ variant, className })) }
        disabled={ props.disabled || loading }
        aria-busy={ loading }
        {...props}
      >
        <span className='grid place-items-center w-full'>
          {/* Loading */}
          { loading && (
            <span className='col-start-1 row-start-1 flex items-center justify-center z-10'>
              <Loader className='w-5 h-5 animate-spin' />
            </span>
          ) }
          {/* Icon + Content */}
          <span className={ cn(
            'col-start-1 row-start-1 flex w-full items-center justify-between gap-2 transition-all duration-150 ease-in-out',
            loading ? 'opacity-0 invisible' : 'opacity-100 visible'
          ) }>
            <Slottable>
              { children }
            </Slottable>
            { !asChild && icon && (
              <span
                ref={ iconRef }
                className='inline-flex shrink-0 items-center justify-center transform-gpu'
              >
                { icon }
              </span>
            ) }
          </span>
        </span>
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
