import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Lafaba dashboard v2 – Vite config
export default defineConfig({
  // GitHub Pages alt yolu
  // repo adı: lafaba-dashboard-v2 → /lafaba-dashboard-v2/
  base: '/lafaba-dashboard-v2/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
