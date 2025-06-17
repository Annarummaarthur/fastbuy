// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/vitest-setup.ts',
    exclude: ['tests/e2e/**', '**/e2e/**', 'node_modules/**'],
  },
});
