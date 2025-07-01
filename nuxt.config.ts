// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';
import path from 'path';

const getAdminKey = () => {
  const keyFile = process.env.CONVEX_SELF_HOSTED_ADMIN_KEY_FILE || '/shared/admin_key';
  try {
    const keyPath = path.resolve(keyFile);
    if (fs.existsSync(keyPath)) {
      const key = fs.readFileSync(keyPath, 'utf-8').trim();
      if (key) {
        const masked = key.length > 8 ? `${key.slice(0, 10)}...${key.slice(-10)}` : key;
        console.log(`[ZenTile] Loaded Convex admin key from ${keyPath}: ${masked}`);
      } else {
        console.warn(`[ZenTile] Admin key file at ${keyPath} is empty.`);
      }
      return key;
    } else {
      console.warn(`[ZenTile] Admin key file not found at ${keyPath}`);
    }
  } catch (e) {
    console.error(`[ZenTile] Error reading admin key:`, e);
  }
  return undefined;
};

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  
  // Runtime configuration for client-side Convex
  runtimeConfig: {
    // Public keys (exposed to client-side)
    public: {
      // This should be set to the external URL that browsers can access
      CONVEX_URL: process.env.NUXT_PUBLIC_CONVEX_URL || 'http://localhost:3210'
    },
    private: {
      CONVEX_ADMIN_KEY: getAdminKey(),
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
      title: 'ZenTile',
      meta: [
        { name: 'description', content: 'A modern grid-based homepage with self-hosted Convex' }
      ]
    }
  }
})