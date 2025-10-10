<template>
  <div id="ekspor" class="card">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-dark-text-primary mb-2">Export Data</h2>
      <p class="text-sm text-dark-text-secondary">
        Download historical candlestick data or current market snapshot for Big Data analysis
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Export Historical CSV -->
      <div class="border border-dark-border rounded-lg p-4 hover:border-primary transition-colors">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-dark-text-primary mb-1">Historical Data (CSV)</h3>
            <p class="text-xs text-dark-text-secondary mb-3">
              Export all {{ candleData.length }} candlestick data points with OHLC values
            </p>
            <ul class="text-xs text-dark-text-secondary space-y-1 mb-4">
              <li>✓ Timestamp & DateTime</li>
              <li>✓ Open, High, Low, Close</li>
              <li>✓ Volume data</li>
              <li>✓ Ready for Pandas/Excel</li>
            </ul>
            <button
              @click="handleExportCSV"
              :disabled="isExporting"
              class="btn-primary w-full justify-center"
            >
              <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ isExporting ? 'Exporting...' : 'Download CSV' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Export Live JSON -->
      <div class="border border-dark-border rounded-lg p-4 hover:border-primary transition-colors">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-dark-text-primary mb-1">Live Snapshot (JSON)</h3>
            <p class="text-xs text-dark-text-secondary mb-3">
              Export current state of all {{ assets.length }} cryptocurrency assets
            </p>
            <ul class="text-xs text-dark-text-secondary space-y-1 mb-4">
              <li>✓ Current prices</li>
              <li>✓ 24h volume & change</li>
              <li>✓ Timestamp metadata</li>
              <li>✓ JSON format for APIs</li>
            </ul>
            <button
              @click="handleExportJSON"
              :disabled="isExporting"
              class="btn-secondary w-full justify-center"
            >
              <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ isExporting ? 'Exporting...' : 'Download JSON' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Status Messages -->
    <transition name="fade">
      <div
        v-if="exportMessage"
        class="mt-4 p-3 rounded-lg flex items-center gap-2"
        :class="exportSuccess ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'"
      >
        <svg v-if="exportSuccess" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ exportMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// Switch to WebSocket for real-time data
const { assets } = useWebSocketCrypto()
// candleData not available in WebSocket (only for historical charts)
const candleData = ref([])
const { exportCandleDataToCSV, exportAssetsToJSON } = useDataExport()

const isExporting = ref(false)
const exportMessage = ref('')
const exportSuccess = ref(false)

const showMessage = (message: string, success: boolean = true) => {
  exportMessage.value = message
  exportSuccess.value = success
  
  setTimeout(() => {
    exportMessage.value = ''
  }, 3000)
}

const handleExportCSV = async () => {
  if (candleData.value.length === 0) {
    showMessage('No data available to export', false)
    return
  }

  isExporting.value = true
  
  try {
    const success = exportCandleDataToCSV(candleData.value)
    if (success) {
      showMessage(`✓ Successfully exported ${candleData.value.length} data points to CSV`)
    } else {
      showMessage('Failed to export CSV', false)
    }
  } catch (error) {
    showMessage('Error exporting CSV', false)
  } finally {
    isExporting.value = false
  }
}

const handleExportJSON = async () => {
  if (assets.value.length === 0) {
    showMessage('No assets available to export', false)
    return
  }

  isExporting.value = true
  
  try {
    const success = exportAssetsToJSON(assets.value)
    if (success) {
      showMessage(`✓ Successfully exported ${assets.value.length} assets to JSON`)
    } else {
      showMessage('Failed to export JSON', false)
    }
  } catch (error) {
    showMessage('Error exporting JSON', false)
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
