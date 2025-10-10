<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <HeaderSimple />

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-4 md:py-8 max-w-[1800px]">
      <!-- Page Title & Description -->
      <div class="mb-6 md:mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
              WebSocket Real-Time Stream
            </h1>
            <p class="text-sm md:text-base text-text-tertiary">
              Live cryptocurrency data via Binance WebSocket • True real-time updates
            </p>
          </div>
          
          <!-- Connection Status -->
          <div class="flex items-center gap-3">
            <div 
              class="px-4 py-2 rounded-lg border flex items-center gap-2"
              :class="isLive 
                ? 'bg-success/10 border-success/20' 
                : 'bg-gray-100 border-gray-200'"
            >
              <div 
                class="w-2 h-2 rounded-full"
                :class="isLive ? 'bg-success animate-pulse' : 'bg-gray-400'"
              ></div>
              <span 
                class="text-xs font-semibold uppercase tracking-wide"
                :class="isLive ? 'text-success' : 'text-gray-500'"
              >
                {{ connectionStatus }}
              </span>
            </div>
            
            <button 
              @click="reconnect"
              :disabled="isLive"
              class="px-4 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all"
            >
              Reconnect
            </button>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-blue-900 mb-1">🚀 WebSocket Implementation</h3>
            <p class="text-sm text-blue-800 mb-2">
              Halaman ini menggunakan <strong>Binance WebSocket API</strong> untuk mendapatkan data real-time tanpa polling.
            </p>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>✅ <strong>Zero API Key Required</strong> - Tidak perlu CoinGecko API Key</li>
              <li>✅ <strong>True Real-time</strong> - Update instant setiap ada perubahan harga</li>
              <li>✅ <strong>No Rate Limit</strong> - Tidak ada batasan request</li>
              <li>✅ <strong>Auto Reconnect</strong> - Otomatis reconnect jika koneksi terputus</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p class="text-lg font-semibold text-text-secondary">Connecting to WebSocket...</p>
          <p class="mt-2 text-sm text-text-muted">Establishing connection to Binance</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="wsState.error" class="flex items-center justify-center py-16">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-text-primary mb-2">Connection Error</h2>
          <p class="text-text-secondary mb-4">{{ wsState.error }}</p>
          <button @click="reconnect" class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all">
            Try Reconnecting
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <ClientOnly>
        <template v-if="!isLoading && !wsState.error">
          <!-- Hero Section with Key Metrics -->
          <section class="mb-6 md:mb-8 animate-slide-up">
          <div class="bg-white border border-gray-200 rounded-xl p-4 md:p-8 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                  Live Market Data
                </h2>
                <p class="text-sm md:text-base text-gray-600">Real-time updates via WebSocket connection</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="px-3 py-1.5 md:px-4 md:py-2 bg-success/10 rounded-lg border border-success/20">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span class="text-[10px] md:text-xs font-semibold text-success uppercase tracking-wide">WEBSOCKET ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
            <StatusWidget />
          </div>
        </section>

        <!-- Crypto Ticker Table -->
        <section class="animate-fade-in">
          <CryptoTickerTable />
        </section>

        <!-- WebSocket Stats -->
        <section class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          <div class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold uppercase">Connection</p>
                <p class="text-lg font-bold text-gray-900">{{ connectionStatus }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold uppercase">Last Update</p>
                <p class="text-lg font-bold text-gray-900">{{ timeAgo }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold uppercase">Symbols</p>
                <p class="text-lg font-bold text-gray-900">{{ assets.length }}</p>
              </div>
            </div>
          </div>
        </section>
        </template>
      </ClientOnly>

      <!-- Footer Info -->
      <section class="text-center text-text-tertiary text-sm py-12 border-t border-finance-border mt-12">
        <div class="mb-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-3">
            <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold text-text-secondary">WebSocket Demo</span>
          </div>
        </div>
        <p class="mb-2 text-base">
          <strong class="text-text-primary font-display">Real-Time WebSocket Implementation</strong> 
        </p>
        <p class="text-xs text-text-muted max-w-2xl mx-auto mb-3">
          Powered by Binance WebSocket API • Zero polling • Instant updates • No API key required
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatTimeAgo } from '~/utils/formatters'

const { assets, isLoading, wsState, lastUpdate, isLive, connectionStatus, topGainer, initialize, reconnect, cleanup } = useWebSocketCrypto()

// Time ago computed
const timeAgo = computed(() => {
  if (!lastUpdate.value) return 'Never'
  return formatTimeAgo(lastUpdate.value)
})

onMounted(async () => {
  await initialize()
})

onUnmounted(() => {
  cleanup()
})

useHead({
  title: 'WebSocket Real-Time Stream - CryptoStream',
  meta: [
    { name: 'description', content: 'Real-time cryptocurrency market data via WebSocket connection with instant updates' }
  ]
})
</script>
