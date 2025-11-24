import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    // Use base path for GitHub Pages, root for Netlify
    const base = process.env.VITE_BASE_PATH || '/';

    return {
      base,
      publicDir: 'public',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
