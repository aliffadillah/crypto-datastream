<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
    <div class="container mx-auto px-4 md:px-6 max-w-[1800px]">
      <!-- Main Header -->
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-2 md:gap-4">
          <div>
            <h1 class="text-lg md:text-2xl font-display font-bold text-gray-900 tracking-tight">
              CryptoStream
            </h1>
          </div>
        </div>

        <!-- Center - Quick Stats -->
        <div class="hidden xl:flex items-center gap-6">
          <div class="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Market Cap</p>
              <p class="text-sm font-bold text-gray-900 tabular-nums">$1.71T</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-8 h-8 bg-blue/10 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">24h Volume</p>
              <p class="text-sm font-bold text-gray-900 tabular-nums">$84.3B</p>
            </div>
          </div>

          <div class="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">BTC Dominance</p>
              <p class="text-sm font-bold text-gray-900 tabular-nums">48.5%</p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Refresh Button -->
          <button
            @click="handleRefresh"
            :disabled="isRefreshing"
            class="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-semibold active:scale-95"
            title="Refresh data"
          >
            <svg 
              :class="['w-3.5 h-3.5 md:w-4 md:h-4', isRefreshing && 'animate-spin']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2.5" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span class="text-xs md:text-sm hidden sm:inline">Refresh</span>
          </button>

          <!-- Market Status -->
          <div class="hidden md:flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-success/10 rounded-lg border border-success/20">
            <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold text-success uppercase tracking-wide">Live</span>
          </div>

          <!-- Time Display -->
          <div class="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-semibold text-gray-900 tabular-nums">{{ currentTime }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex items-center gap-0.5 md:gap-1 border-t border-gray-200 py-1.5 md:py-2 -mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
        <NuxtLink 
          to="/" 
          class="relative px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap flex-shrink-0"
          :class="$route.path === '/' 
            ? 'text-primary bg-primary/10' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <span class="relative z-10 flex items-center gap-1.5 md:gap-2">
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="hidden sm:inline">Market Overview</span>
            <span class="sm:hidden">Market</span>
          </span>
          <div v-if="$route.path === '/'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
        </NuxtLink>
        
        <NuxtLink 
          to="/stream" 
          class="relative px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap flex-shrink-0"
          :class="$route.path === '/stream' 
            ? 'text-primary bg-primary/10' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <span class="relative z-10 flex items-center gap-1.5 md:gap-2">
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="hidden sm:inline">Data Stream</span>
            <span class="sm:hidden">Stream</span>
          </span>
          <div v-if="$route.path === '/stream'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
        </NuxtLink>
        
        <!-- Spacer -->
        <div class="flex-1"></div>
        
        <!-- Additional Quick Actions -->
        <div class="hidden lg:flex items-center gap-2">
          <button class="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Alerts
            </span>
          </button>
          <button class="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Settings
            </span>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { refreshData } = useCryptoData()

const currentTime = ref('')
const isRefreshing = ref(false)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  })
}

const handleRefresh = async () => {
  isRefreshing.value = true
  try {
    await refreshData()
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 1000)
  
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>
