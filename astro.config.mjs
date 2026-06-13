// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Static build -> deploys to Cloudflare Pages (serves the dist/ folder).
// No adapter needed for output: 'static'. If server-side features are added
// later (e.g. the Resend booking form), switch to the @astrojs/cloudflare adapter.
export default defineConfig({
  site: 'https://skywyo.com',
  output: 'static',
  integrations: [react(), sitemap()],
});
