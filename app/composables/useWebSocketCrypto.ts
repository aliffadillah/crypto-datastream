import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { CryptoAsset } from '~/types/crypto'
import { useWebSocketService, type CryptoStreamData } from '~/services/websocketService'

interface WebSocketState {
  connected: boolean
  reconnecting: boolean
  error: string | null
}

export function useWebSocketCrypto() {
  const assets = useState<CryptoAsset[]>('ws-crypto-assets', () => [])
  const isLoading = useState('ws-crypto-loading', () => true)
  const wsState = useState<WebSocketState>('ws-crypto-state', () => ({
    connected: false,
    reconnecting: false,
    error: null
  }))
  const lastUpdate = useState<Date | null>('ws-crypto-last-update', () => null)
  const isInitialized = useState('ws-crypto-initialized', () => false)

  // WebSocket service
  const wsService = useWebSocketService()

  const cryptoSymbols = [
    'BTC/USD',
    'ETH/USD',
    'SOL/USD',
    'XRP/USD',
    'BNB/USD',
    'ADA/USD',
    'LINK/USD',
    'DOGE/USD',
    'TRX/USD'
  ]

  const initialAssets: CryptoAsset[] = [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'SOL/USD', name: 'Solana', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'XRP/USD', name: 'XRP', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'BNB/USD', name: 'BNB', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'ADA/USD', name: 'Cardano', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'LINK/USD', name: 'Chainlink', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'DOGE/USD', name: 'Dogecoin', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() },
    { symbol: 'TRX/USD', name: 'Tron', price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdate: new Date() }
  ]

  assets.value = [...initialAssets]

  const handleWebSocketUpdate = (data: CryptoStreamData) => {
    console.log('📊 WebSocket Update Received:', data.symbol, '$' + data.price.toFixed(2))
    
    const index = assets.value.findIndex(a => a.symbol === data.symbol)
    if (index !== -1) {
      const currentAsset = assets.value[index]
      if (currentAsset) {
        assets.value[index] = {
          symbol: currentAsset.symbol,
          name: currentAsset.name,
          price: data.price,
          change24h: data.change24h,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h,
          lastUpdate: new Date(data.lastUpdate),
          previousPrice: currentAsset.price
        }
        lastUpdate.value = new Date(data.lastUpdate)
        console.log('✅ Updated:', data.symbol, 'Price:', data.price, 'Change:', data.change24h + '%')
      }
    } else {
      console.warn('⚠️ Symbol not found in assets:', data.symbol)
    }
  }

  /**
   * Initialize WebSocket connection
   */
  const initialize = async () => {
    // Prevent multiple initializations
    if (isInitialized.value) {
      console.log('✅ WebSocket already initialized, skipping...')
      return
    }

    // Only run on client side
    if (typeof window === 'undefined') {
      console.warn('⚠️ WebSocket initialization skipped - not in browser')
      isLoading.value = false
      return
    }

    try {
      isLoading.value = true
      wsState.value.error = null

      console.log('🚀 Initializing WebSocket connection...')
      console.log('📋 Crypto symbols to track:', cryptoSymbols)

      // Subscribe to all symbols FIRST (before connect)
      console.log('📡 Setting up subscriptions...')
      cryptoSymbols.forEach(symbol => {
        console.log(`➕ Subscribing to: ${symbol}`)
        wsService.subscribe(symbol, handleWebSocketUpdate)
      })

      // Connect to WebSocket
      console.log('🔌 Connecting to WebSocket...')
      wsService.connect(cryptoSymbols)

      // Wait a bit for initial data
      console.log('⏳ Waiting for initial data...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      wsState.value.connected = true
      isLoading.value = false
      isInitialized.value = true

      console.log('✅ WebSocket initialized successfully')
      console.log('📊 Current assets:', assets.value.map(a => `${a.symbol}: $${a.price}`))
    } catch (error) {
      console.error('❌ Error initializing WebSocket:', error)
      wsState.value.error = 'Failed to connect to WebSocket'
      isLoading.value = false
    }
  }

  /**
   * Reconnect WebSocket
   */
  const reconnect = () => {
    wsState.value.reconnecting = true
    wsService.disconnect()
    setTimeout(() => {
      initialize()
      wsState.value.reconnecting = false
    }, 1000)
  }

  /**
   * Cleanup on unmount
   */
  const cleanup = () => {
    console.log('🧹 Cleaning up WebSocket connection...')
    wsService.disconnect()
    wsState.value.connected = false
    isInitialized.value = false
  }

  // Computed properties
  const isLive = computed(() => wsState.value.connected && !isLoading.value)
  const connectionStatus = computed(() => wsService.getConnectionState())

  // Top gainer
  const topGainer = computed(() => {
    if (assets.value.length === 0) return 'N/A'
    const sorted = [...assets.value].sort((a, b) => b.change24h - a.change24h)
    return sorted[0]?.symbol.split('/')[0] || 'N/A'
  })

  // Auto-initialize on client side if not already initialized
  if (typeof window !== 'undefined' && !isInitialized.value && !isLoading.value) {
    console.log('🔄 Auto-initializing WebSocket from composable...')
    // Use setTimeout to avoid race conditions
    setTimeout(() => {
      if (!isInitialized.value) {
        initialize()
      }
    }, 100)
  }

  return {
    // State
    assets,
    isLoading,
    wsState,
    lastUpdate,
    isLive,
    connectionStatus,
    topGainer,

    // Methods
    initialize,
    reconnect,
    cleanup
  }
}
