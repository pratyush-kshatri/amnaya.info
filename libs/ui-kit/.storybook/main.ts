import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { mergeConfig, optimizeDeps } from 'vite';

import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {
      builder: {
        viteConfigPath: 'vite.config.mts',
      },
      viteFinal: async (config: any) => {
        return mergeConfig(config, {
          resolve: {
            alias: {
              three: path.resolve(process.cwd(), 'node_modules/three')
            },
            preserveSymlinks: false
          },
          optimizeDeps: {
            include: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing']
          }
        });
      }
    },
  },
};

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
