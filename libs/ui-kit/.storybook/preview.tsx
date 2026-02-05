import type { Preview } from '@storybook/nextjs';

import '../src/lib/theme/styles.css';

import { registerGsapPlugins } from '../src/lib/utils/registerGsapPlugins';

if (typeof window !== 'undefined') registerGsapPlugins();

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background}color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;