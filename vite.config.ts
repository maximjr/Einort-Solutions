import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Points to src/ so `@/lib/foo` resolves to `src/lib/foo`.
        // Previously mapped to the repo root, which allowed accidentally importing
        // package.json, firestore.rules, etc. into the bundle.
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      hmr:   process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Let Vite emit warnings at the default 500KB threshold.
      // The previous 1500KB limit was suppressing a real problem, not fixing it.
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Firebase — large, always needed, but only the modules actually imported
            if (id.includes('node_modules/firebase')) return 'vendor-firebase';
            // Animation library — significant weight, lazy-loaded by most pages
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'vendor-motion';
            // Charts — admin-only, lazy-loaded behind protected route
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts';
            // Core React stack
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/')
            ) return 'vendor-react';
            // Smooth scroll — dynamically imported in Layout, keep in its own chunk
            if (id.includes('node_modules/lenis')) return 'vendor-lenis';
          },
        },
      },
    },
  };
});
