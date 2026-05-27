import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { VitePWA as pwa } from 'vite-plugin-pwa'
import { resolve } from 'path'

const defaultPort = 5173

const port = process.env.PORT ? parseInt(process.env.PORT) : defaultPort
const server = {
  host: process.env.HOST ?? '0.0.0.0',
  port
}

export default defineConfig({
  // base: '/parts/',

  server,

  plugins: [
    vue(),
    jsx(),
    pwa({
      registerType: 'prompt',
      workbox: {
        navigateFallbackDenylist: [ /^\/api/ ],
        sourcemap: true
      },
      includeAssets: [], // добавить пути к иконкам ['favicon.ico', 'icons/icon-192.png']
      manifest: {
        name: 'Cabinet',
        short_name: 'Cabinet',
        description: 'Cabinet',
        display: 'standalone',
        icons: [] // пример: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
      },
      devOptions: {
        enabled: process.env.PWA_DEV === 'true',
        suppressWarnings: true
      }
    })
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    emptyOutDir: true
  }
})
