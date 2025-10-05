<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm animate-fade-in overflow-hidden">
    <!-- Header Section -->
    <div class="p-4 md:p-6 border-b border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Title Section -->
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">
              Live Market Prices
            </h2>
          </div>
          <p class="text-xs md:text-sm text-gray-600">
            Market cap 
            <span class="font-semibold text-gray-900">$1.71T</span>, 
            <span class="text-success font-semibold">↑ 1.49%</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 md:gap-4">
          <div class="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <span v-if="lastUpdate" class="hidden sm:inline">Updated {{ timeAgo }}</span>
            <span v-if="lastUpdate" class="sm:hidden">{{ timeAgo }}</span>
          </div>
          <button class="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 border border-gray-200 hover:border-gray-300 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Statistics</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="block md:hidden">
      <div class="divide-y divide-gray-100">
        <div
          v-for="(asset, index) in assets"
          :key="asset.symbol"
          class="p-4 hover:bg-gray-50 transition-all duration-150 active:bg-gray-100"
          :class="getPriceFlashClass(asset)"
        >
          <!-- Top Row: Icon, Name, Price -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                {{ index + 1 }}
              </div>
              <div class="w-8 h-8 flex-shrink-0">
                <CryptoIcon :symbol="asset.symbol" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-gray-900 text-sm truncate">{{ asset.symbol.split('/')[0] }}</div>
                <div class="text-[10px] text-gray-500 font-medium truncate">{{ asset.name }}</div>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="font-mono font-bold text-gray-900 text-base tabular-nums">
                {{ formatCurrency(asset.price, getDecimals(asset.symbol)) }}
              </div>
            </div>
          </div>

          <!-- Bottom Row: Change, Volume, Chart -->
          <div class="flex items-center gap-2">
            <!-- Change Badge -->
            <div 
              class="px-2 py-1 rounded-md font-bold text-xs tabular-nums flex-shrink-0"
              :class="asset.change24h >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
            >
              {{ getPriceArrow(asset.change24h) }} {{ formatPercentage(asset.change24h) }}
            </div>

            <!-- Volume -->
            <div class="text-[11px] text-gray-500 flex-shrink-0">
              Vol: <span class="font-semibold text-gray-700">${{ formatLargeNumber(asset.volume24h) }}</span>
            </div>

            <!-- Mini Chart -->
            <div class="flex-1 flex justify-end">
              <div class="w-16 h-8">
                <MiniSparkline :symbol="asset.symbol" :change="asset.change24h" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b-2 border-finance-border">
            <th class="text-left py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">#</th>
            <th class="text-left py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">Name</th>
            <th class="text-right py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">Price</th>
            <th class="text-right py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">24h Change</th>
            <th class="text-right py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">Volume 24h</th>
            <th class="text-right py-4 px-5 text-xs font-black text-text-muted uppercase tracking-wider bg-finance-hover/30">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(asset, index) in assets"
            :key="asset.symbol"
            class="table-row"
            :class="getPriceFlashClass(asset)"
          >
            <td class="py-5 px-5 text-text-muted text-sm font-bold">
              <div class="w-8 h-8 rounded-full bg-finance-hover flex items-center justify-center text-xs">
                {{ index + 1 }}
              </div>
            </td>
            <td class="py-5 px-5">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex-shrink-0">
                  <CryptoIcon :symbol="asset.symbol" />
                </div>
                <div>
                  <div class="font-bold text-text-primary text-base">{{ asset.symbol.split('/')[0] }}</div>
                  <div class="text-xs text-text-muted font-medium">{{ asset.name }}</div>
                </div>
              </div>
            </td>
            <td class="py-5 px-5 text-right">
              <span class="font-mono font-black text-text-primary tabular-nums text-lg">
                {{ formatCurrency(asset.price, getDecimals(asset.symbol)) }}
              </span>
            </td>
            <td class="py-5 px-5 text-right">
              <div class="flex items-center justify-end gap-2">
                <div 
                  class="px-3 py-1.5 rounded-lg font-bold text-sm tabular-nums"
                  :class="asset.change24h >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
                >
                  {{ getPriceArrow(asset.change24h) }} {{ formatPercentage(asset.change24h) }}
                </div>
              </div>
            </td>
            <td class="py-5 px-5 text-right">
              <div class="text-base text-text-primary font-bold tabular-nums">
                ${{ formatLargeNumber(asset.volume24h) }}
              </div>
              <div class="text-xs text-text-muted font-medium mt-0.5">
                {{ formatLargeNumber(asset.volume24h) }}
              </div>
            </td>
            <td class="py-4 px-4 text-right">
              <div class="flex items-center justify-end">
                <div class="w-24 h-12">
                  <MiniSparkline :symbol="asset.symbol" :change="asset.change24h" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CryptoAsset } from '~/types/crypto'
import { 
  formatCurrency, 
  formatLargeNumber, 
  formatPercentage,
  formatTimeAgo,
  getPriceColorClass,
  getPriceArrow
} from '~/utils/formatters'

const { assets, lastUpdate } = useCryptoData()

// Track previous prices for flash animation
const previousPrices = ref<Map<string, number>>(new Map())

// Time ago computed
const timeAgo = computed(() => {
  if (!lastUpdate.value) return ''
  return formatTimeAgo(lastUpdate.value)
})

// Get decimals based on symbol
const getDecimals = (symbol: string) => {
  return symbol === 'XRP/USD' ? 4 : 2
}

// Get flash class based on price direction
const getPriceFlashClass = (asset: CryptoAsset) => {
  const prevPrice = previousPrices.value.get(asset.symbol)
  
  if (prevPrice === undefined) {
    previousPrices.value.set(asset.symbol, asset.price)
    return ''
  }
  
  if (asset.price > prevPrice) {
    previousPrices.value.set(asset.symbol, asset.price)
    return 'flash-up'
  } else if (asset.price < prevPrice) {
    previousPrices.value.set(asset.symbol, asset.price)
    return 'flash-down'
  }
  
  return ''
}

// Update previous prices
watch(() => assets.value, () => {
  // This triggers reactivity for flash animation
}, { deep: true })
</script>
