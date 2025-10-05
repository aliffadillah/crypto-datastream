<template>
  <div class="historical-chart">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div class="min-w-0 flex-1">
        <h3 class="text-base md:text-lg font-display font-bold text-text-primary">
          Price Chart
        </h3>
        <p class="text-xs md:text-sm text-text-tertiary truncate">
          {{ symbol }} Historical Price
        </p>
      </div>

      <!-- Chart Type Selector -->
      <div class="flex gap-1 md:gap-2 overflow-x-auto pb-1">
        <button
          v-for="type in chartTypes"
          :key="type.value"
          @click="selectedChartType = type.value"
          class="px-2.5 py-1.5 md:px-3 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
          :class="selectedChartType === type.value 
            ? 'bg-primary text-white' 
            : 'bg-finance-surface border border-finance-border text-text-secondary hover:border-primary'"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="card p-2 md:p-4">
      <ClientOnly>
        <apexchart
          v-if="chartOptions && series.length > 0"
          type="candlestick"
          :options="chartOptions"
          :series="series"
          :height="chartHeight"
        />
        <div v-else class="text-center py-12">
          <svg class="w-12 h-12 md:w-16 md:h-16 text-text-muted mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="text-sm md:text-base text-text-tertiary">No chart data available</p>
        </div>
      </ClientOnly>
    </div>

    <!-- Stats Summary -->
    <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-4">
      <div class="card p-3 md:p-4">
        <div class="text-[10px] md:text-xs text-text-muted mb-1">Highest Price</div>
        <div class="text-sm md:text-lg font-bold text-success truncate">{{ formatCurrency(stats.highest) }}</div>
      </div>
      <div class="card p-3 md:p-4">
        <div class="text-[10px] md:text-xs text-text-muted mb-1">Lowest Price</div>
        <div class="text-sm md:text-lg font-bold text-danger truncate">{{ formatCurrency(stats.lowest) }}</div>
      </div>
      <div class="card p-3 md:p-4">
        <div class="text-[10px] md:text-xs text-text-muted mb-1">Average Price</div>
        <div class="text-sm md:text-lg font-bold text-text-primary truncate">{{ formatCurrency(stats.average) }}</div>
      </div>
      <div class="card p-3 md:p-4">
        <div class="text-[10px] md:text-xs text-text-muted mb-1">Total Change</div>
        <div 
          class="text-sm md:text-lg font-bold truncate"
          :class="stats.totalChange >= 0 ? 'text-success' : 'text-danger'"
        >
          {{ stats.totalChange >= 0 ? '+' : '' }}{{ formatPercentage(stats.totalChange) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CandleData } from '~/types/crypto'
import { formatCurrency, formatPercentage } from '~/utils/formatters'

const props = defineProps<{
  data: CandleData[]
  symbol?: string
}>()

const selectedChartType = ref<'candlestick' | 'line' | 'area'>('candlestick')

const chartTypes = [
  { label: 'Candlestick', value: 'candlestick' as const },
  { label: 'Line', value: 'line' as const },
  { label: 'Area', value: 'area' as const }
]

// Responsive chart height
const chartHeight = ref(450)

const updateChartHeight = () => {
  if (typeof window !== 'undefined') {
    chartHeight.value = window.innerWidth < 768 ? 300 : 450
  }
}

onMounted(() => {
  updateChartHeight()
  window.addEventListener('resize', updateChartHeight)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateChartHeight)
  }
})

// Prepare chart series
const series = computed(() => {
  if (!props.data || props.data.length === 0) return []

  if (selectedChartType.value === 'candlestick') {
    return [{
      name: 'Price',
      data: props.data.map(candle => ({
        x: new Date(candle.timestamp),
        y: [candle.open, candle.high, candle.low, candle.close]
      }))
    }]
  } else {
    return [{
      name: 'Price',
      data: props.data.map(candle => ({
        x: new Date(candle.timestamp),
        y: candle.close
      }))
    }]
  }
})

// Chart options
const chartOptions = computed(() => {
  const isDark = true // You can make this dynamic based on theme

  const baseOptions = {
    chart: {
      type: selectedChartType.value,
      toolbar: {
        show: true,
        tools: {
          download: true,
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
      },
      background: 'transparent'
    },
    theme: {
      mode: isDark ? 'dark' : 'light'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#9CA3AF'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM yyyy',
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
          colors: '#9CA3AF'
        },
        formatter: (value: number) => formatCurrency(value)
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: {
        format: 'dd MMM yyyy HH:mm'
      }
    }
  }

  if (selectedChartType.value === 'candlestick') {
    return {
      ...baseOptions,
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#10b981',
            downward: '#ef4444'
          }
        }
      }
    }
  } else if (selectedChartType.value === 'area') {
    return {
      ...baseOptions,
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: ['#3b82f6']
    }
  } else {
    return {
      ...baseOptions,
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#3b82f6']
    }
  }
})

// Calculate stats
const stats = computed(() => {
  if (!props.data || props.data.length === 0) return null

  const prices = props.data.map(c => c.close)
  const highest = Math.max(...props.data.map(c => c.high))
  const lowest = Math.min(...props.data.map(c => c.low))
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length
  
  const firstCandle = props.data[0]
  const lastCandle = props.data[props.data.length - 1]
  
  if (!firstCandle || !lastCandle) return null

  const firstPrice = firstCandle.open
  const lastPrice = lastCandle.close
  const totalChange = ((lastPrice - firstPrice) / firstPrice) * 100

  return {
    highest,
    lowest,
    average,
    totalChange
  }
})
</script>
