'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { X } from 'lucide-react';

import { useRafMediaQuery } from '../../utils/useRafMediaQuery';

import { Button } from '../button/button';

import { LoginForm } from './loginForm';
import { SignupForm } from './signupForm';
import { ForgotPasswordForm } from './forgotPasswordForm';

// Tailwind
const overlayClasses = 'fixed inset-0 z-40 backdrop-blur-md transform-gpu';
const cardClasses = 'fixed z-50 flex flex-col rounded-md border border-accent text-foreground bg-surface p-4 transform-gpu overflow-hidden outline-none';
// Shared
const styles = {
    label: 'px-2 block text-xs font-semibold tracking-tight cursor-pointer',
    input: 'form-input w-full border-b border-accent rounded-md px-4 py-2 outline-none placeholder:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent',
    icon: 'form-left w-5 h-5 text-accent stroke-[2.5]',
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
    credentials: Record<string, any>;
    errors?: Record<string, string | undefined>;
    isLoading?: boolean;
    onFieldChange: (field: string, value: any) => void;
    onFieldBlur?: (field: string) => void;
    onSubmit: (view: AuthCardView, e: React.FormEvent) => void;
    onOAuth?: (provider: 'google' | 'github') => void;
}

const AuthCard = React.forwardRef<HTMLDivElement, AuthCardProps> (
    ({
        credentials,
        errors = {},
        isLoading,
        onFieldChange,
        onFieldBlur,
        onSubmit,
        onOAuth
    }, ref) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const overlayRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const cardRef = useRef<HTMLDivElement>(null);

        const previousState = useRef<Flip.FlipState | null>(null);
        const previousViewRef = useRef<AuthCardView | null>(null);
        const previousStepRef = useRef<number | null>(null);
        const tlRef = useRef<gsap.core.Timeline | null>(null);

        const [isOpen, setIsOpen] = useState(false);
        const [view, setView] = useState<AuthCardView>('login');
        const [signupStep, setSignupStep] = useState(1);
        const [direction, setDirection] = useState(1);

        const { isMobile } = useRafMediaQuery();

        // Content Transition
        const transition = useCallback((target: AuthCardView | number) => {
            const content = contentRef.current;
            const card = cardRef.current;
            if (!content || !card) return;

            // View/Step Change
            const hasViewChanged = typeof target === 'string';

            // Direction
            let d = 1;
            if (hasViewChanged) d = viewOrder[target as AuthCardView] > viewOrder[view] ? 1 : -1;
            else d = (target as number) > signupStep ? 1 : -1;
            setDirection(d);

            // Flip
            previousState.current = Flip.getState(card);
            gsap.to(content, {
                x: -120 * d,
                opacity: 0,
                blur: '8px',
                duration: 0.3,
                ease: 'expo.out',
                onComplete: () => {
                    // Reset
                    if (hasViewChanged) {
                        setView(target as AuthCardView);
                        setSignupStep(1);
                    } else setSignupStep(target as number);
                }
            });
        }, [view, signupStep]);

        // Animations
        useGSAP(() => {
            const card = cardRef.current;
            const content = contentRef.current;
            if (!isOpen || !card || !content) return;

            // Content Changes
            const isFirstOpen = previousViewRef.current === null;
            const hasViewChanged = previousViewRef.current !== view;

            previousViewRef.current = view;
            previousStepRef.current = signupStep;

            // Centering
            gsap.set(card, {
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                width: isMobile ? '90%' : 500,
                minHeight: view === 'signup' ? 367 : 'auto',
                height: 'auto'
            });

            const tl = gsap.timeline({
                defaults: {
                    ease: 'expo.out',
                    force3D: true
                }
            });

            // First Mount - Card + Overlay
            if (isFirstOpen) tl.fromTo([card, overlayRef.current], {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0
            }, {
                clipPath: 'circle(150% at 50% 50%)',
                opacity: 1,
                duration: 0.6,
                ease: 'power3.inOut'
            });

            // Flip - Resize
            if (previousState.current) tl.add(Flip.from(previousState.current, {
                targets: card,
                duration: 0.3,
                ease: 'power3.inOut',
                simple: true,
                onComplete: () => Flip.killFlipsOf(card)
            }), isFirstOpen ? 0.4 : 0);

            // SplitText - Title
            if (hasViewChanged) {
                const title = card.querySelector('.form-title');
                if (title) {
                    const split = new SplitText(title, { type: 'chars' });
                    tl.from(split.chars, {
                        y: 12,
                        opacity: 0,
                        rotateX: -90,
                        stagger: 0.02,
                        duration: 0.3,
                        onComplete: () => split.revert()
                    }, '-=0.3');
                }
            }

            // Content
            tl.fromTo(content, {
                x: 120 * direction,
                opacity: 0,
                blur: '8px'
            }, {
                x: 0,
                opacity: 1,
                blur: '0px',
                duration: 0.3,
                clearProps: 'all'
            }, '<');

            // Text + Buttons Animation
            tl.from(['.form-label', '.form-button'], {
                y: 16,
                opacity: 0,
                duraiton: 0.3,
                stagger: 0.2
            }, '-=0.3')
            // Left Animation
            .from('.form-left', {
                x: -16,
                opacity: 0,
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
                opacity: 0,
                duration: 0.3,
                stagger: 0.1
            }, '>');

            tlRef.current = tl;
        }, { scope: cardRef, dependencies: [isOpen, view, signupStep, isMobile] });

        // Close Animation
        const closeDialog = useCallback(() => {
            const tl = tlRef.current;
            if (tl) tl.timeScale(1.5).reverse().then(() => {
                // Reset All
                setIsOpen(false);
                setTimeout(() => {
                    setView('login');
                    setSignupStep(1);
                    setDirection(1);
                    previousViewRef.current = null;
                }, 500);
            });
            else setIsOpen(false);
        }, []);

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
                <Dialog.Trigger asChild>
                    <Button
                        ref={ buttonRef }
                        variant='accent'
                    >
                        Login / Signup
                    </Button>
                </Dialog.Trigger>

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
                                ref={ cardRef }
                                className={ cardClasses }
                            >
                                {/* Header */}
                                <header className='relative flex justify-center items-center'>
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
                                    ref={ contentRef }
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