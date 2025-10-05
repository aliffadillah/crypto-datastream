<template>
  <div class="min-h-screen">
    <!-- Header -->
    <HeaderSimple />

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-4 md:py-8 max-w-7xl">
      <!-- Error Alert -->
      <div v-if="hasError" class="mb-4 md:mb-6 p-4 md:p-6 bg-danger/10 border-2 border-danger/20 rounded-xl animate-fade-in">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-danger font-bold text-lg mb-2">Tidak Bisa Mendapatkan Data</h3>
            <p class="text-danger/90 font-medium mb-4">{{ errorMessage }}</p>
            <div class="bg-white/50 rounded-lg p-4 text-sm">
              <p class="text-gray-700 mb-2"><strong>Solusi:</strong></p>
              <ol class="list-decimal list-inside space-y-1 text-gray-600">
                <li>Pastikan file <code class="px-2 py-0.5 bg-gray-200 rounded text-xs">.env</code> sudah dibuat</li>
                <li>Isi 3 API Key CoinGecko di variabel <code class="px-2 py-0.5 bg-gray-200 rounded text-xs">NUXT_PUBLIC_COINGECKO_API_KEY_1</code>, <code class="px-2 py-0.5 bg-gray-200 rounded text-xs">_2</code>, dan <code class="px-2 py-0.5 bg-gray-200 rounded text-xs">_3</code></li>
                <li>Restart server development</li>
              </ol>
            </div>
          </div>
          <button @click="hasError = false" class="text-danger hover:text-danger/80 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page Title & Description -->
      <div class="mb-6 md:mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-display font-bold text-text-primary mb-1 md:mb-2">Data Stream</h1>
            <p class="text-sm md:text-base text-text-tertiary">Real-time crypto market updates every 5s</p>
          </div>
          
          <!-- Refresh Button -->
          <button 
            @click="refreshData"
            class="btn-secondary text-sm md:text-base self-start sm:self-auto"
            :disabled="isRefreshing"
          >
            <svg 
              class="w-3.5 h-3.5 md:w-4 md:h-4" 
              :class="{ 'animate-spin': isRefreshing }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Crypto Selector -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-8 mb-4 md:mb-6 animate-slide-up shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Select Cryptocurrency</h2>
            <p class="text-xs md:text-sm text-gray-600">Choose a crypto to view real-time data</p>
          </div>
          <div class="text-xs md:text-sm">
            <span 
              class="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border"
              :class="isStreamActive 
                ? 'bg-success/10 border-success/20' 
                : 'bg-gray-100 border-gray-200'"
            >
              <div 
                class="w-2 h-2 rounded-full flex-shrink-0"
                :class="isStreamActive ? 'bg-success animate-pulse' : 'bg-gray-400'"
              ></div>
              <span 
                class="font-semibold whitespace-nowrap"
                :class="isStreamActive ? 'text-success' : 'text-gray-500'"
              >
                {{ isStreamActive ? 'Live Streaming' : 'Stream Inactive' }}
              </span>
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && assets.length === 0" class="text-center py-12 md:py-16">
          <div class="inline-block w-8 h-8 md:w-10 md:h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3 md:mb-4"></div>
          <p class="text-sm md:text-base text-gray-500 font-medium">Loading cryptocurrencies...</p>
        </div>

        <!-- Crypto Cards Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          <button
            v-for="asset in assets"
            :key="asset.symbol"
            @click="selectCrypto(asset.symbol)"
            class="relative p-3 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md active:scale-95"
            :class="selectedCrypto === asset.symbol 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <!-- Selected Indicator -->
            <div 
              v-if="selectedCrypto === asset.symbol"
              class="absolute top-2 right-2 md:top-4 md:right-4"
            >
              <div class="w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full flex items-center justify-center">
                <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div class="w-6 h-6 md:w-10 md:h-10 flex-shrink-0">
                <CryptoIcon :symbol="asset.symbol" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-sm md:text-lg text-gray-900 truncate">{{ asset.symbol.split('/')[0] }}</div>
                <div class="text-[10px] md:text-xs text-gray-500 truncate">{{ asset.name }}</div>
              </div>
            </div>

            <div class="space-y-1.5 md:space-y-2.5">
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-[10px] md:text-xs font-medium text-gray-500">Price</span>
                <span class="font-mono font-bold text-xs md:text-base text-gray-900 tabular-nums">
                  {{ formatCurrency(asset.price, getDecimals(asset.symbol)) }}
                </span>
              </div>
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-[10px] md:text-xs font-medium text-gray-500 whitespace-nowrap">24h</span>
                <span 
                  class="inline-flex items-center gap-0.5 md:gap-1 px-1.5 py-0.5 md:px-2 rounded-md font-bold text-[10px] md:text-xs tabular-nums flex-shrink-0"
                  :class="asset.change24h >= 0 
                    ? 'bg-success/10 text-success' 
                    : 'bg-danger/10 text-danger'"
                >
                  {{ asset.change24h >= 0 ? '↑' : '↓' }} {{ formatPercentage(asset.change24h) }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Data Stream Section -->
      <div v-if="selectedCrypto" class="animate-fade-in">
        <!-- Tab Navigation -->
        <div class="card mb-4 md:mb-6 p-4 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <div class="min-w-0 flex-1">
              <h2 class="text-lg md:text-xl font-display font-bold text-text-primary mb-1 truncate">
                {{ selectedAsset?.name }} Data
              </h2>
              <p class="text-xs md:text-sm text-text-tertiary">
                <span class="hidden sm:inline">View live stream or historical data • </span>
                <span class="sm:hidden">Last update: </span>{{ timeAgo }}
              </p>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex gap-1 md:gap-2 border-b border-finance-border -mx-4 md:-mx-0 px-4 md:px-0 overflow-x-auto">
            <button
              @click="activeTab = 'live'"
              class="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0"
              :class="activeTab === 'live' 
                ? 'text-primary' 
                : 'text-text-tertiary hover:text-text-secondary'"
            >
              Live Stream
              <div
                v-if="activeTab === 'live'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              ></div>
            </button>
            <button
              @click="activeTab = 'historical'"
              class="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0"
              :class="activeTab === 'historical' 
                ? 'text-primary' 
                : 'text-text-tertiary hover:text-text-secondary'"
            >
              Historical Data
              <div
                v-if="activeTab === 'historical'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              ></div>
            </button>
          </div>
        </div>

        <!-- Live Stream Tab -->
        <div v-show="activeTab === 'live'" class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-display font-bold text-text-primary">
              Live Data Stream
            </h3>
            
            <!-- Export Button -->
            <button @click="exportStreamData" class="btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Data
            </button>
          </div>

        <!-- Live Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card">
            <div class="text-xs font-medium text-text-tertiary mb-2">Current Price</div>
            <div class="text-2xl font-display font-bold text-text-primary tabular-nums">
              {{ formatCurrency(selectedAsset?.price || 0, getDecimals(selectedCrypto)) }}
            </div>
          </div>
          
          <div class="stat-card">
            <div class="text-xs font-medium text-text-tertiary mb-2">24h High</div>
            <div class="text-2xl font-display font-bold text-text-primary tabular-nums">
              {{ formatCurrency(selectedAsset?.high24h || 0, getDecimals(selectedCrypto)) }}
            </div>
          </div>
          
          <div class="stat-card">
            <div class="text-xs font-medium text-text-tertiary mb-2">24h Low</div>
            <div class="text-2xl font-display font-bold text-text-primary tabular-nums">
              {{ formatCurrency(selectedAsset?.low24h || 0, getDecimals(selectedCrypto)) }}
            </div>
          </div>
          
          <div class="stat-card">
            <div class="text-xs font-medium text-text-tertiary mb-2">24h Volume</div>
            <div class="text-2xl font-display font-bold text-text-primary tabular-nums">
              {{ formatLargeNumber(selectedAsset?.volume24h || 0) }}
            </div>
          </div>
        </div>

        <!-- Data Stream Table -->
        <div class="overflow-x-auto -mx-6 px-6">
          <table class="w-full">
            <thead>
              <tr class="border-b border-finance-border">
                <th class="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Timestamp</th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Price</th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Change</th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Volume</th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Market Cap</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data, index) in streamData"
                :key="index"
                class="table-row"
                :class="getRowFlashClass(data)"
              >
                <td class="py-4 px-4">
                  <div class="text-sm font-medium text-text-primary">
                    {{ formatTime(data.timestamp) }}
                  </div>
                  <div class="text-xs text-text-muted">
                    {{ formatDate(data.timestamp) }}
                  </div>
                </td>
                <td class="py-4 px-4 text-right">
                  <span class="font-mono font-bold text-base text-text-primary tabular-nums">
                    {{ formatCurrency(data.price, getDecimals(selectedCrypto)) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <div 
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-sm tabular-nums"
                    :class="data.change >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
                  >
                    {{ data.change >= 0 ? '↑' : '↓' }} {{ formatPercentage(data.change) }}
                  </div>
                </td>
                <td class="py-4 px-4 text-right">
                  <div class="text-sm text-text-secondary font-mono tabular-nums">
                    {{ formatLargeNumber(data.volume) }}
                  </div>
                </td>
                <td class="py-4 px-4 text-right">
                  <div class="text-sm text-text-secondary font-mono tabular-nums">
                    {{ formatLargeNumber(data.marketCap) }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center justify-center">
                    <div class="w-16 h-8">
                      <MiniSparkline :symbol="selectedCrypto" :change="data.change" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

          <!-- Pagination Info -->
          <div class="mt-6 flex items-center justify-between text-sm text-text-tertiary border-t border-finance-border pt-4">
            <div>
              Showing <span class="font-semibold text-text-secondary">{{ streamData.length }}</span> real-time data points
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Auto-updating every 5 seconds</span>
            </div>
          </div>
        </div>

        <!-- Historical Data Tab -->
        <div v-show="activeTab === 'historical'" class="space-y-6">
          <!-- Date Range Picker -->
          <div class="card">
            <h3 class="text-lg font-display font-bold text-text-primary mb-4">
              Select Date Range
            </h3>
            <DateRangePicker
              v-model:startDate="historicalStartDate"
              v-model:endDate="historicalEndDate"
              v-model:interval="historicalInterval"
              @change="onDateRangeChange"
            />
            <div class="mt-4 flex gap-3">
              <button
                @click="loadHistoricalData"
                class="btn-primary"
                :disabled="isLoadingHistorical"
              >
                <svg 
                  v-if="!isLoadingHistorical"
                  class="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {{ isLoadingHistorical ? 'Loading...' : 'Load Data' }}
              </button>
              <button
                v-if="historicalData.length > 0"
                @click="clearHistoricalData"
                class="btn-secondary"
              >
                Clear Data
              </button>
            </div>
          </div>

          <!-- Historical Chart -->
          <HistoricalChart
            v-if="historicalData.length > 0"
            :data="historicalData"
            :symbol="selectedCrypto"
          />

          <!-- Historical Data Table -->
          <HistoricalDataTable
            :data="historicalData"
            :loading="isLoadingHistorical"
            :error="historicalError"
            :symbol="selectedCrypto"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card text-center py-16 animate-fade-in">
        <svg class="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
        </svg>
        <h3 class="text-xl font-display font-bold text-text-primary mb-2">Select a Cryptocurrency</h3>
        <p class="text-text-tertiary">Choose a crypto from the cards above to view its live data stream or historical data</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CryptoAsset } from '~/types/crypto'
import { 
  formatCurrency, 
  formatLargeNumber, 
  formatPercentage,
  formatTimeAgo
} from '~/utils/formatters'

// Use crypto data composable with error handling
const { 
  assets, 
  lastUpdate, 
  initialize, 
  startAutoRefresh, 
  stopAutoRefresh,
  isLoading 
} = useCryptoData()

// Use historical data composable
const {
  data: historicalData,
  isLoading: isLoadingHistorical,
  error: historicalError,
  fetchHistoricalData,
  clearData: clearHistoricalData
} = useHistoricalData()

const selectedCrypto = ref<string>('')
const streamData = ref<any[]>([])
const isRefreshing = ref(false)
const previousPrices = ref<Map<number, number>>(new Map())
const streamInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isStreamActive = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

// Tab state
const activeTab = ref<'live' | 'historical'>('live')

// Historical data filters
const historicalStartDate = ref<string>('')
const historicalEndDate = ref<string>('')
const historicalInterval = ref<string>('5m')

// Computed
const selectedAsset = computed(() => {
  return assets.value.find(a => a.symbol === selectedCrypto.value)
})

const timeAgo = computed(() => {
  if (!lastUpdate.value) return 'Never'
  return formatTimeAgo(lastUpdate.value)
})

// Methods
const selectCrypto = (symbol: string) => {
  try {
    hasError.value = false
    selectedCrypto.value = symbol
    
    // Clear existing stream data
    streamData.value = []
    previousPrices.value.clear()
    
    // Stop existing stream
    stopStream()
    
    // Generate initial data
    generateStreamData()
    
    // Start new stream
    startStream()
  } catch (error) {
    console.error('Error selecting crypto:', error)
    hasError.value = true
    errorMessage.value = 'Failed to load cryptocurrency data'
  }
}

const getDecimals = (symbol: string) => {
  return symbol === 'XRP/USD' ? 4 : 2
}

const generateStreamData = () => {
  if (!selectedAsset.value) return

  try {
    const data = []
    const basePrice = selectedAsset.value.price
    const now = Date.now()

    // Generate 20 data points (simulated historical data)
    for (let i = 19; i >= 0; i--) {
      const timestamp = now - (i * 5000) // Every 5 seconds
      const randomChange = (Math.random() - 0.5) * 4 // -2% to +2%
      const price = basePrice * (1 + randomChange / 100)
      const volume = selectedAsset.value.volume24h * (0.8 + Math.random() * 0.4)
      const marketCap = price * 19000000 // Simplified market cap calculation

      data.push({
        timestamp,
        price,
        change: randomChange,
        volume,
        marketCap
      })
    }

    streamData.value = data
  } catch (error) {
    console.error('Error generating stream data:', error)
    hasError.value = true
    errorMessage.value = 'Failed to generate stream data'
  }
}

const addNewStreamData = () => {
  if (!selectedCrypto.value || !selectedAsset.value) return

  try {
    const now = Date.now()
    const lastPrice = streamData.value.length > 0 
      ? streamData.value[streamData.value.length - 1].price 
      : selectedAsset.value.price
    
    // Generate realistic price movement
    const priceVariation = (Math.random() - 0.5) * (lastPrice * 0.003) // ±0.3% variation
    const newPrice = lastPrice + priceVariation
    const change = ((newPrice - selectedAsset.value.price) / selectedAsset.value.price) * 100
    
    const newData = {
      timestamp: now,
      price: newPrice,
      change: change,
      volume: selectedAsset.value.volume24h * (0.8 + Math.random() * 0.4),
      marketCap: newPrice * 19000000
    }
    
    streamData.value.push(newData)
    
    // Keep only last 20 items to prevent memory issues
    if (streamData.value.length > 20) {
      streamData.value.shift()
      // Clean up old price references
      const oldTimestamps = Array.from(previousPrices.value.keys())
        .filter(ts => ts < streamData.value[0].timestamp)
      oldTimestamps.forEach(ts => previousPrices.value.delete(ts))
    }
  } catch (error) {
    console.error('Error adding stream data:', error)
  }
}

const startStream = () => {
  if (isStreamActive.value || streamInterval.value) {
    console.warn('Stream already active')
    return
  }

  console.log('🎬 Starting data stream...')
  isStreamActive.value = true
  
  streamInterval.value = setInterval(() => {
    if (selectedCrypto.value && selectedAsset.value) {
      addNewStreamData()
    }
  }, 5000) // Update every 5 seconds
}

const stopStream = () => {
  if (streamInterval.value) {
    console.log('⏹️ Stopping data stream...')
    clearInterval(streamInterval.value)
    streamInterval.value = null
    isStreamActive.value = false
  }
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getRowFlashClass = (data: any) => {
  const prevPrice = previousPrices.value.get(data.timestamp)
  
  if (prevPrice === undefined) {
    previousPrices.value.set(data.timestamp, data.price)
    return ''
  }
  
  if (data.price > prevPrice) {
    previousPrices.value.set(data.timestamp, data.price)
    return 'flash-up'
  } else if (data.price < prevPrice) {
    previousPrices.value.set(data.timestamp, data.price)
    return 'flash-down'
  }
  
  return ''
}

// Historical data methods
const loadHistoricalData = async () => {
  if (!selectedCrypto.value || !historicalStartDate.value || !historicalEndDate.value) {
    hasError.value = true
    errorMessage.value = 'Please select a date range'
    return
  }

  try {
    hasError.value = false
    await fetchHistoricalData(
      selectedCrypto.value,
      historicalStartDate.value,
      historicalEndDate.value,
      historicalInterval.value
    )
  } catch (error: any) {
    console.error('Error loading historical data:', error)
    hasError.value = true
    errorMessage.value = error.message || 'Failed to load historical data'
  }
}

const onDateRangeChange = (values: any) => {
  historicalStartDate.value = values.startDate
  historicalEndDate.value = values.endDate
  historicalInterval.value = values.interval
}

const refreshData = async () => {
  try {
    isRefreshing.value = true
    hasError.value = false
    
    if (selectedCrypto.value) {
      generateStreamData()
    }
  } catch (error) {
    console.error('Error refreshing data:', error)
    hasError.value = true
    errorMessage.value = 'Failed to refresh data'
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 500)
  }
}

const exportStreamData = () => {
  try {
    const { exportToCSV } = useDataExport()
    const csvData = streamData.value.map(d => ({
      timestamp: new Date(d.timestamp).toISOString(),
      price: d.price,
      change: d.change,
      volume: d.volume,
      marketCap: d.marketCap
    }))
    
    exportToCSV(
      csvData,
      `${selectedCrypto.value.replace('/', '-')}-stream-${Date.now()}.csv`
    )
  } catch (error) {
    console.error('Error exporting data:', error)
    hasError.value = true
    errorMessage.value = 'Failed to export data'
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    // Initialize data if not already loaded
    if (assets.value.length === 0) {
      await initialize()
    }
    
    // Start auto-refresh for asset data (every 30 seconds)
    startAutoRefresh(30)
  } catch (error) {
    console.error('Error initializing stream page:', error)
    hasError.value = true
    errorMessage.value = 'Failed to initialize data stream'
  }
})

onBeforeUnmount(() => {
  // Clean up intervals
  stopStream()
  stopAutoRefresh()
  
  // Clear data to free memory
  streamData.value = []
  previousPrices.value.clear()
  
  console.log('✅ Stream page cleanup complete')
})
</script>
