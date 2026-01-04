import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI Kit/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Click Me',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};