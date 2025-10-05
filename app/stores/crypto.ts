import { defineStore } from 'pinia'
import type { CryptoAsset, CandleData } from '~/types/crypto'

export const useCryptoStore = defineStore('crypto', {
  state: () => ({
    // Crypto assets data
    assets: [] as CryptoAsset[],
    
    // Candlestick data for BTC/USD
    candleData: [] as CandleData[],
    
    // Update state
    isLoading: false,
    lastUpdate: null as Date | null,
    
    // Intervals for auto-refresh
    refreshInterval: null as ReturnType<typeof setInterval> | null,
    
    // Selected asset for chart
    selectedAsset: 'BTC/USD' as string,

    // API error state
    apiError: null as string | null
  }),

  getters: {
    /**
     * Get asset by symbol
     */
    getAssetBySymbol: (state) => {
      return (symbol: string) => state.assets.find(a => a.symbol === symbol)
    },

    /**
     * Get latest candle
     */
    latestCandle: (state) => {
      return state.candleData.length > 0 
        ? state.candleData[state.candleData.length - 1]
        : null
    },

    /**
     * Check if data is loading
     */
    isLive: (state) => !state.isLoading && state.assets.length > 0,

    /**
     * Get total market cap (sum of all volumes)
     */
    totalMarketCap: (state) => {
      return state.assets.reduce((sum, asset) => sum + asset.volume24h, 0)
    }
  },

  actions: {
    /**
     * Initialize data from API
     */
    async initializeData() {
      if (this.isLoading) {
        console.warn('⚠️ Already loading data...')
        return
      }

      this.isLoading = true
      this.apiError = null

      try {
        const { useCryptoApi } = await import('~/services/cryptoApi')
        const api = useCryptoApi()
        
        console.log('🌐 Fetching crypto data from API...')
        
        // Fetch market data
        this.assets = await api.getMarketData()
        
        // Fetch historical data for Bitcoin
        const btcSymbols = ['BTCUSDT', 'BTC']
        let historicalData: CandleData[] = []
        
        try {
          historicalData = await api.getHistoricalData(btcSymbols[0], { days: 1, interval: '5m', limit: 60 })
        } catch (error) {
          console.warn('⚠️ Could not fetch historical data')
          // Create minimal candle data from current price
          const btcAsset = this.assets.find(a => a.symbol.includes('BTC'))
          if (btcAsset) {
            const now = Date.now()
            historicalData = [{
              timestamp: now,
              open: btcAsset.price,
              high: btcAsset.high24h || btcAsset.price,
              low: btcAsset.low24h || btcAsset.price,
              close: btcAsset.price,
              volume: btcAsset.volume24h
            }]
          }
        }
        
        this.candleData = historicalData
        this.lastUpdate = new Date()
        this.apiError = null
        
        console.log('✅ Data loaded successfully:', {
          assets: this.assets.length,
          candles: this.candleData.length,
          coins: this.assets.map(a => a.symbol).join(', '),
          sampleCandle: this.candleData[0]
        })
        
        if (this.candleData.length > 0) {
          console.log('📊 Candle data sample:', {
            first: this.candleData[0],
            last: this.candleData[this.candleData.length - 1]
          })
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error)
        this.apiError = error instanceof Error ? error.message : 'Failed to fetch API data'
        
        // Set empty state
        this.assets = []
        this.candleData = []
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Start auto-refresh (refresh data every 30 seconds)
     */
    startAutoRefresh(intervalSeconds: number = 30) {
      if (this.refreshInterval) {
        console.warn('⚠️ Auto-refresh already running')
        return
      }

      console.log(`� Starting auto-refresh (every ${intervalSeconds}s)...`)

      this.refreshInterval = setInterval(async () => {
        await this.refreshData()
      }, intervalSeconds * 1000)
    },

    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
        console.log('⏸️ Auto-refresh stopped')
      }
    },

    /**
     * Refresh data from API
     */
    async refreshData() {
      if (this.isLoading) {
        return
      }

      console.log('🔄 Refreshing data...')
      await this.initializeData()
    },

    /**
     * Change selected asset for chart
     */
    selectAsset(symbol: string) {
      const asset = this.assets.find(a => a.symbol === symbol)
      if (!asset) {
        console.warn('Asset not found:', symbol)
        return
      }

      this.selectedAsset = symbol
      console.log('📈 Selected asset:', symbol)
      
      // Note: In production, you would fetch historical data for this asset
      // For now, we keep the existing candle data
    }
  }
})
