import type { Meta, StoryObj } from '@storybook/nextjs';
import { AuthCard, AuthCardProps } from './authCard';
import { useState } from 'react';

const AuthCardWrapper = (args: AuthCardProps) => {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });

  const handleFieldChange = (field: string, value: any) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AuthCard
      { ...args }
      credentials={ credentials }
      onFieldChange={ handleFieldChange }
      onSubmit={ () => alert('Submit Triggered') }
    />
  );
};

const meta: Meta<typeof AuthCard> = {
  title: 'Components/AuthCard',
  component: AuthCard,
  parameters: {
    layout: 'centered',
  }
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const Playground: Story = {
  render: (args) => <AuthCardWrapper { ...args } />
};