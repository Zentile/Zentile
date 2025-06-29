// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  
  // Runtime configuration for Convex
  runtimeConfig: {
    // Private keys (only available on server-side)
    convexAdminKey: process.env.CONVEX_SELF_HOSTED_ADMIN_KEY,
    // Public keys (exposed to client-side)
    public: {
      convexUrl: process.env.CONVEX_SELF_HOSTED_URL || 'http://127.0.0.1:3210'
    }
  },

  // CSS framework
  css: ['~/assets/css/main.css'],

  // Auto-import components
  components: true,

  // Optimization for production
  nitro: {
    preset: 'node-server',
    minify: true,
    compressPublicAssets: true,
  },

  // Build optimizations
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['convex'] : []
  },

  // Vite optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            convex: ['convex']
          }
        }
      }
    }
  },

  // Experimental features for smaller builds
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false
  },

  // SEO optimizations
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'ZenGrid',
      meta: [
        { name: 'description', content: 'A modern grid-based homepage with self-hosted Convex' }
      ]
    }
  }
})