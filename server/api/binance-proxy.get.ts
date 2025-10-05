// server/api/binance-proxy.get.ts
/**
 * Simple Binance API Proxy
 * Meneruskan request ke Binance API untuk bypass ISP blocking
 * 
 * Usage:
 * GET /api/binance-proxy?endpoint=/api/v3/ticker/24hr&symbol=BTCUSDT
 * GET /api/binance-proxy?endpoint=/api/v3/klines&symbol=BTCUSDT&interval=5m&limit=60
 */

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const endpoint = query.endpoint as string
    
    if (!endpoint) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Parameter "endpoint" required. Example: /api/v3/ticker/24hr'
      })
    }

    // Build URL dengan semua query parameters kecuali 'endpoint'
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (key !== 'endpoint' && value) {
        params.append(key, String(value))
      }
    })
    
    const queryString = params.toString()
    const fullUrl = `https://api.binance.com${endpoint}${queryString ? '?' + queryString : ''}`
    
    console.log(`🔄 Proxying request to: ${fullUrl}`)

    // Fetch data dari Binance API
    const data = await $fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      retry: 2,
      timeout: 15000,
    })

    console.log(`✅ Proxy success`)
    return data

  } catch (error: any) {
    console.error('❌ Proxy error:', error.message)
    
    // Handle specific errors
    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: `Invalid Binance API request: ${error.data?.msg || error.message}`
      })
    }
    
    if (error.statusCode === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      })
    }

    throw createError({
      statusCode: error.statusCode || 503,
      statusMessage: 'Service Unavailable',
      message: `Cannot connect to Binance API. ${error.message}`
    })
  }
})
