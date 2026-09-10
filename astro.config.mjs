import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://PULSO-ARCHIVO.workers.dev', // ← cámbiala cuando tengas tu dominio
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});
