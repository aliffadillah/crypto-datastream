<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            Live Market Prices
          </h2>
        </div>
        <p class="text-sm text-gray-600 ml-13">
          The global crypto market cap is 
          <span class="font-semibold text-gray-900">$1.71T</span>, 
          a <span class="text-success font-semibold">↑ 1.49%</span> increase over the last day
        </p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-xs text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <span v-if="lastUpdate">Updated {{ timeAgo }}</span>
        </div>
        <button class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 border border-gray-200 hover:border-gray-300 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Statistics</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto -mx-6 px-6">
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
                <CryptoIcon :symbol="asset.symbol" size="md" />
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
