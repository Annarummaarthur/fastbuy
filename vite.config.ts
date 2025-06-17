/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // rend `describe`, `it`, `expect` globaux
    environment: 'jsdom', // simule le DOM (utile pour React)
    setupFiles: './src/setupTests.ts', // ton fichier de configuration des tests
    include: ['src/**/*.test.{ts,tsx}'], // où chercher les fichiers de test
  },
});
