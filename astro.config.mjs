import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://pod.jim88.de', // ← tu workers.dev real
  output: 'server',                          // ← SSR total: lo que pide Keystatic
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});
