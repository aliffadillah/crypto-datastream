interface CoingeckoConfig {
  baseURL: string
  apiKeys: string[]
  timeout: number
  retry: number
}

interface FetchOptions {
  retry?: number
  timeout?: number
}

interface ApiKeyRotation {
  currentIndex: number
  failedKeys: Set<number>
}

const rotation: ApiKeyRotation = {
  currentIndex: 0,
  failedKeys: new Set()
}

/**
 * Get CoinGecko API keys from environment
 */
function getApiKeys(): string[] {
  const config = useRuntimeConfig()
  const keys = [
    config.public.coingeckoApiKey1,
    config.public.coingeckoApiKey2,
    config.public.coingeckoApiKey3
  ].filter(Boolean) as string[]
  
  return keys
}

/**
 * Get next available API key with rotation
 */
function getNextApiKey(): string | null {
  const keys = getApiKeys()
  
  if (keys.length === 0) {
    return null
  }
  
  // Reset failed keys if all keys have failed
  if (rotation.failedKeys.size >= keys.length) {
    rotation.failedKeys.clear()
  }
  
  // Find next available key
  let attempts = 0
  while (attempts < keys.length) {
    const currentIndex = rotation.currentIndex
    const key = keys[currentIndex]
    
    // Move to next index for next call
    rotation.currentIndex = (rotation.currentIndex + 1) % keys.length
    
    // Return key if not failed
    if (key && !rotation.failedKeys.has(currentIndex)) {
      return key
    }
    
    attempts++
  }
  
  // Return first available key as fallback
  return keys[0] || null
}

/**
 * Mark current API key as failed
 */
function markKeyAsFailed(keyIndex: number): void {
  rotation.failedKeys.add(keyIndex)
  console.warn(`⚠️ API Key ${keyIndex + 1} marked as failed`)
}

/**
 * Fetch data from CoinGecko API dengan rotation API key
 */
export async function fetchCoinGecko<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const { retry = 2, timeout = 10000 } = options
  
  const apiKey = getNextApiKey()
  
  if (!apiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'API Key Not Configured',
      message: 'Tidak bisa mendapatkan data karena API Key belum diset. Silakan konfigurasi API Key CoinGecko di file .env'
    })
  }
  
  const baseURL = 'https://api.coingecko.com/api/v3'
  const url = `${baseURL}${path}`
  
  // Add API key to headers
  const headers: Record<string, string> = {
    'x-cg-demo-api-key': apiKey,
    'Accept': 'application/json'
  }
  
  let lastError: any
  
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      console.log(`🌐 Fetching CoinGecko: ${path} (attempt ${attempt + 1}/${retry + 1})`)
      
      const response = await $fetch<T>(url, {
        headers,
        timeout,
        retry: 0 // Handle retry manually
      })
      
      return response as T
    } catch (error: any) {
      lastError = error
      console.error(`❌ CoinGecko fetch error (attempt ${attempt + 1}):`, error.message)
      
      // If unauthorized, mark key as failed and get new one
      if (error.statusCode === 401 || error.statusCode === 403) {
        const keyIndex = rotation.currentIndex === 0 ? getApiKeys().length - 1 : rotation.currentIndex - 1
        markKeyAsFailed(keyIndex)
        
        throw createError({
          statusCode: 401,
          statusMessage: 'API Key Invalid',
          message: 'API Key tidak valid atau sudah mencapai limit. Silakan cek konfigurasi API Key Anda.'
        })
      }
      
      // Retry on network errors
      if (attempt < retry) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
    }
  }
  
  throw createError({
    statusCode: 500,
    statusMessage: 'CoinGecko API Error',
    message: lastError?.message || 'Tidak dapat terhubung ke server CoinGecko'
  })
}

/**
 * Check if API keys are configured
 */
export function hasApiKeys(): boolean {
  return getApiKeys().length > 0
}

/**
 * Get number of configured API keys
 */
export function getApiKeyCount(): number {
  return getApiKeys().length
}
