import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from './package.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Replace __SW_VERSION__ in sw.js with version+timestamp at build time */
function swVersionPlugin(): Plugin {
  const version = `${pkg.version}-${Date.now()}`
  return {
    name: 'sw-version',
    closeBundle() {
      const swPath = resolve(__dirname, 'dist', 'sw.js')
      if (existsSync(swPath)) {
        const content = readFileSync(swPath, 'utf-8')
        writeFileSync(swPath, content.replace(/__SW_VERSION__/g, version))
      }
    },
  }
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT || 3100}`,
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss(), swVersionPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-') || id.includes('node_modules/rehype-') || id.includes('node_modules/unified') || id.includes('node_modules/mdast') || id.includes('node_modules/hast') || id.includes('node_modules/micromark') || id.includes('node_modules/highlight.js')) {
            return 'markdown'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui'
          }
        },
      },
    },
  },
})
