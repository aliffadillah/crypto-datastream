import { fetchCoinGecko, hasApiKeys } from '../../utils/coingeckoClient'

interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// CoinGecko OHLC response type: [timestamp, open, high, low, close]
type CoingeckoOHLC = [number, number, number, number, number]

/**
 * Konversi nama koin atau simbol ke CoinGecko coin ID
 * Contoh: 'BTC' -> 'bitcoin', 'BTCUSDT' -> 'bitcoin', 'ethereum' -> 'ethereum'
 */
function normalizeSymbol(input: string): string {
  // Mapping symbol/name ke CoinGecko coin ID
  const symbolMap: Record<string, string> = {
    'btc': 'bitcoin',
    'btcusdt': 'bitcoin',
    'bitcoin': 'bitcoin',
    'eth': 'ethereum',
    'ethusdt': 'ethereum',
    'ethereum': 'ethereum',
    'sol': 'solana',
    'solusdt': 'solana',
    'solana': 'solana',
    'xrp': 'ripple',
    'xrpusdt': 'ripple',
    'ripple': 'ripple',
    'bnb': 'binancecoin',
    'bnbusdt': 'binancecoin',
    'binancecoin': 'binancecoin',
    'ada': 'cardano',
    'adausdt': 'cardano',
    'cardano': 'cardano',
    'link': 'chainlink',
    'linkusdt': 'chainlink',
    'chainlink': 'chainlink',
    'doge': 'dogecoin',
    'dogeusdt': 'dogecoin',
    'dogecoin': 'dogecoin',
    'trx': 'tron',
    'trxusdt': 'tron',
    'tron': 'tron',
  }
  
  // Normalize input
  const normalized = input.toLowerCase().trim().replace(/\//g, '')
  
  // Return mapped coin ID or default to bitcoin
  return symbolMap[normalized] || 'bitcoin'
}

export default defineEventHandler(async (event): Promise<CandleData[]> => {
  try {
    // Check if API keys are configured
    if (!hasApiKeys()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'API Key Not Configured',
        message: 'Tidak bisa mendapatkan data karena API Key belum diset. Silakan konfigurasi API Key CoinGecko di file .env'
      })
    }
    
    const query = getQuery(event)
    const rawSymbol = (query.symbol as string) || 'BTCUSDT'
    
    // Normalisasi simbol ke CoinGecko coin ID
    const coinId = normalizeSymbol(rawSymbol)
    const days = parseInt((query.days as string) || '1')
    
    console.log(`📊 Fetching historical data for ${coinId} (${days} days)`)
    
    // CoinGecko hanya support OHLC untuk 1, 7, 14, 30, 90, 180, 365, max days
    // Untuk days yang lebih detail, kita akan use market_chart
    let historicalData: CandleData[]
    
    if (days <= 1) {
      // For 1 day or less, use OHLC endpoint (gives 4-6 hour candles)
      const ohlcData = await fetchCoinGecko<CoingeckoOHLC[]>(
        `/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
        {
          retry: 2,
          timeout: 15000,
        }
      )
      
      if (!Array.isArray(ohlcData) || ohlcData.length === 0) {
        throw new Error('Invalid response from CoinGecko API')
      }
      
      // Transform OHLC data
      historicalData = ohlcData.map((candle): CandleData => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0 // OHLC endpoint doesn't provide volume
      }))
    } else {
      // For more than 1 day, use market_chart endpoint
      const marketChart = await fetchCoinGecko<{
        prices: [number, number][]
        total_volumes: [number, number][]
      }>(
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        {
          retry: 2,
          timeout: 15000,
        }
      )
      
      if (!marketChart.prices || !Array.isArray(marketChart.prices)) {
        throw new Error('Invalid response from CoinGecko API')
      }
      
      // Transform market chart data to candle format
      historicalData = marketChart.prices.map((pricePoint, index): CandleData => {
        const [timestamp, price] = pricePoint
        const volume = marketChart.total_volumes[index] ? marketChart.total_volumes[index][1] : 0
        
        return {
          timestamp,
          open: price,
          high: price * 1.02, // Approximate high
          low: price * 0.98, // Approximate low
          close: price,
          volume
        }
      })
    }
    
    console.log(`✅ Fetched ${historicalData.length} candles for ${coinId}`)
    return historicalData
    
  } catch (error: any) {
    console.error('Error fetching historical data:', error)
    
    // Pass through API key errors
    if (error.statusCode === 401) {
      throw error
    }
    
    if (error.statusCode === 400 || error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Request',
        message: `Format simbol atau parameter tidak valid. Error: ${error.message}`
      })
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'CoinGecko API Error',
      message: error.message || 'Tidak dapat terhubung ke server CoinGecko'
    })
  }
})

/*
 * CONTOH PENGGUNAAN DENGAN COINGECKO:
 * 
 * // Fetch historical data
 * const historicalData = await $fetch('/api/crypto/historical', {
 *   query: {
 *     symbol: 'BTC',  // Atau 'bitcoin', 'BTCUSDT' - akan otomatis dinormalisasi
 *     days: 1         // 1, 7, 14, 30, 90, 180, 365, max
 *   }
 * })
 * 
 * // Contoh untuk cryptocurrency lain
 * const ethData = await $fetch('/api/crypto/historical', {
 *   query: {
 *     symbol: 'ETH',
 *     days: 7
 *   }
 * })
 */
