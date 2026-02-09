'use client';

import React from "react";

// Shared Styles
const styles = {
    label: 'px-2 block text-xs text-foreground font-semibold tracking-tight',
    input: 'form-input w-full border-b border-accent rounded-full px-4 py-2 placeholder:text-accent focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-surface',
    icon: 'form-left w-5 h-5 text-accent flex-shrink-0',
    seperator: 'mt-2 mb-2 h-[1px] w-full bg-gradient-to-r from-transparent via-accent to-transparent',
};

// Shared Props
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

export { styles, SharedAuthCardProps, viewOrder, AuthCardView };