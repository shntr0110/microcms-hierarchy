import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://localhost:3000',
  integrations: [react(), sitemap()],
  vite: {},
  image: {
    domains: ['images.microcms-assets.io']
  }
})
