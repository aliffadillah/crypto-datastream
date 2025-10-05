// server/utils/proxyConfig.ts
import { HttpsProxyAgent } from 'https-proxy-agent'

/**
 * Konfigurasi Proxy untuk bypass ISP blocking
 * 
 * OPSI PROXY:
 * 1. Public Proxy (gratis tapi tidak stabil)
 * 2. Premium Proxy Service (berbayar, lebih stabil)
 * 3. Cloudflare WARP Proxy
 * 4. VPN/Proxy pribadi
 */

export interface ProxyConfig {
  enabled: boolean
  url?: string
  auth?: {
    username: string
    password: string
  }
}

// Ambil konfigurasi dari environment variables
export function getProxyConfig(): ProxyConfig {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.BINANCE_PROXY
  const proxyEnabled = process.env.USE_PROXY === 'true' || !!proxyUrl
  
  return {
    enabled: proxyEnabled,
    url: proxyUrl,
    auth: process.env.PROXY_USER && process.env.PROXY_PASS 
      ? {
          username: process.env.PROXY_USER,
          password: process.env.PROXY_PASS
        }
      : undefined
  }
}

/**
 * Buat proxy agent untuk fetch requests
 */
export function createProxyAgent(proxyUrl: string): any {
  try {
    // Untuk Node.js dengan https-proxy-agent
    return new HttpsProxyAgent(proxyUrl)
  } catch (error) {
    console.error('Failed to create proxy agent:', error)
    return undefined
  }
}

/**
 * Alternative Binance API endpoints
 * Gunakan mirror atau regional endpoints yang mungkin tidak diblokir
 */
export const BINANCE_ENDPOINTS = {
  primary: 'https://api.binance.com',
  // Binance API endpoints alternatif (beberapa mungkin tidak diblokir)
  alternatives: [
    'https://api1.binance.com',
    'https://api2.binance.com',
    'https://api3.binance.com',
    'https://api4.binance.com',
    // US endpoint (kadang tidak diblokir di Indonesia)
    'https://api.binance.us',
  ],
  // CORS proxy sebagai last resort (untuk development)
  corsProxies: [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
  ]
}

/**
 * Dapatkan endpoint Binance yang akan digunakan
 */
export function getBinanceEndpoint(useAlternative: boolean = false): string {
  if (useAlternative) {
    // Coba gunakan endpoint alternatif
    const alternatives = BINANCE_ENDPOINTS.alternatives
    const randomIndex = Math.floor(Math.random() * alternatives.length)
    return alternatives[randomIndex] || BINANCE_ENDPOINTS.primary
  }
  
  return process.env.BINANCE_API_ENDPOINT || BINANCE_ENDPOINTS.primary
}
