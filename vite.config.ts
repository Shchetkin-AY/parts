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
  server,

  plugins: [
    vue(),
    jsx(),
    pwa({
      registerType: 'prompt',
      workbox: {
        navigateFallbackDenylist: [ /^\/api/ ],
        sourcemap: false,
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
              }
            }
          },
          {
            urlPattern: /^\/svg\/.*\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'svg-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 24 * 60 * 60
              }
            }
          }
        ]
      },
      includeAssets: [
        'icons/favicon.ico',
        'icons/favicon.svg',
        'icons/favicon-96x96.png',
        'icons/favicon-192x192.png',
        'icons/favicon-512x512.png',
        'icons/apple-touch-icon.png'
      ],
      manifest: {
        name: 'ISKOR',
        short_name: 'ISCOR',
        theme_color: '#0c0c0c',
        background_color: '#0c0c0c',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
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
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/catalog.ts')) {
            return 'catalog-data'
          }

          if (
            id.includes('/node_modules/vue/')
            || id.includes('/node_modules/@vue/')
            || id.includes('/node_modules/vue-router/')
            || id.includes('/node_modules/pinia/')
          ) {
            return 'vue-vendor'
          }
        }
      }
    }
  }
})
