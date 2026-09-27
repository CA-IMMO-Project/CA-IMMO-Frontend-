import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Configuration Vite — le site est un SPA 100 % front (aucun backend local).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // HMR désactivable (DISABLE_HMR=true) pour les aperçus proxifiés.
    hmr: process.env.DISABLE_HMR !== 'true',
    host: '0.0.0.0',
    // Autorise les aperçus proxifiés (sandbox / preview) en plus de localhost.
    allowedHosts: true,
  },
});
