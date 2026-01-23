'use client';

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { mergeRefs } from "../../utils/mergeRefs";

import { useRafMediaQuery } from "../../utils/useRafMediaQuery";

import { registerGsapPlugins } from "../../utils/registerGsapPlugins";

import { cn } from "../../utils/cn";

import { Button } from "../button/button";

// Tailwind
const sidePanelClasses = cva(
    [
        'fixed z-50 flex flex-col gap-2 p-2',
        'bg-surface rounded-md border border-accent outline-none',
        'transform-gpu backface-hidden perspective-1000 will-change-clip-path,transform,opacity'
    ]
);

const sidePanelItemClasses = cva(
    [
        'side-panel-item group flex w-full',
        'transition-colors duration-150 ease-in-out'
    ], {
        variants: {
            active: {
                true: 'text-surface bg-accent',
                false: 'text-foreground bg-surface hover:text-accent'
            }
        },
        defaultVariants: {
            active: false
        }
    }
);

// Navigation Interface
interface SidePanelItemInterface {
    label: string;
    href: string;
    icon: LucideIcon;
};

interface SidePanelGroupInterface {
    title?: string;
    protected?: boolean;
    items: SidePanelItemInterface[];
};

interface SidePanelProps {
    isOpen: boolean;
    isAuthenticated: boolean;
    navbarRef: React.RefObject<HTMLElement | null>;
    navLinks: SidePanelGroupInterface[];
    onClose?: () => void;
};

const SidePanel = React.forwardRef<HTMLDivElement, SidePanelProps>(
    ({
        isOpen,
        isAuthenticated,
        navbarRef,
        navLinks,
        onClose
    }, ref) => {
        const sidePanelRef = useRef<HTMLDivElement>(null);
        const tlRef = useRef<gsap.core.Timeline>(null);
        const pathname = usePathname();

        const mergedRef = mergeRefs([sidePanelRef, ref]);

        // Width Animation
        const { isMobile } = useRafMediaQuery();
        useGSAP(() => {
            const sidePanel = sidePanelRef.current;
            const navbar = navbarRef.current;
            if (!navbar || !sidePanel) return;

            // Flip Plugin Registration
            registerGsapPlugins();

            const handleResize = () => {
                // Get Current State
                const state = Flip.getState(sidePanel);
                const navbarRect = navbar.getBoundingClientRect();
                const width = isMobile ? navbarRect.width : 320;

                // Update Position
                gsap.set(sidePanel, {
                    left: navbarRect.left,
                    top: navbarRect.bottom + 12,
                    width,
                    x: 0
                });

                // Animate New Position
                Flip.from(state, {
                    duration: 0.3,
                    ease: 'power3.inOut',
                    simple: true
                });
            };

            const observer = new ResizeObserver(() => requestAnimationFrame(handleResize));
            observer.observe(navbar);

            return () => observer.disconnect();
        }, { scope: sidePanelRef, dependencies: [isMobile, navbarRef] });

        useGSAP(() => {
            const sidePanel = sidePanelRef.current;
            if (!sidePanel) return;

            // Split Text Plugin Registration
            registerGsapPlugins();

            // Rows
            const items = Array.from(sidePanel.querySelectorAll<HTMLElement>('.side-panel-item'));
            // Titles
            const titles = Array.from(sidePanel.querySelectorAll<HTMLElement>('.side-panel-title'));

            // Splits
            const splits: SplitText[] = [];

            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: 'expo.out' },
                onReverseComplete: () => {
                    gsap.set(sidePanel, { visibility: 'hidden' });
                }
            });
            // Open/Close Animation
            tl.fromTo(sidePanel, {
                clipPath: 'inset(0% 0% 100% 0%)',
                y: -12,
                opacity: 0,
                visibility: 'hidden'
            }, {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                opacity: 1,
                visibility: 'visible',
                duration: 0.6,
                ease: 'expo.out'
            });

            // Rows Animation
            items.forEach((item, index) => {
                // Icon
                const icon = item.querySelector<HTMLElement>('.side-panel-icon');
                // Label
                const label = item.querySelector<HTMLElement>('.side-panel-label');

                if (!icon || !label) return;

                // Split Label
                const splitLabel = new SplitText(label, { type: 'chars' });
                splits.push(splitLabel);

                const startTime = index === 0 ? 0.1 : '<+=0.1';

                // Icon Animation
                tl.from(icon, {
                    x: 12,
                    opacity: 0,
                    duration: 0.6
                }, startTime);
                // Label Animation
                tl.from(splitLabel.chars, {
                    y: 8,
                    opacity: 0,
                    stagger: 0.02,
                    duration: 0.3
                }, '<');
            });

            // Title Animation
            tl.from(titles, {
                x: -10,
                opacity: 0,
                stagger: 0.2,
                duration: 0.3
            }, 0.3);


            tlRef.current = tl;
            if (isOpen) tl.progress(1);

            return () => {
                splits.forEach((s) => s.revert());
                tl.kill();
                tlRef.current = null;
            };
        }, { scope: sidePanelRef, dependencies: [isAuthenticated] });

        // Toggle
        useLayoutEffect(() => {
            if (isOpen) tlRef.current?.play();
            else tlRef.current?.timeScale(1.5).reverse();
        }, [isOpen]);

        const visibleLinks = navLinks.filter((group) => !group.protected || isAuthenticated);

        return (
            <aside
                ref={ mergedRef }
                className={ cn(sidePanelClasses()) }
            >
                { visibleLinks.map((group, index) => (
                        <React.Fragment key={ group.title || index }>
                            <SidePanelGroup title={ group.title }>
                                { group.items.map((item) => (
                                        <SidePanelItem
                                            key={ item.href }
                                            item={ item }
                                            active = { pathname === item.href }
                                            onClose={ onClose }
                                        />
                                    )
                                ) }
                            </SidePanelGroup>

                            { index < visibleLinks.length - 1 && <Seperator /> }
                        </React.Fragment>
                    ))
                }
            </aside>
        );
    }
);

const SidePanelGroup = ({title, children}: {title?: string, children: React.ReactNode }) => (
    <div className='flex flex-col gap-1'>
        { title && (
            <span className='side-panel-title text-xs font-bold text-accent px-2 mb-1 tracking-wide select-none'>
                { title }
            </span>
        ) }
        { children }
    </div>
);

const SidePanelItem = ({
    item,
    active,
    onClose
}: {
    item: SidePanelItemInterface
    active?: boolean,
    onClose?: () => void
}) => {
    const { icon: Icon, label, href } = item;

    return (
        <Button
            asChild
            variant='ghost'
            onClick={ onClose }
            className={ cn(sidePanelItemClasses({ active })) }
        >
            <Link
                href={ href }
                className='flex w-full items-center justify-between'
            >
                <span className='side-panel-label'>
                    { label }
                </span>
                <Icon
                    size={ 18 }
                    strokeWidth={ active ? 2.5 : 2 }
                    className='side-panel-icon transform-gpu'
                />
            </Link>
        </Button>
    );
};

const Seperator = () => (
    <div
        className='side-panel-seperator h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent'
    />
);

SidePanel.displayName = 'SidePanel';

export { SidePanel, SidePanelProps, SidePanelItemInterface, SidePanelGroupInterface };