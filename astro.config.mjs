import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkGuideFigures } from './src/lib/guide-images.mjs';

export default defineConfig({
  site: 'https://axendai.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  markdown: { remarkPlugins: [remarkGuideFigures] },
});
