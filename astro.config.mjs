import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: ganti dengan domain final setelah beli
const SITE_URL = 'https://jagoclaw.id';

export default defineConfig({
  site: SITE_URL,
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'id',
        locales: { id: 'id-ID', en: 'en-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
