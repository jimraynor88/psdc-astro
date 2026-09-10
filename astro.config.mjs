import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://PULSO-ARCHIVO.workers.dev', // ← tu workers.dev real
  output: 'server',                          // ← SSR total: lo que pide Keystatic
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});
