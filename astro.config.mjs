import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://cornellxr.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !['/404/', '/apply/', '/coffeechat/'].some((path) => page.endsWith(path)) }), icon({ include: { 'fa6-brands': ['instagram', 'linkedin', 'github'] } })],
  devToolbar: { enabled: false },
});
