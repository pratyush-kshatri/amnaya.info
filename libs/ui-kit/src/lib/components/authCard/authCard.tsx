'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { LogIn, UserPlus, X } from 'lucide-react';

import { useRafMediaQuery } from '../../utils/useRafMediaQuery';

import { registerGsapPlugins } from '../../utils/registerGsapPlugins';

import { Button } from '../button/button';

import { LoginForm } from './loginForm';
import { SignupForm } from './signupForm';
import { ForgotPasswordForm } from './forgotPasswordForm';

// Tailwind
const overlayClasses = 'fixed inset-0 z-40 backdrop-blur-md transform-gpu will-change-[clip-path,opacity]';

const cardClasses = 'fixed z-50 left-1/2 top-1/2 flex flex-col rounded-md border border-accent text-foreground bg-surface p-4 transform-gpu will-change-[clip-path,tranform,opacity] overflow-hidden outline-none';

// Shared
const styles = {
    label: 'px-2 block text-xs font-semibold tracking-tight',
    input: 'form-input w-full border-0 border-b border-accent rounded-md px-4 py-2 outline-none placeholder:text-accent',
    icon: 'form-left w-5 h-5 text-accent',
    seperator: 'mt-2 mb-2 h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent',
};

interface SharedAuthCardProps {
    isLoading?: boolean;
    errors?: Record<string, string | undefined>;
    values: Record<string, any>;
    onFieldChange: (field: string, value: any) => void;
    onFieldBlur?: (field: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    switchView: (view: AuthCardView) => void;    
}

type AuthCardView = 'login' | 'signup' | 'forgotPassword';

const viewOrder: Record<AuthCardView, number> = {
    forgotPassword: -1,
    login: 0,
    signup: 1
};

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
        const cardRef = useRef<HTMLDivElement>(null);
        const overlayRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const tlRef = useRef<gsap.core.Timeline | null>(null);

        const [isOpen, setIsOpen] = useState(false);
        const [view, setView] = useState<AuthCardView>('login');

        const [direction, setDirection] = useState(1);
        const { isMobile } = useRafMediaQuery();

        // Open Animation Card + Overlay
        useGSAP(() => {
            const card = cardRef.current;
            const overlay = overlayRef.current;
            if (!isOpen || !card || !overlay) return;

            // Centering
            gsap.set(card, { xPercent: -50, yPercent: -50 });

            const tl = gsap.timeline({
                defaults: {
                    transformOrigin: '50% 50%',
                    duration: 0.6,
                    ease: 'power3.inOut',
                    force3D: true
                }
            });

            tl.fromTo([card, overlay], {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0
            }, {
                clipPath: 'circle(150% at 50% 50%)',
                opacity: 1
            });

            tlRef.current = tl;
        }, { dependencies: [isOpen] });

        // Close Animation
        const closeDialog = useCallback(() => {
            const tl = tlRef.current;
            if (tl) tl.timeScale(1.5).reverse().then(() => {
                setIsOpen(false);
                setTimeout(() => {
                    setView('login');
                    setDirection(1);
                }, 200);
            });
            else setIsOpen(false);
        }, []);

        // View Animation
        const handleView = (newView: AuthCardView) => {
            const content = contentRef.current;
            if (!content) {
                setView(newView);
                return;
            }

            // Slide Direction
            const direction = viewOrder[newView] > viewOrder[view] ? 1 : -1;
            setDirection(direction);

            // Container
            gsap.to(content, {
                x: -30 * direction,
                opacity: 0,
                duration: 0.6,
                ease: 'expo.out',
                onComplete: () => {
                    gsap.set(content, { x: 0, opacity: 1 })
                    setView(newView);
                }
            });
        };

        // Resize Animation
        useGSAP(() => {
            const card = cardRef.current;
            const content = contentRef.current;
            if ( !isOpen || !card || !content) return;

            // Flip Plugin Registration
            registerGsapPlugins();

            // Current State
            const state = Flip.getState(card);

            // Set Width
            gsap.set(card, {
                width: isMobile ? '90%' : 500,
                height: 'auto'
            });

            // Animate to New State
            Flip.from(state, {
                targets: card,
                duration: 0.3,
                ease: 'power3.inOut',
                simple: true
            });

            const tl = gsap.timeline({
                defaults: {
                    ease: 'expo.out',
                    force3D: true
                }
            });

            // Content
            tl.to(content, {
                x: 0,
                duration: 0.3
            });
            //Title + Text + Buttons Animation
            tl.from(['.form-title', '.form-label', '.form-button'], {
                y: 16,
                opacity: 0,
                duraiton: 0.3,
                stagger: 0.2
            }, 0.2)
            // Left Animation
            .from('.form-left', {
                x: -16,
                opacity: 0,
                duration: 0.3,
                stagger: 0.1
            }, 0.3)
            // Right Animation
            .from('.form-right', {
                x: 16,
                opacity: 0,
                duration: 0.3,
                stagger: 0.1
            }, 0.3)
            // Input Animation
            .from('.form-input', {
                scaleX: 0,
                duration: 0.4
            }, 0.2);
        }, { scope: cardRef, dependencies: [view, isMobile, isOpen] });

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
                        Login <LogIn /> / Signup <UserPlus />
                    </Button>
                </Dialog.Trigger>

                <Dialog.Portal forceMount>
                    { isOpen && (
                        <React.Fragment>
                            {/* Background */}
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
                                            className='form-right absolute right-0 p-1 focus-visible:ring-accent'
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
                                            switchView={ handleView }
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
                                            switchView={ handleView }
                                        />
                                    ) }
                                    { view === 'forgotPassword' && (
                                        <ForgotPasswordForm
                                            values={ credentials }
                                            isLoading={ isLoading }
                                            onFieldChange={ onFieldChange }
                                            onSubmit={ handleSubmit }
                                            switchView={ handleView }
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