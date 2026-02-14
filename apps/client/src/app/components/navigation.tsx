'use client';

import React, { useState } from 'react';

import { AuthCardView, Navbar, SidePanelGroupInterface } from '@amnaya.info/ui-kit';
import { Contact, House, MessageCircle, Settings, UserCheckIcon } from 'lucide-react';

import { AuthProps } from './auth';

import { loginSchema, signupSchema, forgotPasswordSchema } from './validation';

const navLinks: SidePanelGroupInterface[] = [
  {
    title: 'Navigation',
    items: [
        { label: 'Home', href: '/', icon: House },
        { label: 'About', href: '/about', icon: Contact }
    ]
  },
  {
    title: 'User',
    protected: true,
    items: [
        { label: 'Account', href: '/account', icon: UserCheckIcon },
        { label: 'Chat', href: '/chat', icon: MessageCircle },
        { label: 'Preferences', href: '/preferences', icon: Settings }
    ]
  }
];

function Navigation() {
  const {
    values,
    errors,
    isLoading,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
  } = AuthProps();

  const [view, setView] = useState<AuthCardView>('login');

  const getCurrentSchema = () => {
    switch (view) {
      case 'login': return loginSchema;
      case 'signup': return signupSchema;
      case 'forgotPassword': return forgotPasswordSchema;
      default: return loginSchema;
    }
  }

  const onAuthSubmit = async (data: any) => {
    try {
      if (view === 'login') {
        console.log('Logging in with:', data);
      }
      else if (view === 'signup') {
        console.log('Signing up with:', data);
      }
      else if (view === 'forgotPassword') {
        console.log('Resetting password for:', data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleAuthSubmit = (submittedView: AuthCardView, e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(getCurrentSchema(), onAuthSubmit);
  };

  const handleViewChange = (nextView: AuthCardView) => {
    if (nextView === view) return;
    setView(nextView);
    resetForm();
  };

  return (
    <Navbar
      navLinks={ navLinks }
      isAuthenticated={false}
      // user={user}
      authProps={{
        credentials: values,
        errors: errors,
        isLoading: isLoading,
        onFieldChange: (field, value) => handleFieldChange(field, value, getCurrentSchema()),
        onFieldBlur: (field) => handleFieldBlur(field, getCurrentSchema()),
        onSubmit: (view, e) => handleAuthSubmit(view, e),
        onViewChange: handleViewChange,
      }}
    />
  );
}

export { Navigation };