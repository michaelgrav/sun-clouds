import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        // Keep the heaviest vendors out of the entry chunk to avoid size warnings.
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('@mantine/charts') || id.includes('recharts')) {
            return 'charts';
          }

          if (id.includes('@mantine')) {
            return 'mantine';
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react';
          }

          return 'vendor';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
