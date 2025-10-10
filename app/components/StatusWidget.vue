<template>
  <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
    <!-- Portfolio Value -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      <div class="flex items-start justify-between mb-3 md:mb-4">
        <div class="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="px-1.5 py-1 md:px-2.5 md:py-1 bg-success/10 rounded-md flex-shrink-0">
          <svg class="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <div>
        <p class="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:mb-2">Portfolio Value</p>
        <p class="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 tabular-nums">$128.1K</p>
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-success text-xs md:text-sm font-semibold">+1.57%</span>
          <span class="text-[10px] md:text-xs text-gray-500 hidden sm:inline">Today</span>
        </div>
      </div>
    </div>

    <!-- New Assets -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      <div class="flex items-start justify-between mb-3 md:mb-4">
        <div class="w-8 h-8 md:w-12 md:h-12 bg-blue rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div class="px-1.5 py-1 md:px-2.5 md:py-1 bg-danger/10 rounded-md flex-shrink-0">
          <svg class="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
      </div>
      <div>
        <p class="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:mb-2">New Assets</p>
        <p class="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 tabular-nums">1,292</p>
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-danger text-xs md:text-sm font-semibold">-0.02%</span>
          <span class="text-[10px] md:text-xs text-gray-500 hidden sm:inline">vs yesterday</span>
        </div>
      </div>
    </div>

    <!-- Top Gainers -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      <div class="flex items-start justify-between mb-3 md:mb-4">
        <div class="w-8 h-8 md:w-12 md:h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span class="text-base md:text-lg">🔥</span>
      </div>
      <div>
        <p class="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:mb-2">Top Gainer</p>
        <p class="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 tabular-nums truncate">{{ topGainer }}</p>
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-success text-xs md:text-sm font-semibold">+2.11%</span>
          <span class="text-[10px] md:text-xs text-gray-500 hidden sm:inline">24h change</span>
        </div>
      </div>
    </div>

    <!-- Market Cap -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      <div class="flex items-start justify-between mb-3 md:mb-4">
        <div class="w-8 h-8 md:w-12 md:h-12 bg-purple rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="px-1.5 py-1 md:px-2.5 md:py-1 bg-success/10 rounded-md flex-shrink-0">
          <svg class="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <div>
        <p class="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:mb-2">Market Cap</p>
        <p class="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 tabular-nums">$12.1T</p>
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-success text-xs md:text-sm font-semibold">+3.45%</span>
          <span class="text-[10px] md:text-xs text-gray-500 hidden sm:inline">This week</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTimeAgo } from '~/utils/formatters'

// Switch to WebSocket for real-time data
const { assets, lastUpdate, isLive } = useWebSocketCrypto()
// candleData not available in WebSocket (only for historical charts)
const candleData = ref([])

const topGainer = computed(() => {
  if (!assets.value || assets.value.length === 0) return 'N/A'
  const sorted = [...assets.value].sort((a, b) => b.change24h - a.change24h)
  return sorted[0]?.symbol.split('/')[0] || 'N/A'
})

const timeAgo = computed(() => {
  if (!lastUpdate.value) return 'Never'
  return formatTimeAgo(lastUpdate.value)
})
</script>
