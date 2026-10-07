import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough', // Wyłącza konflikt z domyślnymi zasobami graficznymi
    platformProxy: {
      enabled: true
    }
  })
});