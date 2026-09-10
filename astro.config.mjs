// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://pod.jim88.de',
  output: 'hybrid',                    // ← cambio clave
  adapter: cloudflare({
    platformProxy: { enabled: true },  // ← necesario para que el adapter detecte bindings en dev
  }),
  integrations: [react(), markdoc(), keystatic()],
});
