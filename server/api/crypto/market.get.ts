import { fetchBinance } from '../../utils/binanceClient'

interface BinanceTickerResponse {
  lastPrice: string
  quoteVolume: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
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
    const symbols = [
      'BTCUSDT', 
      'ETHUSDT', 
      'SOLUSDT', 
      'XRPUSDT',
      'BNBUSDT',
      'ADAUSDT',
      'LINKUSDT',
      'DOGEUSDT',
      'TRXUSDT'
    ]
    
    const promises: Promise<CryptoAsset>[] = symbols.map(async (symbol): Promise<CryptoAsset> => {
      const tickerResponse = await fetchBinance<BinanceTickerResponse>(
        `/api/v3/ticker/24hr?symbol=${symbol}`,
        {
          retry: 2,
          timeout: 10000,
        }
      )
      
      // Validate response structure
      if (!tickerResponse || typeof tickerResponse !== 'object') {
        throw new Error(`Invalid response for ${symbol}`)
      }
      
      const ticker = tickerResponse as BinanceTickerResponse
      
      return {
        symbol: symbol.replace('USDT', '/USD'),
        name: getNameFromSymbol(symbol),
        price: parseFloat(ticker.lastPrice),
        volume24h: parseFloat(ticker.quoteVolume),
        change24h: parseFloat(ticker.priceChangePercent),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        lastUpdate: new Date()
      }
    })
    
    const data: CryptoAsset[] = await Promise.all(promises)
    return data
    
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terdapat Kesalahan pada API Binance',
      message: error.cause?.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' 
        ? 'Tidak dapat memverifikasi sertifikat SSL dari server Binance'
        : error.message || 'Tidak dapat terhubung ke server Binance'
    })
  }
})

function getNameFromSymbol(symbol: string): string {
  const names: Record<string, string> = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'SOLUSDT': 'Solana',
    'XRPUSDT': 'Ripple',
    'BNBUSDT': 'BNB',
    'ADAUSDT': 'Cardano',
    'LINKUSDT': 'Chainlink',
    'DOGEUSDT': 'Dogecoin',
  // 'USDTUSDT': 'Tether', // Dihapus karena bukan simbol valid
    'TRXUSDT': 'Tron'
  }
  return names[symbol] || symbol
}
