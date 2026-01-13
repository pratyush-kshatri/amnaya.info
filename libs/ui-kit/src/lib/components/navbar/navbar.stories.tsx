import type { Meta, StoryObj } from '@storybook/nextjs';
import { Navbar } from './navbar';

import { Contact, House, MessageCircle, Settings, UserCheckIcon } from 'lucide-react';
import { SidePanelGroupInterface } from './sidePanel';
// DUMMY DATA
const MOCK_DATA: SidePanelGroupInterface[] = [
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

const meta: Meta<typeof Navbar> = {
    title: 'Components/Navbar',
    component: Navbar,
    parameters: {
        layout: 'fullscreen',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/' }
        }
    },
    argTypes: {
        onMenuToggle: {
            action: 'menu toggled'
        },
        isAuthenticated: {
            control: 'boolean'
        }
    },
    args: {
        navLinks: MOCK_DATA,
        isAuthenticated: false
    }
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Playground: Story = {};