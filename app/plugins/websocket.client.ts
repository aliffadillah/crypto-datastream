/**
 * WebSocket Plugin
 * Auto-initializes WebSocket connection on client side
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (typeof window === 'undefined') return

  console.log('🔌 WebSocket plugin loaded')

  // Initialize WebSocket on app mount
  nuxtApp.hook('app:mounted', () => {
    console.log('🚀 App mounted, initializing WebSocket...')
    
    // Small delay to ensure all composables are ready
    setTimeout(() => {
      const { initialize, isLoading } = useWebSocketCrypto()
      if (isLoading.value) {
        console.log('🔄 Triggering WebSocket initialization from plugin...')
        initialize()
      }
    }, 500)
  })
})
