'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { cva } from "class-variance-authority";
import { CircleUserRound, LucideIcon } from "lucide-react";

import { Button } from "../button/button";

import { useRafMediaQuery } from "../../utils/useRafMediaQuery";

import { cn } from "../../utils/cn";

import type { AuthCardProps } from "../authCard/authCard";

import { useTouch } from "../../utils/useTouch";

const LazyAuthCard = dynamic(
    () => import('../authCard/authCard').then((m) => m.AuthCard),
    {
        ssr: false,
        loading: () => null,
    }
) as React.ComponentType<AuthCardProps>;


// Tailwind
const overlayClasses = 'fixed inset-0 z-30 backdrop-blur-md transform-gpu';
const panelClasses = 'absolute z-39 flex flex-col gap-2 p-3 w-full bg-surface rounded-4xl border border-accent outline-none will-change[clip-path,transform] transform-gpu backface-hidden';

const sidePanelItemClasses = cva(
    [
        'side-panel-item group relative flex w-full overflow-visible',
        'transition-colors duration-150 ease-in-out',
        'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent focus-within:ring-offset-surface'
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
        const isTouch = useTouch();

        const pathname = usePathname();
        const { isMobile } = useRafMediaQuery();

        // Toggle
        const handleClose = useCallback(() => {
            if (tlRef.current) tlRef.current.timeScale(2).reverse().then(onClose);
            else onClose();
        }, [onClose]);

        // Auth Toggle
        const handleAuthOpen = () => {
            setIsAuthOpen(true);
            handleClose();
        };

        const visibleLinks = useMemo(() => navLinks.filter((group) => !group.protected || isAuthenticated), [navLinks, isAuthenticated]);

        // Position + Animation + Mobile Swipe
        useGSAP(() => {
            const content = contentRef.current;
            const panel = panelRef.current;
            const navbar = navbarRef.current;
            if (!isOpen || !content || !panel || !navbar) return;

            const updatePosition = () => {
                const navbarRect = navbar.getBoundingClientRect();

                return {
                    left: navbarRect.left,
                    top: navbarRect.bottom + 12,
                    width: isMobile ? navbarRect.width : 320
                };
            };

            gsap.set(content, updatePosition());
            gsap.set(panel, {
                transformOrigin: '50% 0%',
                willChange: 'clip-path, transform, opacity',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain'
            });

            const items = panel.querySelectorAll('.side-panel-item');
            const titles = panel.querySelectorAll('.side-panel-title');

            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
            tl.fromTo(panel, {
                y: -12,
                clipPath: 'circle(0% at 50% 0%)',
                autoAlpha: 0
            }, {
                y: 0,
                clipPath: 'circle(150% at 50% 0%)',
                autoAlpha: 1,
                duration: 0.65,
                ease: 'power4.inOut',
                stagger: 0.05
            }, 0)
            .fromTo(panel, {
                clipPath: 'circle(0% at 50% 0%)',
                autoAlpha: 0
            }, {
                clipPath: 'circle(150% at 50% 0%)',
                autoAlpha: 1,
                duration: 0.65,
                ease: 'power4.inOut',
                stagger: 0.05
            }, '<');

            items.forEach((item) => {
                const icon = item.querySelector<HTMLElement>('.side-panel-icon');
                const label = item.querySelector('.side-panel-label');
                if (!label) return;

                const split = new SplitText(label as HTMLElement, { type: 'chars' });

                tl.from(split.chars, {
                    yPercent: 100,
                    autoAlpha: 0,
                    rotateX: -90,
                    stagger: 0.02,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    onComplete: () => split.revert()
                }, '<+0.04');

                if (icon) tl.from(icon, {
                    scale: 0,
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: 'back.out(2)'
                }, '<');
            });

            tl.from(titles, {
                x: -20,
                autoAlpha: 0,
                duration: 0.4,
                stagger: 0.1
            }, 0.2);

            tlRef.current = tl;

            const resizeObserver = new ResizeObserver(() => {
                const state = Flip.getState(content);
                gsap.set(content, updatePosition());

                Flip.from(state, {
                    duration: 0.3,
                    ease: 'expo.out',
                    simple: true
                });
            });
            resizeObserver.observe(navbar);

            const swipeObserver = isTouch
                ? Observer.create({
                    target: panel,
                    type: 'touch,pointer',
                    capture: true,
                    lockAxis: true,
                    onUp: (self) => {
                        if (isOpen && self.deltaY < -10) handleClose();
                    },
                    dragMinimum: 10,
                    preventDefault: true
                })
                : null;

            return () => {
                resizeObserver.disconnect();
                swipeObserver?.kill();
                tl.kill();
            };
        }, { dependencies: [isOpen, isMobile, isTouch, navbarRef, handleClose] });

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
                                    <VisuallyHidden.Root>
                                        <Dialog.Title>Navigation Menu</Dialog.Title>
                                        <Dialog.Description>Access navigation links and account settings</Dialog.Description>
                                    </VisuallyHidden.Root>
                                    <aside
                                        ref={ panelRef }
                                        className={ panelClasses }
                                    >
                                        {/* Navigation */}
                                        { visibleLinks.map((group, index) => (
                                            <React.Fragment key={ group.title || index }>
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
                { isAuthOpen && (
                    <LazyAuthCard
                        open={ isAuthOpen }
                        onOpenChange={ setIsAuthOpen }
                        { ...authProps }
                    />
                ) }

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
                className='flex w-full items-center justify-between'
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

export { SidePanel, type SidePanelProps, type SidePanelItemInterface, type SidePanelGroupInterface };
