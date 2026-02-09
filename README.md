# ✨ Amnaya.info ✨

## Project Structure

Libs (Shared Logic)

- UI-Kit

## Review Topics

- rAF Debounce Helper (UI-Kit)

'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { Command } from "lucide-react";

import { AuthCardProps } from "../authCard/authCard";

import { useRafMediaQuery } from "../../utils/useRafMediaQuery";

import { Button } from "../button/button";

import { MenuIcon } from "./menuIcon";

import { SidePanel, SidePanelGroupInterface } from "./sidePanel";

import { Tooltip, TooltipRef } from "../utility/tooltip";

import { mergeRefs } from "../../utils/mergeRefs";

import { useTouch } from "../../utils/useTouch";

// Tailwind
const navbarClasses = 'fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 py-2 rounded-full bg-surface border border-accent transform-gpu will-change-transform backface-hidden';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    onMenuToggle?: (isOpen: boolean) => void;
    isAuthenticated: boolean;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    navLinks: SidePanelGroupInterface[];
    authProps: Omit<AuthCardProps, 'trigger'>
};

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({
        onMenuToggle,
        isAuthenticated,
        user,
        navLinks,
        authProps
    }, ref) => {
        const navbarRef = useRef<HTMLElement>(null);
        const tooltipRef = useRef<TooltipRef>(null);
        const isAnimating = useRef(false);

        const mergedRef = mergeRefs([navbarRef, ref]);

        const [isMenuOpen, setIsMenuOpen] = useState(false);

        // Width Animation
        const { isMobile } = useRafMediaQuery();
        useGSAP(() => {
            const navbar = navbarRef.current;
            if (!navbar) return;

            const state = Flip.getState(navbar);

            // Initial State
            gsap.set(navbar, {
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
                width: isMobile ? '95vw' : '90vw',
                maxWidth: '1024px'
            });

            // Animate to New State
            Flip.from(state, {
                duration: 0.3,
                ease: 'power3.inOut',
                absolute: false,
                simple: true,
                force3D: true,
                onComplete: () => Flip.killFlipsOf(navbar)
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

        // Mobile - Swipe
        useGSAP(() => {
            if (!useTouch || !navbarRef.current) return;

            const swipeObserver = Observer.create({
                target: navbarRef.current,
                capture: true,
                lockAxis: true,
                type: 'touch,pointer',
                onDown: () => {
                    if (!isMenuOpen && !isAnimating.current) {
                        isAnimating.current = true;
                        handleToggle();
                    }
                },
                onRelease: () => isAnimating.current = false,
                dragMinimum: 10,
                preventDefault: true
            });

            return () => swipeObserver?.kill();
        }, [isMenuOpen]);

        return (
            <React.Fragment>
                <nav
                    ref={mergedRef}
                    className={ navbarClasses }
                >
                    {/* Left group */}
                    <div className='flex items-center gap-2'>
                        {/* Menu - Button + Tooltip Wrapper */}
                        <div
                            className='relative flex items-center'
                            onPointerMove={ (e) => tooltipRef.current?.move(e) }
                            onPointerEnter={ () => tooltipRef.current?.show() }
                            onPointerLeave={ () => tooltipRef.current?.hide() }
                        >
                            <Button
                                variant='ghost'
                                onClick={ handleToggle }
                                aria-label={ isMenuOpen ? 'Close Menu' : 'Open Menu' }
                                aria-expanded={ isMenuOpen }
                                className='p-1 text-accent focus-visible:ring-accent'
                                icon={ <MenuIcon isOpen={ isMenuOpen } className='w-7 h-7' /> }
                            />
                        </div>
                        {/* Brand Name */}
                        <span className='text-xl text-accent font-semibold tracking-tight select-none'>
                            Amnaya.info
                        </span>
                    </div>
                </nav>
                {/* Tooltip */}
                <Tooltip ref={ tooltipRef }>
                    <Command className='w-3 h-3 mr-1 stroke-[2.5]' />
                    <span>+ B</span>
                </Tooltip>
                {/* Side Panel */}
                <SidePanel
                    isOpen={ isMenuOpen }
                    isAuthenticated={ isAuthenticated }
                    user={ user }
                    navbarRef={ navbarRef }
                    navLinks={ navLinks }
                    authProps={ authProps }
                    onClose={ () => setIsMenuOpen(false) }
                />
            </React.Fragment>
        );
    }
)

Navbar.displayName = 'Navbar';

export { Navbar, NavbarProps };