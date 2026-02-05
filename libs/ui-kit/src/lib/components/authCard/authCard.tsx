'use client';

import React, { ReactNode, useCallback, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { X } from 'lucide-react';

import { useRafMediaQuery } from '../../utils/useRafMediaQuery';

import { Button } from '../button/button';

import { cn } from '../../utils/cn';

import { LoginForm } from './loginForm';
import { SignupForm } from './signupForm';
import { ForgotPasswordForm } from './forgotPasswordForm';

// Tailwind
const overlayClasses = 'fixed inset-0 z-40 backdrop-blur-md transform-gpu pointer-events-auto';
const contentClasses = 'fixed left-1/2 top-1/2 z-50 flex flex-col w-full rounded-4xl border border-accent bg-surface p-4 overflow-hidden outline-none will-change-transform';
// Shared
const styles = {
    label: 'px-2 block text-xs text-foreground font-semibold tracking-tight',
    input: 'form-input w-full border-b border-accent rounded-md px-4 py-2 outline-none placeholder:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent',
    icon: 'form-left w-5 h-5 text-accent stroke-[2.5] flex-shrink-0',
    seperator: 'mt-2 mb-2 h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent',
};

interface SharedAuthCardProps {
    isLoading?: boolean;
    errors?: Record<string, string | undefined>;
    values: Record<string, any>;
    step?: number;
    onFieldChange: (field: string, value: any) => void;
    onFieldBlur?: (field: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    switchView: (view: AuthCardView) => void;
    onStepChange?: (step: number) => void;
}

const viewOrder: Record<AuthCardView, number> = {
    forgotPassword: -1,
    login: 0,
    signup: 1
};

type AuthCardView = 'login' | 'signup' | 'forgotPassword';

interface AuthCardProps {
    open?: boolean;
    credentials: Record<string, any>;
    errors?: Record<string, string | undefined>;
    isLoading?: boolean;
    onOpenChange?: (open: boolean) => void;
    onFieldChange: (field: string, value: any) => void;
    onFieldBlur?: (field: string) => void;
    onSubmit: (view: AuthCardView, e: React.FormEvent) => void;
    onOAuth?: (provider: 'google' | 'github') => void;
    trigger?: ReactNode;
}

const AuthCard = React.forwardRef<HTMLDivElement, AuthCardProps> (
    ({
        open,
        credentials,
        errors = {},
        isLoading,
        onOpenChange,
        onFieldChange,
        onFieldBlur,
        onSubmit,
        onOAuth,
        trigger
    }, ref) => {
        const [internalOpen, setInternalOpen] = useState(false);
        const isOpen = open !== undefined ? open : internalOpen;
        const setIsOpen = onOpenChange || setInternalOpen;

        const overlayRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const formRef = useRef<HTMLDivElement>(null);

        const flipState = useRef<Flip.FlipState | null>(null);
        const previousViewRef = useRef<AuthCardView | null>(null);
        const directionRef = useRef<number>(1);
        const tlRef = useRef<gsap.core.Timeline | null>(null);

        const [view, setView] = useState<AuthCardView>('login');
        const [signupStep, setSignupStep] = useState(1);

        const { isMobile } = useRafMediaQuery();

        // Centering
        useGSAP(() => {
            if (contentRef.current) gsap.set(contentRef.current, {
                xPercent: -50,
                yPercent: -50,
                width: isMobile ? '95vw' : 500
            });
        }, [isOpen, isMobile]);

        // Content Transition
        const transition = useCallback((target: AuthCardView | number) => {
            const form = formRef.current;
            if (!contentRef.current || !form) return;

            // View/Step Change
            const isViewChange = typeof target === 'string';

            // Direction
            const d = isViewChange
                ? (viewOrder[target as AuthCardView] > viewOrder[view] ? 1 : -1)
                : ((target as number) > signupStep ? 1 : -1);
            directionRef.current = d;

            // Flip - State before change
            flipState.current = Flip.getState(contentRef.current);

            gsap.to(form, {
                x: -50 * d,
                autoAlpha: 0,
                filter: 'blur(4px)',
                duration: 0.3,
                ease: 'expo.out',
                force3D: true,
                onComplete: () => {
                    // Reset
                    if (isViewChange) {
                        setView(target as AuthCardView);
                        setSignupStep(1);
                    } else setSignupStep(target as number);
                }
            });
        }, [view, signupStep]);

        // Animations
        useGSAP(() => {
            const content = contentRef.current;
            const form = formRef.current;
            if (!isOpen || !content || !form) return;

            if (tlRef.current) tlRef.current.kill();

            // Tracking - Previous View
            const isViewChange = previousViewRef.current !== view;
            previousViewRef.current = view;

            const tl = gsap.timeline({
                defaults: {
                    ease: 'expo.out',
                    force3D: true
                }
            });

            // First Mount - Card + Overlay
            if (!flipState.current) tl.fromTo([content, overlayRef.current], {
                clipPath: 'circle(0% at 50% 50%)',
                autoAlpha: 0
            }, {
                clipPath: 'circle(150% at 50% 50%)',
                autoAlpha: 1,
                duration: 0.6,
                ease: 'power3.inOut'
            }); // Flip - Resize
            else tl.add(Flip.from(flipState.current, {
                targets: content,
                duration: 0.3,
                ease: 'power3.inOut',
                // props: 'xPercent,yPercent',
                absolute: false,
                onComplete: () => { flipState.current = null }
            }));

            // SplitText - Title
            const titles = isViewChange
                ? content.querySelectorAll('.form-title')
                : form.querySelectorAll('.form-title');
            titles.forEach((title) => {
                const split = new SplitText(title as HTMLElement, { type: 'chars' });
                tl.from(split.chars, {
                    y: 12,
                    autoAlpha: 0,
                    rotateX: -90,
                    stagger: 0.02,
                    duration: 0.3,
                    onComplete: () => split.revert()
                }, '-=0.3');
            });

            // Form
            const directionX = 50 * directionRef.current;
            tl.fromTo(form, {
                x: directionX,
                autoAlpha: 0,
                filter: 'blur(4px)'
            }, {
                x: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.3
            }, '<');

            // Text + Buttons Animation
            tl.from(['.form-label', '.form-button'], {
                y: 12,
                autoAlpha: 0,
                duration: 0.3,
                stagger: 0.2
            }, '-=0.3')
            // Left Animation
            .from('.form-left', {
                x: -16,
                autoAlpha: 0,
                duration: 0.3,
                stagger: 0.1
            }, '<')
            // Input Animation
            .from('.form-input', {
                scaleX: 0,
                duration: 0.3
            }, '<')
            // Right Animation
            .from('.form-right', {
                x: 16,
                autoAlpha: 0,
                duration: 0.3,
                stagger: 0.1,
            }, '>');

            tlRef.current = tl;
        }, { scope: contentRef, dependencies: [isOpen, view, signupStep] });

        // Close Animation
        const closeDialog = useCallback(() => {
            const tl = tlRef.current;
            if (!tl) {
                setIsOpen(false);
                return;
            }

            tl.timeScale(2).reverse();
            // Reset All
            tl.eventCallback('onReverseComplete', () => {
                setIsOpen(false);
                // Reset
                setView('login');
                setSignupStep(1);
                directionRef.current = 1;
                flipState.current = null;
            });
        }, [setIsOpen]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(view, e);
        };

        const titles: Record<AuthCardView, string> = {
            login: 'Welcome to Amnaya',
            signup: 'Join Amnaya',
            forgotPassword: 'Reset Password'
        };

        return (
            <Dialog.Root
                open={ isOpen }
                onOpenChange={ (s) => s ? setIsOpen(true) : closeDialog() }
            >
                {/* Trigger Button */}
                { trigger &&
                    <Dialog.Trigger asChild>
                        { trigger }
                    </Dialog.Trigger>
                }

                <Dialog.Portal forceMount>
                    { isOpen && (
                        <React.Fragment>
                            {/* Overlay */}
                            <Dialog.Overlay
                                ref={ overlayRef }
                                className={ overlayClasses }
                            />
                            {/* Content */}
                            <Dialog.Content
                                ref={ contentRef }
                                className={ contentClasses }
                                onOpenAutoFocus={ (e) => e.preventDefault() }
                            >
                                {/* Header */}
                                <header
                                    className={ cn(
                                        'relative flex items-center w-full',
                                        isMobile ? 'justify-between' : 'justify-center'
                                    ) }
                                >
                                    <Dialog.Title className='form-title text-xl font-semibold text-accent tracking-tight'>
                                        { titles[view] }
                                    </Dialog.Title>

                                    <Dialog.Close asChild>
                                        <Button
                                            className='absolute right-0 p-1 focus-visible:ring-accent'
                                            variant='ghost'
                                            icon={ <X className='h-6 w-6 text-accent' /> }
                                        />
                                    </Dialog.Close>
                                </header>

                                {/* Seperator */}
                                <div className={ styles.seperator } />

                                {/* Form Content */}
                                <div
                                    ref={ formRef }
                                    className='relative w-full'
                                >
                                    { view === 'login' && (
                                        <LoginForm
                                            values={ credentials }
                                            errors={ errors }
                                            isLoading={ isLoading }
                                            onFieldChange={ onFieldChange }
                                            onFieldBlur={ onFieldBlur }
                                            onSubmit={ handleSubmit }
                                            switchView={ transition }
                                            onOAuth={ onOAuth }
                                        />
                                    ) }
                                    { view === 'signup' && (
                                        <SignupForm
                                            values={ credentials }
                                            isLoading={ isLoading }
                                            onFieldChange={ onFieldChange }
                                            onFieldBlur={ onFieldBlur }
                                            onSubmit={ handleSubmit }
                                            switchView={ transition }
                                            step={ signupStep }
                                            onStepChange={ transition }
                                        />
                                    ) }
                                    { view === 'forgotPassword' && (
                                        <ForgotPasswordForm
                                            values={ credentials }
                                            isLoading={ isLoading }
                                            onFieldChange={ onFieldChange }
                                            onSubmit={ handleSubmit }
                                            switchView={ transition }
                                        />
                                    ) }
                                </div>
                            </Dialog.Content>
                        </React.Fragment>
                    ) }
                </Dialog.Portal>
            </Dialog.Root>
        );
    }
);

AuthCard.displayName = 'AuthCard';

export { AuthCard, AuthCardProps, SharedAuthCardProps, styles };