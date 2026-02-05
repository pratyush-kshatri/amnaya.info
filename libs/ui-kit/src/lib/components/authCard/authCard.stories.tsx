import type { Meta, StoryObj } from '@storybook/nextjs';
import { AuthCard } from './authCard';

import { Button } from '../button/button';

//Mock Credentials
const MOCK_CREDENTIALS = {
  usernameOrEmail: '',
  password: '',
  rememberMe: false,
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  username: '',
  email: '',
  confirmPassword: ''
};

const meta: Meta<typeof AuthCard> = {
  title: 'Components/AuthCard',
  component: AuthCard,
  args: {
    credentials: MOCK_CREDENTIALS,
    onFieldChange: (field: string, value: any) => console.log(`${field} changed to ${value}`),
    onSubmit: () => alert('Submit Triggered'),
    trigger: <Button variant='accent'>Login / Signup</Button>
  }
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const Playground: Story = {};