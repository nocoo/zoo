import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'voice-preview-index',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === '/voice-preview/' || request.url === '/voice-preview') request.url = '/voice-preview/index.html';
        next();
      });
    },
  }],
  server: {
    port: 7058,
    strictPort: true,
    allowedHosts: ['zoo.dev.hexly.ai'],
  },
});
