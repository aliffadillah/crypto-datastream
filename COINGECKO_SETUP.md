# 🔑 CoinGecko API Setup Guide

Panduan lengkap untuk mengkonfigurasi CoinGecko API dengan sistem 3 API Key rotation.

## 📋 Mengapa 3 API Key?

CoinGecko memiliki rate limit untuk setiap API key. Dengan menggunakan 3 API key berbeda, aplikasi ini:
- ✅ Menghindari rate limit dengan rotasi key otomatis
- ✅ Meningkatkan availability (jika 1 key limit, gunakan key lain)
- ✅ Mendapatkan lebih banyak request per menit
- ✅ Lebih stabil untuk production

## 🚀 Quick Setup (5 Menit)

### Step 1: Registrasi CoinGecko API

1. Kunjungi [CoinGecko API](https://www.coingecko.com/en/api)
2. Klik **"Get Your API Key"**
3. Daftar dengan email Anda (atau gunakan akun yang sudah ada)
4. Setelah login, masuk ke [API Dashboard](https://www.coingecko.com/en/developers/dashboard)

### Step 2: Generate 3 API Keys

**Opsi A: Gunakan 3 Akun Berbeda (Recommended)**
1. Buat 3 akun CoinGecko dengan email berbeda
2. Setiap akun akan mendapat 1 API key gratis
3. Copy semua 3 API keys

**Opsi B: Upgrade ke Plan Berbayar**
1. Upgrade ke plan yang support multiple API keys
2. Generate 3 API keys di dashboard

### Step 3: Konfigurasi Environment

1. **Copy file template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit file `.env`:**
   ```bash
   # Ganti dengan API key Anda yang sebenarnya
   NUXT_PUBLIC_COINGECKO_API_KEY_1=CG-xxxxxxxxxxxxxx
   NUXT_PUBLIC_COINGECKO_API_KEY_2=CG-yyyyyyyyyyyyyy
   NUXT_PUBLIC_COINGECKO_API_KEY_3=CG-zzzzzzzzzzzzzz
   ```

3. **Pastikan provider diset ke coingecko:**
   ```bash
   NUXT_PUBLIC_CRYPTO_API_PROVIDER=coingecko
   ```

### Step 4: Test Aplikasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka browser dan akses `http://localhost:3000`. Jika berhasil, Anda akan melihat data cryptocurrency!

## 🔍 Troubleshooting

### Error: "Tidak bisa mendapatkan data karena API Key belum diset"

**Solusi:**
1. Pastikan file `.env` sudah dibuat (bukan `.env.example`)
2. Pastikan minimal 1 API key terisi dengan benar
3. Restart development server (`Ctrl+C` lalu `npm run dev`)

### Error: "API Key Invalid"

**Solusi:**
1. Cek kembali API key Anda di [CoinGecko Dashboard](https://www.coingecko.com/en/developers/dashboard)
2. Pastikan tidak ada spasi atau karakter tambahan saat copy-paste
3. Pastikan API key aktif dan tidak expired

### Error: Rate Limit / 429 Too Many Requests

**Solusi:**
1. Pastikan 3 API key berbeda sudah terkonfigurasi
2. Tunggu beberapa menit sebelum mencoba lagi
3. Sistem akan otomatis rotate ke key lain jika available

### Data Tidak Muncul

**Solusi:**
1. Buka Developer Console (F12) dan cek error
2. Pastikan koneksi internet stabil
3. Cek apakah CoinGecko API sedang down di [Status Page](https://status.coingecko.com/)

## 📊 Rate Limits

### Free Tier (Demo Plan):
- **30 calls/minute** per API key
- Dengan 3 keys: **90 calls/minute** total
- Cukup untuk development dan testing

### Paid Tiers:
- **Analyst Plan**: 500 calls/minute
- **Lite Plan**: 10,000 calls/month
- **Pro Plan**: 50,000 calls/month
- **Enterprise**: Unlimited

## 🔄 Cara Kerja Rotation System

Aplikasi ini menggunakan sistem rotation cerdas:

1. **Request pertama** → Gunakan API Key 1
2. **Request kedua** → Gunakan API Key 2
3. **Request ketiga** → Gunakan API Key 3
4. **Request keempat** → Kembali ke API Key 1

Jika salah satu key error (rate limit/invalid):
- Key tersebut di-mark sebagai "failed"
- Sistem otomatis skip key tersebut
- Gunakan key lain yang masih available

## 🎯 Best Practices

### Development:
- Minimal gunakan 1-2 API key
- Monitor rate limit di console log
- Gunakan interval refresh yang wajar (30 detik)

### Production:
- **WAJIB** gunakan 3 API key
- Set environment variables di hosting platform (Vercel, Netlify, dll)
- Monitor error logs secara berkala
- Siapkan backup key jika possible

### Security:
- ❌ **JANGAN** commit file `.env` ke Git
- ✅ File `.env` sudah ada di `.gitignore`
- ✅ Gunakan environment variables di hosting
- ✅ Rotate API keys secara berkala (setiap 3-6 bulan)

## 🌐 Deploy ke Production

### Vercel:
```bash
# Set environment variables
vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_1
vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_2
vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_3
vercel env add NUXT_PUBLIC_CRYPTO_API_PROVIDER

# Deploy
vercel --prod
```

### Netlify:
1. Go to Site Settings → Environment Variables
2. Add:
   - `NUXT_PUBLIC_COINGECKO_API_KEY_1`
   - `NUXT_PUBLIC_COINGECKO_API_KEY_2`
   - `NUXT_PUBLIC_COINGECKO_API_KEY_3`
   - `NUXT_PUBLIC_CRYPTO_API_PROVIDER=coingecko`

### Docker:
```bash
docker run -e NUXT_PUBLIC_COINGECKO_API_KEY_1=xxx \
           -e NUXT_PUBLIC_COINGECKO_API_KEY_2=yyy \
           -e NUXT_PUBLIC_COINGECKO_API_KEY_3=zzz \
           -e NUXT_PUBLIC_CRYPTO_API_PROVIDER=coingecko \
           your-app
```

## 📚 Additional Resources

- [CoinGecko API Documentation](https://docs.coingecko.com/reference/introduction)
- [CoinGecko API Status](https://status.coingecko.com/)
- [Rate Limits Info](https://docs.coingecko.com/reference/rate-limits)
- [API Pricing](https://www.coingecko.com/en/api/pricing)

## ❓ FAQ

**Q: Apakah bisa menggunakan hanya 1 API key?**
A: Ya, bisa. Minimal 1 key untuk aplikasi bisa jalan. Namun dengan 3 keys lebih stabil dan avoid rate limit.

**Q: Apakah API key gratis?**
A: Ya, CoinGecko menyediakan free tier dengan 30 calls/minute per key.

**Q: Bagaimana cara mendapat lebih dari 3 keys?**
A: Buat lebih banyak akun atau upgrade ke paid plan yang support multiple keys.

**Q: API key expired?**
A: Free tier API keys tidak expired. Namun bisa di-revoke jika ada abuse. Generate key baru jika perlu.

**Q: Apakah aman menyimpan API key di `.env`?**
A: Ya, selama file `.env` tidak di-commit ke Git dan tidak di-share publicly.

---

📧 **Need Help?** Open an issue di GitHub repository atau hubungi developer.

✅ **Setup Success?** Selamat! Aplikasi crypto datastream Anda siap digunakan! 🚀
