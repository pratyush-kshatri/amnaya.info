'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";

import { mergeRefs } from "../../utils/mergeRefs";

import { useRafMediaQuery } from "../../utils/useRafMediaQuery";

import { registerGsapPlugins } from "../../utils/registerGsapPlugins";

import { cn } from "../../utils/cn";

import { Button } from "../button/button";

import { MenuIcon } from "./menuIcon";

import { SidePanel, SidePanelGroupInterface } from "./sidePanel";

// Tailwind
const navbarClasses = cva(
    [
        'fixed top-2 z-50 flex items-center justify-between',
        'max-w-5xl p-2 rounded-md bg-surface border border-accent',
        'transform-gpu will-change-width,transform backface-hidden'
    ]
);

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    onMenuToggle?: (isOpen: boolean) => void;
    isAuthenticated: boolean;
    navLinks: SidePanelGroupInterface[];
};

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({
        onMenuToggle,
        isAuthenticated,
        navLinks
    }, ref) => {
        const navbarRef = useRef<HTMLElement>(null);
        const mergedRef = mergeRefs([navbarRef, ref]);

        const [isMenuOpen, setIsMenuOpen] = useState(false);

        // Width Animation
        const { isMobile } = useRafMediaQuery();
        useGSAP(() => {
            const navbar = navbarRef.current;
            if (!navbar) return;

            // Current State
            const state = Flip.getState(navbar);

            gsap.set(navbar, {
                left: '50%',
                xPercent: -50,
                width: isMobile ? '90%' : '95%'
            });

            // Animate to New State
            Flip.from(state, {
                duration: 0.3,
                ease: 'power3.inOut',
                absolute: false,
                onComplete: () => {
                    gsap.set(navbar, { clearProps: 'transition' });
                }
            });
        }, { scope: navbarRef, dependencies: [isMobile] });

        // Menu Toggle
        const handleToggle = useCallback(() => {
            setIsMenuOpen((prev) => {
                const newState = !prev;
                onMenuToggle?.(newState);
                return newState;
            });
        }, [onMenuToggle]);

        // Keyboard Toggle (Cmd/Ctrl + B)
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { // Support for Mac/Windows
                    e.preventDefault(); // Prevent Browser Sidebar
                    handleToggle();
                }
                // Close on Esc
                if (e.key === 'Escape' && isMenuOpen) handleToggle();
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [handleToggle, isMenuOpen]);

        return (
            <React.Fragment>
                <nav
                    ref={mergedRef}
                    className={ cn(navbarClasses()) }
                >
                    {/* Left group */}
                    <div className='flex items-center gap-2'>
                        {/* Menu Button */}
                        <Button
                            variant='ghost'
                            onClick={ handleToggle }
                            aria-label={ isMenuOpen ? 'Close Menu' : 'Open Menu' }
                            aria-expanded={ isMenuOpen }
                            className='p-1 text-accent focus-visible:ring-accent'
                            icon={ <MenuIcon isOpen={ isMenuOpen } className='w-7 h-7' /> }
                        />
                        {/* Brand Name */}
                        <span className='text-xl text-accent font-semibold tracking-tight select-none'>
                            Amnaya.info
                        </span>
                    </div>
                </nav>
                {/* Side Panel */}
                <SidePanel
                    isOpen={ isMenuOpen }
                    isAuthenticated={ isAuthenticated }
                    navbarRef={ navbarRef }
                    navLinks={ navLinks }
                    onClose={ () => setIsMenuOpen(false) }
                />
            </React.Fragment>
        );
    }
)

Navbar.displayName = 'Navbar';

export { Navbar, NavbarProps };