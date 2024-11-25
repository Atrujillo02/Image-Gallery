import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gallery/',
  server: {
    port: 4173,
    host: true
  }
});