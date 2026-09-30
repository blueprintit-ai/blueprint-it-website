import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// The prerender step builds twice: the normal client bundle into dist/, then
// an SSR bundle into dist-ssr/ that scripts/prerender-meta.mjs imports to
// render each route to static HTML. BUILD_TARGET=ssr selects the second pass.
const isSSR = process.env.BUILD_TARGET === 'ssr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: isSSR ? 'dist-ssr' : 'dist',
    // dist-ssr is a build-time artifact only; it must not shadow public/.
    copyPublicDir: !isSSR,
  },
})
