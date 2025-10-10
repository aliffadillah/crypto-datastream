/**
 * WebSocket Service for Real-time Cryptocurrency Data
 * Uses Binance WebSocket API for real-time price updates
 */

export interface WebSocketMessage {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  p: string // Price change
  P: string // Price change percent
  c: string // Last price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
}

export interface CryptoStreamData {
  symbol: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  lastUpdate: number
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private subscribers: Map<string, Set<(data: CryptoStreamData) => void>> = new Map()
  private isConnecting = false
  private symbols: string[] = []

  // Mapping dari symbol format kita ke Binance
  private symbolMap: Record<string, string> = {
    'BTC/USD': 'btcusdt',
    'ETH/USD': 'ethusdt',
    'SOL/USD': 'solusdt',
    'XRP/USD': 'xrpusdt',
    'BNB/USD': 'bnbusdt',
    'ADA/USD': 'adausdt',
    'LINK/USD': 'linkusdt',
    'DOGE/USD': 'dogeusdt',
    'TRX/USD': 'trxusdt'
  }

  /**
   * Connect to Binance WebSocket
   */
  connect(symbols: string[]) {
    // Check if running in browser
    if (typeof window === 'undefined') {
      console.warn('⚠️ WebSocket can only run in browser environment')
      return
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected')
      return
    }

    if (this.isConnecting) {
      console.log('🔌 WebSocket connection in progress...')
      return
    }

    this.isConnecting = true
    this.symbols = symbols

    // Convert symbols to Binance format
    const binanceSymbols = symbols
      .map(s => this.symbolMap[s])
      .filter(Boolean)
      .map(s => `${s}@ticker`)
      .join('/')

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${binanceSymbols}`

    console.log('🔌 Connecting to Binance WebSocket...')
    console.log('📡 URL:', wsUrl)
    console.log('📡 Symbols:', binanceSymbols)

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        this.isConnecting = false
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // Always log messages for debugging
          console.log('📩 Raw WebSocket data:', JSON.stringify(data, null, 2))
          this.handleMessage(data)
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error, 'Raw data:', event.data)
        }
      }

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        this.isConnecting = false
      }

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.isConnecting = false
        this.handleReconnect()
      }
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error)
      this.isConnecting = false
      this.handleReconnect()
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: any) {
    if (!data || !data.data) {
      console.warn('⚠️ Invalid message format:', data)
      return
    }

    const message: WebSocketMessage = data.data
    
    // Convert Binance symbol back to our format
    const ourSymbol = Object.entries(this.symbolMap).find(
      ([_, binanceSymbol]) => binanceSymbol === message.s.toLowerCase()
    )?.[0]

    if (!ourSymbol) {
      console.warn('⚠️ Unknown Binance symbol:', message.s)
      return
    }

    const streamData: CryptoStreamData = {
      symbol: ourSymbol,
      price: parseFloat(message.c),
      change24h: parseFloat(message.P),
      high24h: parseFloat(message.h),
      low24h: parseFloat(message.l),
      volume24h: parseFloat(message.q),
      lastUpdate: message.E
    }

    console.log('📨 WS Message:', ourSymbol, '$' + streamData.price.toFixed(2), 
                `(${streamData.change24h >= 0 ? '+' : ''}${streamData.change24h.toFixed(2)}%)`)

    // Notify all subscribers for this symbol
    const subscribers = this.subscribers.get(ourSymbol)
    if (subscribers && subscribers.size > 0) {
      console.log(`📢 Notifying ${subscribers.size} subscriber(s) for ${ourSymbol}`)
      subscribers.forEach(callback => {
        try {
          callback(streamData)
        } catch (error) {
          console.error(`❌ Error in subscriber callback for ${ourSymbol}:`, error)
        }
      })
    } else {
      console.warn(`⚠️ No subscribers for ${ourSymbol}`)
      console.log('📋 Current subscribers:', Array.from(this.subscribers.keys()))
    }

    // Notify wildcard subscribers (listening to all symbols)
    const wildcardSubscribers = this.subscribers.get('*')
    if (wildcardSubscribers) {
      wildcardSubscribers.forEach(callback => {
        try {
          callback(streamData)
        } catch (error) {
          console.error(`❌ Error in wildcard subscriber callback:`, error)
        }
      })
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.connect(this.symbols)
    }, delay)
  }

  /**
   * Subscribe to symbol updates
   */
  subscribe(symbol: string, callback: (data: CryptoStreamData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
      console.log(`📋 Created new subscriber set for ${symbol}`)
    }
    
    this.subscribers.get(symbol)!.add(callback)
    
    const count = this.subscribers.get(symbol)!.size
    console.log(`📊 Subscribed to ${symbol} (${count} subscriber(s))`)

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(symbol)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(symbol)
        }
      }
      console.log(`📊 Unsubscribed from ${symbol}`)
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket...')
      this.ws.close()
      this.ws = null
    }
    this.subscribers.clear()
    this.reconnectAttempts = 0
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    if (!this.ws) return 'CLOSED'
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING'
      case WebSocket.OPEN: return 'OPEN'
      case WebSocket.CLOSING: return 'CLOSING'
      case WebSocket.CLOSED: return 'CLOSED'
      default: return 'UNKNOWN'
    }
  }
}

// Singleton instance (only in browser)
let wsService: WebSocketService | null = null

export function useWebSocketService(): WebSocketService {
  if (typeof window === 'undefined') {
    // Return a dummy instance on server side
    return new WebSocketService()
  }
  
  if (!wsService) {
    console.log('🆕 Creating new WebSocket service instance')
    wsService = new WebSocketService()
  }
  return wsService
}

export default useWebSocketService
