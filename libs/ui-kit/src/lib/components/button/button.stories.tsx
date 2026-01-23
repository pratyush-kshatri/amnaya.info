import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';
import { FlaskConical } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'ghost'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
    icon: {
      control: 'boolean'
    }
  },
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Click Me',
    icon: <FlaskConical className='w-5 h-5' />
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};