import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

// GitHub Pages build: static SPA, served under the repo path
const isPages = process.env.GITHUB_PAGES === 'true'

const config = defineConfig({
  base: isPages ? '/nasser-military-high-school-platform/' : '/',
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    ...(isPages ? [] : [netlify()]),
    tanstackStart(isPages ? { spa: { enabled: true } } : undefined),
    viteReact(),
  ],
})

export default config
