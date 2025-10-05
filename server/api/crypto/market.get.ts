import { fetchCoinGecko, hasApiKeys } from '../../utils/coingeckoClient'

interface CoingeckoMarketData {
  id: string
  symbol: string
  name: string
  current_price: number
  total_volume: number
  price_change_percentage_24h: number
  high_24h: number
  low_24h: number
  last_updated: string
}

interface CryptoAsset {
  symbol: string
  name: string
  price: number
  volume24h: number
  change24h: number
  high24h: number
  low24h: number
  lastUpdate: Date
}

export default defineEventHandler(async (event): Promise<CryptoAsset[]> => {
  try {
    // Check if API keys are configured
    if (!hasApiKeys()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'API Key Not Configured',
        message: 'Tidak bisa mendapatkan data karena API Key belum diset. Silakan konfigurasi API Key CoinGecko di file .env'
      })
    }
    
    // CoinGecko coin IDs untuk cryptocurrency yang kita track
    const coinIds = [
      'bitcoin',
      'ethereum', 
      'solana',
      'ripple',
      'binancecoin',
      'cardano',
      'chainlink',
      'dogecoin',
      'tron'
    ]
    
    // Fetch market data dari CoinGecko
    const marketData = await fetchCoinGecko<CoingeckoMarketData[]>(
      `/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      {
        retry: 2,
        timeout: 15000,
      }
    )
    
    // Validate response
    if (!Array.isArray(marketData) || marketData.length === 0) {
      throw new Error('Invalid response from CoinGecko API')
    }
    
    // Transform data ke format internal
    const data: CryptoAsset[] = marketData.map((coin): CryptoAsset => ({
      symbol: formatSymbol(coin.symbol),
      name: coin.name,
      price: coin.current_price || 0,
      volume24h: coin.total_volume || 0,
      change24h: coin.price_change_percentage_24h || 0,
      high24h: coin.high_24h || coin.current_price,
      low24h: coin.low_24h || coin.current_price,
      lastUpdate: new Date(coin.last_updated)
    }))
    
    return data
    
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    
    // Pass through API key errors
    if (error.statusCode === 401) {
      throw error
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'CoinGecko API Error',
      message: error.message || 'Tidak dapat terhubung ke server CoinGecko'
    })
  }
})

/**
 * Format symbol dari CoinGecko ke format display (BTC -> BTC/USD)
 */
function formatSymbol(symbol: string): string {
  return symbol.toUpperCase() + '/USD'
}
