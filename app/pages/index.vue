<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <HeaderSimple />

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8 max-w-[1800px]">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p class="mt-6 text-lg font-semibold text-text-secondary">Loading cryptocurrency data...</p>
          <p class="mt-2 text-sm text-text-muted">Fetching real-time market data</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="apiError" class="flex items-center justify-center py-32">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-display font-bold text-text-primary mb-3">Failed to Load Data</h2>
          <p class="text-text-secondary mb-8">{{ apiError }}</p>
          <button 
            @click="refreshData"
            class="px-8 py-3 bg-gradient-to-r from-primary to-blue hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Hero Section with Key Metrics -->
        <section class="mb-8 animate-slide-up">
          <div class="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                  Market Overview
                </h2>
                <p class="text-gray-600">Real-time cryptocurrency market intelligence and analytics</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="px-4 py-2 bg-success/10 rounded-lg border border-success/20">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span class="text-xs font-semibold text-success uppercase tracking-wide">LIVE DATA</span>
                  </div>
                </div>
              </div>
            </div>
            <StatusWidget />
          </div>
        </section>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <!-- Main Content Area -->
          <div class="xl:col-span-8 space-y-8">
            <!-- Market Overview Table -->
            <section id="market" class="animate-fade-in" style="animation-delay: 0.1s">
              <CryptoTickerTable />
            </section>

            <!-- Candlestick Chart -->
            <section id="analisis" class="animate-fade-in" style="animation-delay: 0.2s">
              <CandlestickChart />
            </section>
          </div>

          <!-- Sidebar -->
          <aside class="xl:col-span-4">
            <div class="sticky top-28 space-y-6">
              <!-- Market Stats Card -->
              <div class="bg-white border border-gray-200 rounded-xl p-6 animate-fade-in shadow-sm" style="animation-delay: 0.15s">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  Market Statistics
                </h3>
                <div class="space-y-4">
                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600 font-medium">Total Market Cap</span>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 tabular-nums">$1.71T</p>
                    <div class="flex items-center gap-1 mt-2">
                      <span class="text-success text-sm font-semibold">↑ 1.49%</span>
                      <span class="text-xs text-gray-500">24h</span>
                    </div>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600 font-medium">24h Trading Volume</span>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 tabular-nums">$84.3B</p>
                    <div class="flex items-center gap-1 mt-2">
                      <span class="text-danger text-sm font-semibold">↓ 0.82%</span>
                      <span class="text-xs text-gray-500">24h</span>
                    </div>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600 font-medium">BTC Dominance</span>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 tabular-nums">48.5%</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div class="bg-primary h-2 rounded-full transition-all" style="width: 48.5%"></div>
                    </div>
                  </div>

                  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-gray-600 font-medium">Fear & Greed Index</span>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-success tabular-nums">62</p>
                    <p class="text-sm font-semibold text-success mt-1">Greed</p>
                  </div>
                </div>
              </div>

              <!-- Export Panel -->
              <section class="animate-fade-in" style="animation-delay: 0.3s">
                <ExportPanel />
              </section>
            </div>
          </aside>
        </div>
      </template>

      <!-- Footer Info -->
      <section class="text-center text-text-tertiary text-sm py-12 border-t border-finance-border mt-12">
        <div class="mb-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-3">
            <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold text-text-secondary">Live Demo</span>
          </div>
        </div>
        <p class="mb-2 text-base">
          <strong class="text-text-primary font-display">CryptoStream</strong> 
        </p>
        <p class="text-xs text-text-muted max-w-2xl mx-auto mb-3">
          Real-time cryptocurrency market analysis with live data from API • 
          Binance supported
        </p>
        <p class="text-xs text-text-muted/70">
          Nuxt 3 • Vue 3 • TypeScript • TailwindCSS • ApexCharts • Pinia
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { initialize, startAutoRefresh, cleanup, refreshData, isLoading, apiError } = useCryptoData()

onMounted(async () => {
  await initialize()
  startAutoRefresh(30)
})

onUnmounted(() => {
  cleanup()
})

useHead({
  title: 'CryptoStream - Real-time Crypto Market Analysis',
  meta: [
    { name: 'description', content: 'Real-time cryptocurrency market analysis platform with live data visualization and export capabilities for Big Data analysis' }
  ]
})
</script>
