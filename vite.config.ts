import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { staticFeedsPlugin } from './vite-plugins/static-feeds';
import settings from './src/data/settings.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'short-paws-blog',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
    staticFeedsPlugin({
      siteUrl: settings.seo?.siteUrl || 'https://shortpaws.netlify.app',
      siteTitle: settings.title || "Gizmeli Kedi's Personal Website",
      siteDescription: settings.description || '',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
