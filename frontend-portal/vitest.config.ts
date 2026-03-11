import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser', 'development'],
    alias: {
      '@modules': path.join(rootDir, 'src/modules'),
      '@components': path.join(rootDir, 'src/components'),
      '@pages': path.join(rootDir, 'src/pages'),
      '@styles': path.join(rootDir, 'src/styles'),
      '@layouts': path.join(rootDir, 'src/layouts'),
      '@store': path.join(rootDir, 'src/store'),
      '@utils': path.join(rootDir, 'src/utils'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts'],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
  },
});
