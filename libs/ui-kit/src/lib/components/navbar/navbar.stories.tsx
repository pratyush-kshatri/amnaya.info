import type { Meta, StoryObj } from '@storybook/nextjs';
import { Navbar } from './navbar';

import { Contact, House, MessageCircle, Settings, UserCheckIcon } from 'lucide-react';

import { SidePanelGroupInterface } from './sidePanel';

// Mock Nav Links
const MOCK_NAV: SidePanelGroupInterface[] = [
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
// Mock User
const MOCK_USER = {
    name: 'Pratyush',
    email: 'p.kshatri@outlook.com',
    avatar: ''
};
// Mock Auth
const MOCK_AUTH = {
    credentials: { usernameOrEmail: '', password: '', rememberMe: false },
    onFieldChange: () => console.log('Auth field changed'),
    onSubmit: () => alert('Submit Triggered')
};

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
        isAuthenticated: {
            control: 'boolean'
        }
    },
    args: {
        navLinks: MOCK_NAV,
        isAuthenticated: false,
        user: MOCK_USER,
        authProps: MOCK_AUTH
    }
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Playground: Story = {};