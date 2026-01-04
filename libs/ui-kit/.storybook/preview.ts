import React from 'react';

import '../src/lib/theme/styles.css';

import { registerGsapPlugins } from '../src/lib/utils/registerGsapPlugins';

registerGsapPlugins();

const preview = {
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        'div',
        { className: 'bg-background' },
        React.createElement(Story)
      ),
  ],
};

export default preview;