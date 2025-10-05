// server/utils/binanceClient.ts
/**
 * Binance API Client dengan fallback strategy
 * Strategy 1: Direct connection
 * Strategy 2: Internal proxy (via Nuxt server)
 * Strategy 3: Alternative endpoints
 */

interface FetchOptions {
  retry?: number
  timeout?: number
}

/**
 * Fetch dari Binance API dengan fallback otomatis
 */
export async function fetchBinance<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retry = 2, timeout = 10000 } = options

  const strategies = [
    // Strategy 1: Direct ke Binance API
    async (): Promise<T> => {
      console.log('📡 Strategy 1: Direct connection')
      const url = `https://api.binance.com${path}`
      const result = await $fetch<T>(url, {
        retry,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      })
      return result as T
    },

    // Strategy 2: Via internal proxy (untuk bypass ISP blocking)
    async (): Promise<T> => {
      console.log('📡 Strategy 2: Internal proxy')
      
      // Parse path untuk mendapatkan endpoint dan params
      const pathParts = path.split('?')
      const endpoint = pathParts[0] ?? ''
      const queryString = pathParts[1] ?? ''
      const params = new URLSearchParams(queryString)
      
      // Build internal proxy URL
      if (endpoint) {
        params.set('endpoint', endpoint)
      }
      const proxyUrl = `/api/binance-proxy?${params.toString()}`
      
      const result = await $fetch<T>(proxyUrl, {
        retry: 1,
        timeout: timeout + 5000, // Extra time untuk proxy
      })
      return result as T
    },

    // Strategy 3: Alternative Binance endpoints
    async (): Promise<T> => {
      console.log('📡 Strategy 3: Alternative endpoints')
      const alternativeHosts = [
        'https://api1.binance.com',
        'https://api2.binance.com',
        'https://api3.binance.com',
      ]
      
      for (const host of alternativeHosts) {
        try {
          const url = `${host}${path}`
          const result = await $fetch<T>(url, {
            retry: 1,
            timeout: timeout,
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json',
            }
          })
          return result as T
        } catch (err) {
          console.warn(`❌ Failed: ${host}`)
          continue
        }
      }
      throw new Error('All alternative endpoints failed')
    }
  ]

  let lastError: any

  // Coba setiap strategy
  for (const [index, strategy] of strategies.entries()) {
    try {
      const result = await strategy()
      console.log(`✅ Success with strategy ${index + 1}`)
      return result
    } catch (error: any) {
      console.warn(`⚠️  Strategy ${index + 1} failed:`, error.message)
      lastError = error
      continue
    }
  }

  // Semua strategy gagal
  throw createError({
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `Cannot access Binance API. Last error: ${lastError?.message || 'Unknown'}. Please try: 1) Enable WARP/VPN, 2) Use proxy, or 3) Deploy to cloud.`
  })
}
