import type { Preview } from '@storybook/nextjs';
import { useEffect } from 'react';

import '../src/lib/theme/styles.css';

// import { SceneLayout } from '../src/lib/theme/background/sceneLayout';

import { registerGsapPlugins } from '../src/lib/utils/registerGsapPlugins';
if (typeof window !== 'undefined') registerGsapPlugins();

const StoryWrapper = ({ children, context }: any) => {

  useEffect(() => {
    const root = document.documentElement;
    if (context.globals.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [context.globals.theme]);

  return (
    // <SceneLayout children={ children } />
    <div className='relative w-full h-screen'>
      { children }
    </div>
  );
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background}color)$/i,
        date: /Date$/i
      }
    }
  },
  globalTypes: {
    theme: {
      title: 'Theme',
      description: 'Global Theme Toggle',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        showName: true
      }
    }
  },
  decorators: [
    (Story, context) => (
      <StoryWrapper context={ context } children={ <Story />} />
    )
  ]
};

export default preview;
