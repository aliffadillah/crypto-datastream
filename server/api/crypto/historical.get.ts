import { fetchBinance } from '../../utils/binanceClient'

interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type BinanceKline = [number, string, string, string, string, string]

/**
 * Konversi nama koin atau simbol ke format ticker Binance yang valid
 * Contoh: 'bitcoin' -> 'BTCUSDT', 'ethereum' -> 'ETHUSDT', 'BTC' -> 'BTCUSDT'
 */
function normalizeSymbol(input: string): string {
  // Mapping nama koin ke ticker
  const symbolMap: Record<string, string> = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'solana': 'SOL',
    'ripple': 'XRP',
    'xrp': 'XRP',
    'bnb': 'BNB',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'chainlink': 'LINK',
    'dogecoin': 'DOGE',
    'tron': 'TRX',
  }
  
  // Hapus spasi dan ubah ke lowercase untuk pencocokan
  const normalized = input.toLowerCase().trim()
  
  // Jika input adalah nama koin, konversi ke ticker
  if (symbolMap[normalized]) {
    return symbolMap[normalized] + 'USDT'
  }
  
  // Jika sudah format ticker tapi lowercase (misal: 'btc'), uppercase-kan
  const upperInput = input.toUpperCase()
  
  // Jika sudah mengandung USDT, pastikan format benar
  if (upperInput.includes('USDT')) {
    // Hapus USDT kemudian tambahkan lagi untuk normalisasi
    const ticker = upperInput.replace(/USDT/gi, '')
    return ticker + 'USDT'
  }
  
  // Jika hanya ticker (misal: 'BTC'), tambahkan USDT
  if (upperInput.length >= 2 && upperInput.length <= 5 && !upperInput.includes('USDT')) {
    return upperInput + 'USDT'
  }
  
  // Default: kembalikan input yang sudah di-uppercase
  return upperInput
}

export default defineEventHandler(async (event): Promise<CandleData[]> => {
  try {
    const query = getQuery(event)
    const rawSymbol = (query.symbol as string) || 'BTCUSDT'
    
    // Normalisasi simbol agar sesuai format Binance
    const symbol = normalizeSymbol(rawSymbol)
    const interval = (query.interval as string) || '5m'
    const limit = parseInt((query.limit as string) || '60')
    const startTime = query.startTime ? parseInt(query.startTime as string) : undefined
    const endTime = query.endTime ? parseInt(query.endTime as string) : undefined
    
    // Validasi interval yang didukung Binance
    const validIntervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']
    if (!validIntervals.includes(interval)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid interval',
        message: `Interval harus salah satu dari: ${validIntervals.join(', ')}`
      })
    }
    
    // Validasi limit
    if (limit < 1 || limit > 1000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid limit',
        message: 'Limit harus antara 1 dan 1000'
      })
    }
    
    // Build path dengan parameter yang sudah divalidasi
    let path = `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    if (startTime) path += `&startTime=${startTime}`
    if (endTime) path += `&endTime=${endTime}`
    
    console.log(`📊 Fetching historical data: ${path}`)
    
    // Fetch menggunakan fallback strategy untuk bypass ISP blocking
    // Koneksi HTTPS aman dengan support proxy otomatis
    const data = await fetchBinance<BinanceKline[]>(path, {
      retry: 2,
      timeout: 10000,
    })
    
    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error('Binance API returned non-array data:', data)
      throw new Error('Invalid response format from Binance API')
    }
    
    // Validate data structure
    if (data.length === 0) {
      return []
    }
    
    return data.map((candle: BinanceKline): CandleData => ({
      timestamp: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }))
  } catch (error: any) {
    console.error('Error fetching historical data:', error)
    
    // Handle error 400 dengan pesan yang lebih deskriptif
    if (error.statusCode === 400 || error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Request',
        message: `Format simbol atau parameter tidak valid. Pastikan menggunakan format seperti BTCUSDT, ETHUSDT, dll. Error: ${error.message}`
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Terdapat Kesalahan pada API Binance',
      message: error.message || 'Tidak dapat terhubung ke server Binance'
    })
  }
})

/*
 * CONTOH PENGGUNAAN OFETCH DI NUXT 3 (Client-side atau Server-side):
 * 
 * // Import ofetch (opsional, karena $fetch sudah tersedia)
 * import { ofetch } from 'ofetch'
 * 
 * // Contoh fetch data historis dengan simbol yang benar
 * const historicalData = await ofetch('/api/crypto/historical', {
 *   query: {
 *     symbol: 'BTCUSDT',  // Atau 'bitcoin', akan otomatis dinormalisasi
 *     interval: '5m',      // 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
 *     limit: 60            // Maksimal 1000
 *   }
 * })
 * 
 * // Contoh dengan startTime dan endTime
 * const customData = await ofetch('/api/crypto/historical', {
 *   query: {
 *     symbol: 'ETHUSDT',
 *     interval: '1h',
 *     limit: 100,
 *     startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 hari yang lalu
 *     endTime: Date.now()
 *   }
 * })
 * 
 * // Koneksi HTTPS tetap aman tanpa menonaktifkan verifikasi TLS
 */
