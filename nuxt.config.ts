// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  app: {
    head: {
      title: 'CryptoStream - Real-time Crypto Analysis',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time cryptocurrency market analysis and data visualization platform' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      // CoinGecko API Keys (3 keys for rotation)
      coingeckoApiKey1: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_1 || '',
      coingeckoApiKey2: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_2 || '',
      coingeckoApiKey3: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_3 || '',
      coingeckoApiKey4: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_4 || '',
      coingeckoApiKey5: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_5 || '',
      coingeckoApiKey6: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_6 || '',
      coingeckoApiKey7: process.env.NUXT_PUBLIC_COINGECKO_API_KEY_7 || '',
      cryptoApiProvider: process.env.NUXT_PUBLIC_CRYPTO_API_PROVIDER || 'coingecko'
    }
  },

  // Production optimizations
  nitro: {
    compressPublicAssets: true,
    // Add CORS headers for API routes
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },

  // Build optimizations
  experimental: {
    payloadExtraction: false
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'apexcharts': ['apexcharts', 'vue3-apexcharts']
          }
        }
      }
    }
  }
})
