# Panduan Binance API - Datastream Crypto

## Masalah yang Diperbaiki

### 1. Error 400 Bad Request - Symbol Invalid
**Masalah:** API mengirim simbol seperti `bitcoinUSDT` atau `USDTUSDT` yang tidak valid.

**Solusi:** 
- Simbol harus menggunakan format ticker resmi seperti `BTCUSDT`, `ETHUSDT`, bukan nama koin
- `USDTUSDT` tidak valid karena USDT adalah stablecoin, bukan pasangan trading
- Implementasi fungsi `normalizeSymbol()` untuk konversi otomatis

### 2. TLS Security Warning
**Masalah:** Pengaturan `NODE_TLS_REJECT_UNAUTHORIZED = '0'` membuat koneksi tidak aman.

**Solusi:** Dihapus pengaturan tersebut. Koneksi HTTPS sekarang aman dengan verifikasi SSL/TLS aktif.

## Format Simbol yang Valid

### Pasangan Trading yang Didukung
```
BTCUSDT   - Bitcoin to USDT
ETHUSDT   - Ethereum to USDT
SOLUSDT   - Solana to USDT
XRPUSDT   - Ripple to USDT
BNBUSDT   - Binance Coin to USDT
ADAUSDT   - Cardano to USDT
LINKUSDT  - Chainlink to USDT
DOGEUSDT  - Dogecoin to USDT
TRXUSDT   - Tron to USDT
```

### Input yang Diterima (Auto-normalize)
Endpoint API sekarang dapat menerima berbagai format input dan akan otomatis dinormalisasi:

- Nama koin: `bitcoin` → `BTCUSDT`
- Ticker: `BTC` → `BTCUSDT`
- Format slash: `BTC/USD` → `BTCUSDT`
- Sudah lengkap: `BTCUSDT` → `BTCUSDT`

## Contoh Penggunaan ofetch di Nuxt 3

### 1. Fetch Historical Data (Server API)
```typescript
// Di dalam component atau composable
const historicalData = await $fetch('/api/crypto/historical', {
  query: {
    symbol: 'BTCUSDT',  // atau 'bitcoin', 'BTC', 'BTC/USD'
    interval: '5m',      // 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
    limit: 60            // Maksimal 1000
  }
})
```

### 2. Fetch dengan Range Waktu Custom
```typescript
const customData = await $fetch('/api/crypto/historical', {
  query: {
    symbol: 'ETHUSDT',
    interval: '1h',
    limit: 100,
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 hari lalu
    endTime: Date.now()
  }
})
```

### 3. Fetch Market Data
```typescript
const marketData = await $fetch('/api/crypto/market')
// Returns array of CryptoAsset dengan data real-time
```

### 4. Error Handling
```typescript
try {
  const data = await $fetch('/api/crypto/historical', {
    query: { symbol: 'BTCUSDT', interval: '5m', limit: 60 }
  })
  console.log('Data berhasil:', data)
} catch (error) {
  if (error.statusCode === 400) {
    console.error('Format simbol atau parameter tidak valid:', error.message)
  } else {
    console.error('Gagal mengambil data:', error.message)
  }
}
```

## Parameter API

### Historical Data Endpoint: `/api/crypto/historical`

| Parameter | Tipe | Required | Default | Deskripsi |
|-----------|------|----------|---------|-----------|
| symbol | string | No | BTCUSDT | Simbol crypto (auto-normalized) |
| interval | string | No | 5m | Interval candlestick (lihat di bawah) |
| limit | number | No | 60 | Jumlah data (1-1000) |
| startTime | number | No | - | Timestamp mulai (milliseconds) |
| endTime | number | No | - | Timestamp akhir (milliseconds) |

### Valid Intervals
```
1m, 3m, 5m, 15m, 30m   - Minutes
1h, 2h, 4h, 6h, 8h, 12h - Hours
1d, 3d                   - Days
1w                       - Week
1M                       - Month
```

## Keamanan

✅ **Aman:**
- Verifikasi TLS/SSL aktif
- HTTPS dengan sertifikat valid
- Tidak ada bypass security

❌ **Tidak Aman (sudah dihapus):**
- ~~`NODE_TLS_REJECT_UNAUTHORIZED = '0'`~~

## Validasi yang Diterapkan

### 1. Symbol Normalization
```typescript
// Fungsi normalizeSymbol() di historical.get.ts
'bitcoin' → 'BTCUSDT'
'BTC' → 'BTCUSDT'
'btc' → 'BTCUSDT'
'BTCUSDT' → 'BTCUSDT'
```

### 2. Interval Validation
Hanya menerima interval yang didukung Binance API

### 3. Limit Validation
Range: 1-1000 (sesuai batasan Binance)

### 4. Error Handling
- 400: Parameter tidak valid
- 500: Server error atau masalah koneksi

## Testing

### Test dengan berbagai format simbol:
```bash
# Valid
curl "http://localhost:3000/api/crypto/historical?symbol=BTCUSDT&interval=5m&limit=10"
curl "http://localhost:3000/api/crypto/historical?symbol=bitcoin&interval=5m&limit=10"
curl "http://localhost:3000/api/crypto/historical?symbol=BTC&interval=5m&limit=10"

# Invalid (akan error dengan pesan yang jelas)
curl "http://localhost:3000/api/crypto/historical?symbol=INVALIDCOIN&interval=5m&limit=10"
```

## Troubleshooting

### Error: "400 Bad Request"
- Pastikan simbol valid atau bisa dinormalisasi
- Cek interval (harus salah satu dari list valid)
- Cek limit (1-1000)

### Error: "500 Internal Server Error"
- Cek koneksi internet
- Binance API mungkin down (cek status.binance.com)
- Rate limit tercapai (tunggu beberapa saat)

### TLS Warning
- Jika masih muncul, pastikan tidak ada `NODE_TLS_REJECT_UNAUTHORIZED` di kode
- Restart development server setelah perubahan

## Resources

- [Binance API Documentation](https://binance-docs.github.io/apidocs/spot/en/)
- [Nuxt 3 Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
- [ofetch Documentation](https://github.com/unjs/ofetch)
