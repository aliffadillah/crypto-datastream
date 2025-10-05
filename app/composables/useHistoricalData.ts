import type { CandleData } from '~/types/crypto'

export function useHistoricalData() {
  const data = ref<CandleData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch historical data from API
   */
  const fetchHistoricalData = async (
    symbol: string,
    startDate: string,
    endDate: string,
    interval: string = '5m'
  ) => {
    isLoading.value = true
    error.value = null

    try {
      // Convert symbol to CoinGecko format
      const coinId = convertToCoinGeckoId(symbol)
      
      // Calculate start and end timestamps
      const startTime = new Date(startDate).getTime()
      const endTime = new Date(endDate).getTime()
      
      // Calculate limit based on interval and time range
      const limit = calculateLimit(startTime, endTime, interval)
      
      console.log('📊 Fetching historical data:', {
        symbol: coinId,
        interval,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        limit
      })

      const { useCryptoApi } = await import('~/services/cryptoApi')
      const api = useCryptoApi()
      
      // Fetch data
      const historicalData = await api.getHistoricalData(coinId, {
        interval,
        limit,
        startTime,
        endTime
      })

      // Filter data within the date range
      data.value = historicalData.filter(candle => 
        candle.timestamp >= startTime && candle.timestamp <= endTime
      )

      console.log('✅ Historical data loaded:', {
        total: data.value.length,
        first: data.value[0],
        last: data.value[data.value.length - 1]
      })

    } catch (err: any) {
      console.error('❌ Error fetching historical data:', err)
      error.value = err.message || 'Failed to fetch historical data'
      data.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Convert symbol to CoinGecko ID format
   */
  const convertToCoinGeckoId = (symbol: string): string => {
    // Mapping ke CoinGecko coin IDs
    const symbolMap: Record<string, string> = {
      'BTC/USD': 'bitcoin',
      'ETH/USD': 'ethereum',
      'SOL/USD': 'solana',
      'XRP/USD': 'ripple',
      'BNB/USD': 'binancecoin',
      'ADA/USD': 'cardano',
      'LINK/USD': 'chainlink',
      'DOGE/USD': 'dogecoin',
      'TRX/USD': 'tron',
      'BITCOIN': 'bitcoin',
      'ETHEREUM': 'ethereum',
      'SOLANA': 'solana',
      'RIPPLE': 'ripple',
      'XRP': 'ripple',
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'BNB': 'binancecoin',
      'CARDANO': 'cardano',
      'ADA': 'cardano',
      'CHAINLINK': 'chainlink',
      'LINK': 'chainlink',
      'DOGECOIN': 'dogecoin',
      'DOGE': 'dogecoin',
      'TRON': 'tron',
      'TRX': 'tron'
    }
    
    const upperSymbol = symbol.toUpperCase()
    return symbolMap[upperSymbol] || symbolMap[symbol] || 'bitcoin'
  }

  /**
   * Calculate optimal limit based on time range and interval
   */
  const calculateLimit = (startTime: number, endTime: number, interval: string): number => {
    const duration = endTime - startTime
    
    // Interval to milliseconds
    const intervalMs: Record<string, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    }

    const intervalDuration = intervalMs[interval] || intervalMs['5m'] || 300000
    const calculatedLimit = Math.ceil(duration / intervalDuration)
    
    // CoinGecko has different limits based on days parameter
    return Math.min(calculatedLimit, 365)
  }

  /**
   * Clear data
   */
  const clearData = () => {
    data.value = []
    error.value = null
  }

  return {
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchHistoricalData,
    clearData
  }
}
