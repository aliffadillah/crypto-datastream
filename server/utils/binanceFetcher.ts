// server/utils/binanceFetcher.ts
import { getProxyConfig, getBinanceEndpoint } from './proxyConfig'
import { ProxyAgent } from 'undici'

/**
 * Fetch data dari Binance API dengan support proxy dan fallback
 */
export async function fetchBinanceAPI<T = any>(
  path: string,
  options: {
    retry?: number
    timeout?: number
    useProxy?: boolean
    tryAlternatives?: boolean
  } = {}
): Promise<T> {
  const {
    retry = 3,
    timeout = 10000,
    useProxy = true,
    tryAlternatives = true
  } = options

  const proxyConfig = getProxyConfig()
  
  // Daftar endpoints untuk dicoba
  const baseEndpoints = [
    getBinanceEndpoint(false),
    'https://api1.binance.com',
    'https://api2.binance.com',
    'https://api3.binance.com',
  ]
  
  const endpoints = tryAlternatives ? baseEndpoints : [baseEndpoints[0]]
  let lastError: any = null

  // Coba setiap endpoint
  for (const baseUrl of endpoints) {
    const fullUrl = `${baseUrl}${path}`
    
    try {
      console.log(`🔄 Fetching from: ${fullUrl}`)
      
      const fetchOptions: any = {
        retry,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      }

      // Jika proxy enabled dan tersedia
      if (useProxy && proxyConfig.enabled && proxyConfig.url) {
        console.log(`🔐 Using proxy: ${proxyConfig.url}`)
        
        try {
          // Gunakan undici ProxyAgent untuk ofetch
          const agent = new ProxyAgent(proxyConfig.url)
          fetchOptions.dispatcher = agent
        } catch (err) {
          console.warn('⚠️  Failed to create proxy agent:', err)
        }
      }

      const response = await $fetch<T>(fullUrl, fetchOptions)
      console.log(`✅ Success from: ${baseUrl}`)
      return response as T

    } catch (error: any) {
      console.error(`❌ Failed from ${baseUrl}:`, error.message)
      lastError = error
      
      // Jika ini bukan endpoint terakhir, coba yang lain
      if (baseUrl !== endpoints[endpoints.length - 1]) {
        console.log(`⏭️  Trying next endpoint...`)
        continue
      }
    }
  }

  // Jika semua endpoint gagal
  throw createError({
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `Gagal mengakses Binance API. Kemungkinan diblokir oleh ISP. Error terakhir: ${lastError?.message || 'Unknown error'}`
  })
}

/**
 * Fetch dengan strategi fallback otomatis
 * 1. Coba dengan proxy (jika enabled)
 * 2. Coba direct connection
 * 3. Coba alternative endpoints
 */
export async function fetchBinanceWithFallback<T = any>(
  path: string,
  options: { retry?: number; timeout?: number } = {}
): Promise<T> {
  const strategies = [
    // Strategy 1: Gunakan proxy jika tersedia
    async () => {
      const proxyConfig = getProxyConfig()
      if (proxyConfig.enabled) {
        console.log('📡 Strategy 1: Using proxy')
        return fetchBinanceAPI<T>(path, { ...options, useProxy: true, tryAlternatives: false })
      }
      throw new Error('Proxy not configured')
    },
    
    // Strategy 2: Direct connection ke primary endpoint
    async () => {
      console.log('📡 Strategy 2: Direct connection')
      return fetchBinanceAPI<T>(path, { ...options, useProxy: false, tryAlternatives: false })
    },
    
    // Strategy 3: Coba alternative endpoints
    async () => {
      console.log('📡 Strategy 3: Alternative endpoints')
      return fetchBinanceAPI<T>(path, { ...options, useProxy: false, tryAlternatives: true })
    },
  ]

  for (const strategy of strategies) {
    try {
      return await strategy()
    } catch (error: any) {
      console.warn(`Strategy failed:`, error.message)
      continue
    }
  }

  throw createError({
    statusCode: 503,
    statusMessage: 'All strategies failed',
    message: 'Tidak dapat mengakses Binance API dengan semua metode yang tersedia. Silakan aktifkan WARP atau gunakan proxy.'
  })
}
