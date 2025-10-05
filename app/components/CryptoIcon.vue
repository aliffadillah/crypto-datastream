<template>
  <div class="crypto-icon w-full h-full">
    <img 
      :src="iconPath" 
      :alt="symbol"
      class="w-full h-full object-contain rounded-full"
      @error="handleImageError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  symbol: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const imageError = ref(false)

const iconPath = computed(() => {
  if (imageError.value) {
    return '/favicon.ico' // Fallback icon
  }

  const symbol = props.symbol?.split('/')[0]?.toUpperCase() || ''
  
  const iconMap = {
    'BTC': '/bitcoin.png',
    'ETH': '/ethereum.png',
    'SOL': '/solana.png',
    'XRP': '/xrp.png',
    'BNB': '/bnb.png',
    'ADA': '/cardano.png',
    'LINK': '/chainlink.png',
    'DOGE': '/dogecoin.png',
    'USDT': '/tether.png',
    'TRX': '/tron.png',
    'USD': '/usd.png'
  } as const
  
  return iconMap[symbol as keyof typeof iconMap] || '/favicon.ico'
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.crypto-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.crypto-icon img {
  transition: transform 0.2s ease;
}

.crypto-icon:hover img {
  transform: scale(1.05);
}
</style>
