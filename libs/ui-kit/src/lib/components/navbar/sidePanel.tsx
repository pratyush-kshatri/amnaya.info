'use client';

import React, { useMemo, useRef, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { CircleUserRound, LucideIcon } from "lucide-react";

import { Button } from "../button/button";

import { useRafMediaQuery } from "../../utils/useRafMediaQuery";

import { cn } from "../../utils/cn";

import { AuthCard, AuthCardProps } from "../authCard/authCard";
import { useTouch } from "../../utils/useTouch";
import { Observer } from "gsap/Observer";

// Tailwind
const overlayClasses = 'fixed inset-0 z-40 backdrop-blur-md transform-gpu';
const panelClasses = 'absolute z-50 flex flex-col gap-2 px-4 py-2 w-full bg-surface rounded-4xl border border-accent outline-none transform-gpu backface-hidden';

const sidePanelItemClasses = cva(
    [
        'side-panel-item group relative flex w-full overflow-visible',
        'transition-colors duration-150 ease-in-out',
        'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent'
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
    user?: {
        name: string;
        email: string;
        avatar?: string;
    }
    navbarRef: React.RefObject<HTMLElement | null>;
    navLinks: SidePanelGroupInterface[];
    authProps: Omit<AuthCardProps, 'trigger'>;
    onClose: () => void;
};

const SidePanel = React.forwardRef<HTMLDivElement, SidePanelProps>(
    ({
        isOpen,
        isAuthenticated,
        user,
        navbarRef,
        navLinks,
        authProps,
        onClose
    }, ref) => {
        const overlayRef = useRef<HTMLDivElement>(null);
        const panelRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        const [isAuthOpen, setIsAuthOpen] = useState(false);

        const tlRef = useRef<gsap.core.Timeline>(null);

        const pathname = usePathname();
        const { isMobile } = useRafMediaQuery();

        // Width Animation
        useGSAP(() => {
            const content = contentRef.current;
            const navbar = navbarRef.current;
            if (!navbar || !content) return;

            const handleResize = () => {
                if (!isOpen) return;

                const state = Flip.getState(content);
                const navbarRect = navbar.getBoundingClientRect();

                // Update Position
                gsap.set(content, {
                    left: navbarRect.left,
                    top: navbarRect.bottom + 12,
                    width: isMobile ? navbarRect.width : 320
                });

                // Animate New Position
                Flip.from(state, {
                    duration: 0.3,
                    ease: 'power3.inOut',
                    simple: true
                });
            };

            handleResize();

            const observer = new ResizeObserver(() => requestAnimationFrame(handleResize));
            observer.observe(navbar);

            return () => observer.disconnect();
        }, { scope: contentRef, dependencies: [isOpen, isMobile, navbarRef] });

        // Animation
        useGSAP(() => {
            const panel = panelRef.current;
            if (!isOpen || !panel) return;

            // Touch
            gsap.set(panel, {
                touchAction: 'pan-y',
                overscrollBehavior: 'contain'
            })

            const items = panel.querySelectorAll('.side-panel-item');
            const titles = panel.querySelectorAll('.side-panel-title');

            const tl = gsap.timeline({
                defaults: {
                    ease: 'expo.out',
                    force3D: true
                }
            });

            // Open/Close Animation
            tl.fromTo(panel, {
                y: -12,
                clipPath: 'circle(0% at 50% 0%)',
                blur: '8px',
                opacity: 0
            }, {
                y: 0,
                clipPath: 'circle(150% at 50% 0%)',
                blur: '0px',
                opacity: 1,
                duration: 0.6,
                ease: 'power3.inOut'
            }, 0)
            .fromTo(overlayRef.current, {
                clipPath: 'circle(0% at 50% 0%)',
                opacity: 0
            }, {
                clipPath: 'circle(150% at 50% 0%)',
                opacity: 1,
                duration: 0.6,
                ease: 'power3.inOut'
            }, 0);            

            items.forEach((item, index) => {
                const icon = item.querySelector<HTMLElement>('.side-panel-icon');
                const label = item.querySelector('.side-panel-label');

                const split = new SplitText(label as HTMLElement, { type: 'chars' });

                if (label) tl.from(split.chars, {
                    y: 8,
                    opacity: 0,
                    rotateX: -90,
                    stagger: 0.02,
                    duration: 0.4,
                    onComplete: () => split.revert()
                }, '>-0.3');

                if (icon) tl.from(icon, {
                    x: 12,
                    opacity: 0,
                    duration: 0.3
                }, '<');
            });

            // Title Animation
            tl.from(titles, {
                x: -10,
                opacity: 0,
                duration: 0.3
            }, '>-0.3');

            tlRef.current = tl;
        }, { scope: panelRef, dependencies: [isOpen] });

        // Toggle
        const handleClose = () => {
            if (tlRef.current) tlRef.current.timeScale(1.5).reverse().then(onClose);
            else onClose();
        };

        // Auth Toggle
        const handleAuthOpen = () => {
            setIsAuthOpen(true);
            handleClose();
        };

        const visibleLinks = useMemo(() => navLinks.filter((group) => !group.protected || isAuthenticated), [navLinks, isAuthenticated]);

        // Mobile - Swipe
        useGSAP(() => {
            if (!useTouch || !panelRef.current || !isOpen) return;

            const swipeObserver = Observer.create({
                target: panelRef.current,
                type: 'touch,pointer',
                capture: true,
                lockAxis: true,
                onUp: () => {
                    if (isOpen) handleClose();
                },
                dragMinimum: 10,
                preventDefault: true
            });

            return () => swipeObserver.kill();
        }, [isOpen]);

        return (
            <React.Fragment>
                <Dialog.Root
                    open={ isOpen }
                    onOpenChange={ (s) => !s && handleClose() }
                >
                    <Dialog.Portal forceMount>
                        { isOpen && (
                            <React.Fragment>
                                <Dialog.Overlay
                                    ref={ overlayRef }
                                    className={ overlayClasses }
                                />
                                <Dialog.Content
                                    ref={ contentRef }
                                    className='fixed z-50 outline-none'
                                >
                                    <aside
                                        ref={ panelRef }
                                        className={ panelClasses }
                                    >
                                        {/* Navigation */}
                                        { visibleLinks.map((group, index) => (
                                            <React.Fragment>
                                                <SidePanelGroup title={ group.title }>
                                                    { group.items.map((item) => (
                                                        <SidePanelItem
                                                            key={ item.href }
                                                            item={ item }
                                                            active={ pathname === item.href }
                                                            onClose={ handleClose }
                                                        />
                                                    )) }
                                                </SidePanelGroup>

                                                { index < visibleLinks.length -1 && <Seperator /> }
                                            </React.Fragment>
                                        )) }

                                        <Seperator />

                                        {/* User Card */}
                                        <SidePanelHeader
                                            isAuthenticated={ isAuthenticated }
                                            user={ user }
                                            onClose={ handleClose }
                                            onAuthOpen = { handleAuthOpen }
                                        />
                                    </aside>
                                </Dialog.Content>
                            </React.Fragment>
                        ) }
                    </Dialog.Portal>
                </Dialog.Root>

                {/* Auth Card */}
                <AuthCard
                open={ isAuthOpen }
                onOpenChange={ setIsAuthOpen }
                    { ...authProps }
                />

            </React.Fragment>
        );
    }
);

const SidePanelHeader = React.memo(({
    isAuthenticated,
    user,
    onClose,
    onAuthOpen
} :
    Pick<SidePanelProps, 'isAuthenticated' | 'user' | 'onClose'> & { onAuthOpen: () => void }
) => {
    const pathname = usePathname();
    const active = pathname === '/profile';
    
    if (!isAuthenticated) return (
        <div className='side-panel-item w-full flex justify-center'>
            <Button
                variant='accent'
                className='mx-auto'
                onClick={ onAuthOpen }
            >
                <span className='side-panel-label'>Login / Signup</span>
            </Button>
        </div>
    );
    else return (
        <Button
            asChild
            variant='ghost'
            onClick={ onClose }
            className={ cn(sidePanelItemClasses({ active })) }
        >
            <Link
                href='/profile'
                aria-current={ active ? 'page' : undefined }
                className='flex w-full items-center justify-between px-4 py-2'
            >
                <span className='side-panel-label'>
                    Hi, { user?.name }!
                </span>
                { user?.avatar ? (
                    <img src={ user.avatar } alt='User' className='rounded-full object-cover' />
                ) : (
                    <CircleUserRound
                        size={ 18 }
                        strokeWidth={ pathname === '/profile' ? 2.5 : 2 }
                        className='side-panel-icon transform-gpu'
                    />
                ) }
            </Link>
        </Button>
    );
})

const SidePanelGroup = ({title, children}: {title?: string, children: React.ReactNode }) => (
    <div className='flex flex-col gap-2'>
        { title && (
            <span className='side-panel-title text-xs font-bold text-accent ml-4 tracking-wide select-none'>
                { title }
            </span>
        ) }
        { children }
    </div>
);

const SidePanelItem = React.memo(({
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
                aria-current={ active ? 'page' : undefined }
                className='flex w-full items-center justify-between outline-none'
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
});

const Seperator = () => (
    <div
        className='side-panel-seperator h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent'
    />
);

SidePanel.displayName = 'SidePanel';

export { SidePanel, SidePanelProps, SidePanelItemInterface, SidePanelGroupInterface };