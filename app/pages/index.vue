<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <HeaderSimple />

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-4 md:py-8 max-w-[1800px]">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16 md:py-32">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p class="mt-6 text-lg font-semibold text-text-secondary">Loading cryptocurrency data...</p>
          <p class="mt-2 text-sm text-text-muted">Fetching real-time market data</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="apiError" class="flex items-center justify-center py-32">
        <div class="text-center max-w-2xl mx-auto">
          <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-3xl font-display font-bold text-text-primary mb-4">Tidak Bisa Mendapatkan Data</h2>
          <p class="text-lg text-text-secondary mb-6 leading-relaxed">{{ apiError }}</p>
          
          <!-- Instructions for API Key Setup -->
          <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8 text-left">
            <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cara Mengaktifkan API Key:
            </h3>
            <ol class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start gap-2">
                <span class="font-bold text-primary">1.</span>
                <span>Buat file <code class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">.env</code> di root project</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-primary">2.</span>
                <span>Copy isi dari <code class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">.env.example</code></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-primary">3.</span>
                <span>Isi 3 API Key CoinGecko Anda di variabel <code class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">NUXT_PUBLIC_COINGECKO_API_KEY_1</code>, <code class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">_2</code>, dan <code class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">_3</code></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-primary">4.</span>
                <span>Restart server development Anda</span>
              </li>
            </ol>
            <div class="mt-4 pt-4 border-t border-yellow-300">
              <p class="text-xs text-gray-600">
                <strong>Catatan:</strong> Belum punya API Key? Daftar gratis di 
                <a href="https://www.coingecko.com/en/api" target="_blank" class="text-primary font-semibold hover:underline">CoinGecko API</a>
              </p>
            </div>
          </div>
          
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
        <section class="mb-6 md:mb-8 animate-slide-up">
          <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-8 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                  Market Overview
                </h2>
                <p class="text-sm md:text-base text-gray-600">Real-time crypto market intelligence</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="px-3 py-1.5 md:px-4 md:py-2 bg-success/10 rounded-lg border border-success/20">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span class="text-[10px] md:text-xs font-semibold text-success uppercase tracking-wide">LIVE DATA</span>
                  </div>
                </div>
              </div>
            </div>
            <StatusWidget />
          </div>
        </section>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8">
          <!-- Main Content Area -->
          <div class="xl:col-span-8 space-y-4 md:space-y-8">
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
            <div class="xl:sticky xl:top-28 space-y-4 md:space-y-6">
              <!-- Market Stats Card -->
              <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-6 animate-fade-in shadow-sm" style="animation-delay: 0.15s">
                <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <div class="w-7 h-7 md:w-8 md:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  Market Statistics
                </h3>
                <div class="space-y-3 md:space-y-4">
                  <div class="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs md:text-sm text-gray-600 font-medium">Total Market Cap</span>
                      <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-xl md:text-2xl font-bold text-gray-900 tabular-nums">$1.71T</p>
                    <div class="flex items-center gap-1 mt-1.5 md:mt-2">
                      <span class="text-success text-xs md:text-sm font-semibold">↑ 1.49%</span>
                      <span class="text-[10px] md:text-xs text-gray-500">24h</span>
                    </div>
                  </div>

                  <div class="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs md:text-sm text-gray-600 font-medium">24h Trading Volume</span>
                      <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <p class="text-xl md:text-2xl font-bold text-gray-900 tabular-nums">$84.3B</p>
                    <div class="flex items-center gap-1 mt-1.5 md:mt-2">
                      <span class="text-danger text-xs md:text-sm font-semibold">↓ 0.82%</span>
                      <span class="text-[10px] md:text-xs text-gray-500">24h</span>
                    </div>
                  </div>

                  <div class="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs md:text-sm text-gray-600 font-medium">BTC Dominance</span>
                      <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p class="text-xl md:text-2xl font-bold text-gray-900 tabular-nums">48.5%</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2.5 md:mt-3">
                      <div class="bg-primary h-2 rounded-full transition-all" style="width: 48.5%"></div>
                    </div>
                  </div>

                  <div class="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs md:text-sm text-gray-600 font-medium">Fear & Greed Index</span>
                      <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-xl md:text-2xl font-bold text-success tabular-nums">62</p>
                    <p class="text-xs md:text-sm font-semibold text-success mt-1">Greed</p>
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
          Real-time cryptocurrency market analysis with live data from CoinGecko API • 
          9+ Cryptocurrencies supported
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
