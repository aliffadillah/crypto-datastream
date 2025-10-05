<template>
  <div class="card">
    <!-- Crypto Selector -->
    <div class="mb-6 pb-4 border-b border-dark-border">
      <h3 class="text-sm font-semibold text-dark-text-secondary mb-3">Select Cryptocurrency</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="asset in assets"
          :key="asset.symbol"
          @click="selectCrypto(asset.symbol)"
          :class="[
            'p-3 rounded-lg border-2 transition-all text-left',
            selectedCryptoSymbol === asset.symbol
              ? 'border-primary bg-primary/10'
              : 'border-dark-border hover:border-primary/50 hover:bg-dark-bg'
          ]"
        >
          <div class="flex items-center gap-2 mb-1">
            <CryptoIcon :symbol="asset.symbol" class="w-6 h-6" />
            <span class="font-semibold text-dark-text-primary text-sm">
              {{ asset.symbol.split('/')[0] }}
            </span>
          </div>
          <div class="text-xs text-dark-text-secondary">
            ${{ asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
          <div :class="[
            'text-xs font-medium',
            asset.change24h >= 0 ? 'text-success' : 'text-danger'
          ]">
            {{ asset.change24h >= 0 ? '↑' : '↓' }} {{ Math.abs(asset.change24h).toFixed(2) }}%
          </div>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-dark-text-primary">{{ selectedCryptoSymbol }} - Candlestick Chart</h2>
        <p class="text-sm text-dark-text-secondary mt-1">5-minute interval • Interactive chart</p>
      </div>
      
      <!-- Interval selector (future feature) -->
      <div class="flex gap-2">
        <button class="px-3 py-1 text-sm bg-primary text-white rounded-lg font-medium">
          5M
        </button>
        <button class="px-3 py-1 text-sm bg-dark-bg text-dark-text-secondary rounded-lg font-medium hover:bg-dark-border transition-colors">
          1H
        </button>
        <button class="px-3 py-1 text-sm bg-dark-bg text-dark-text-secondary rounded-lg font-medium hover:bg-dark-border transition-colors">
          1D
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative" style="min-height: 400px;">
      <!-- Loading State -->
      <div v-if="isLoadingChart" class="flex items-center justify-center h-96">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
          <p class="text-dark-text-secondary">Loading {{ selectedCryptoSymbol }} chart data...</p>
        </div>
      </div>

      <!-- Chart -->
      <ClientOnly>
        <apexchart
          v-if="!isLoadingChart && chartOptions && series.length > 0"
          type="candlestick"
          height="400"
          :options="chartOptions"
          :series="series"
        />
        <div v-else-if="!isLoadingChart && series.length === 0" class="flex items-center justify-center h-96">
          <div class="text-center">
            <svg class="w-16 h-16 text-dark-text-secondary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-dark-text-secondary">No chart data available</p>
          </div>
        </div>
      </ClientOnly>
    </div>

    <!-- Chart Stats -->
    <div class="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-dark-border">
      <div v-if="latestCandle">
        <p class="text-xs text-dark-text-secondary mb-1">Open</p>
        <p class="text-sm font-mono font-semibold text-dark-text-primary">
          ${{ latestCandle.open.toLocaleString() }}
        </p>
      </div>
      <div v-if="latestCandle">
        <p class="text-xs text-dark-text-secondary mb-1">High</p>
        <p class="text-sm font-mono font-semibold text-primary">
          ${{ latestCandle.high.toLocaleString() }}
        </p>
      </div>
      <div v-if="latestCandle">
        <p class="text-xs text-dark-text-secondary mb-1">Low</p>
        <p class="text-sm font-mono font-semibold text-danger">
          ${{ latestCandle.low.toLocaleString() }}
        </p>
      </div>
      <div v-if="latestCandle">
        <p class="text-xs text-dark-text-secondary mb-1">Close</p>
        <p class="text-sm font-mono font-semibold text-dark-text-primary">
          ${{ latestCandle.close.toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { CandleData } from '~/types/crypto'

const { assets } = useCryptoData()

// Local state for selected crypto and its candle data
const selectedCryptoSymbol = ref('BTC/USD')
const cryptoCandleData = ref<CandleData[]>([])
const isLoadingChart = ref(false)

// Mapping crypto symbols to CoinGecko IDs
const symbolMapping: Record<string, string> = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'SOL/USD': 'solana',
  'XRP/USD': 'ripple',
  'BNB/USD': 'binancecoin',
  'ADA/USD': 'cardano',
  'LINK/USD': 'chainlink',
  'DOGE/USD': 'dogecoin',
  'TRX/USD': 'tron'
}

// Fetch candle data for selected crypto
const fetchCandleData = async (symbol: string) => {
  isLoadingChart.value = true
  
  try {
    const { useCryptoApi } = await import('~/services/cryptoApi')
    const api = useCryptoApi()
    
    console.log(`📊 Fetching candle data for ${symbol} from CoinGecko...`)
    
    const coinId = symbolMapping[symbol]
    if (!coinId) {
      throw new Error(`No mapping found for ${symbol}`)
    }
    
    const data = await api.getHistoricalData(coinId, { days: 1 })
    cryptoCandleData.value = data
    
    console.log(`✅ Loaded ${data.length} candles for ${symbol}`)
  } catch (error) {
    console.error(`❌ Error fetching candle data for ${symbol}:`, error)
    cryptoCandleData.value = []
  } finally {
    isLoadingChart.value = false
  }
}

// Select crypto and load its data
const selectCrypto = async (symbol: string) => {
  if (selectedCryptoSymbol.value === symbol) return
  
  selectedCryptoSymbol.value = symbol
  await fetchCandleData(symbol)
}

// Latest candle for stats
const latestCandle = computed(() => {
  if (cryptoCandleData.value.length === 0) return null
  return cryptoCandleData.value[cryptoCandleData.value.length - 1]
})

// Load initial data on mount
onMounted(async () => {
  await fetchCandleData(selectedCryptoSymbol.value)
})

// Prepare chart series data
const series = computed(() => {
  if (!cryptoCandleData.value || cryptoCandleData.value.length === 0) {
    return []
  }

  const data = cryptoCandleData.value.map(candle => {
    // Ensure timestamp is a number
    const timestamp = typeof candle.timestamp === 'number' 
      ? candle.timestamp 
      : new Date(candle.timestamp).getTime()
    
    return {
      x: timestamp,
      y: [candle.open, candle.high, candle.low, candle.close]
    }
  })

  return [
    {
      name: 'Price',
      data
    }
  ]
})

// ApexCharts options
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'candlestick',
    height: 400,
    background: 'transparent',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true
    }
  },
  theme: {
    mode: 'dark'
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#10B981',
        downward: '#EF4444'
      },
      wick: {
        useFillColor: true
      }
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#94A3B8'
      },
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm'
      }
    }
  },
  yaxis: {
    tooltip: {
      enabled: true
    },
    labels: {
      style: {
        colors: '#94A3B8'
      },
      formatter: (value: number) => {
        return '$' + value.toLocaleString()
      }
    }
  },
  grid: {
    borderColor: '#334155',
    strokeDashArray: 4
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px'
    },
    x: {
      format: 'dd MMM yyyy HH:mm'
    }
  }
}))
</script>
