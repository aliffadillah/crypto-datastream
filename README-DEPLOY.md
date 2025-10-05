# 🚀 Deploy CryptoStream ke Vercel

## Prasyarat

1. Akun GitHub (untuk push kode)
2. Akun Vercel (gratis di https://vercel.com)

---

## 📝 Langkah-langkah Deploy

### Opsi 1: Deploy via Vercel Dashboard (Recommended)

#### 1. Push kode ke GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Import Project di Vercel

1. Buka https://vercel.com/new
2. Login dengan GitHub account
3. Klik **"Import Git Repository"**
4. Pilih repository `crypto-datastream`
5. Klik **"Import"**

#### 3. Configure Project Settings

Vercel akan otomatis detect Nuxt.js. Pastikan settings berikut:

**Framework Preset:** Nuxt.js  
**Build Command:** `npm run build`  
**Output Directory:** `.output/public`  
**Install Command:** `npm install`

#### 4. Environment Variables (REQUIRED)

Klik **"Environment Variables"** dan tambahkan:

```
NUXT_PUBLIC_CRYPTO_API_PROVIDER=coingecko
NUXT_PUBLIC_COINGECKO_API_KEY_1=your_api_key_1
NUXT_PUBLIC_COINGECKO_API_KEY_2=your_api_key_2
NUXT_PUBLIC_COINGECKO_API_KEY_3=your_api_key_3
```

> **Note:** Anda memerlukan 3 CoinGecko API keys. Lihat [COINGECKO_SETUP.md](./COINGECKO_SETUP.md) untuk panduan.

#### 5. Deploy

Klik **"Deploy"** dan tunggu proses selesai (2-3 menit).

---

### Opsi 2: Deploy via Vercel CLI

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login ke Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
# Deploy ke preview
vercel

# Deploy ke production
vercel --prod
```

---

## 🔧 Konfigurasi Environment Variables di Vercel

### Via Dashboard:

1. Buka project di Vercel Dashboard
2. Klik **Settings** → **Environment Variables**
3. Tambahkan variables berikut:

| Key | Value | Environment |
|-----|-------|-------------|
| `NUXT_PUBLIC_CRYPTO_API_PROVIDER` | `coingecko` | Production, Preview, Development |
| `NUXT_PUBLIC_COINGECKO_API_KEY_1` | `your_key_1` | Production, Preview, Development |
| `NUXT_PUBLIC_COINGECKO_API_KEY_2` | `your_key_2` | Production, Preview, Development |
| `NUXT_PUBLIC_COINGECKO_API_KEY_3` | `your_key_3` | Production, Preview, Development |

### Via CLI:

```bash
vercel env add NUXT_PUBLIC_CRYPTO_API_PROVIDER production
# Enter value: coingecko

vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_1 production
# Enter value: your_key_1

vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_2 production
# Enter value: your_key_2

vercel env add NUXT_PUBLIC_COINGECKO_API_KEY_3 production
# Enter value: your_key_3
```

---

## 🌐 Custom Domain (Optional)

### 1. Tambah Domain di Vercel

1. Buka **Settings** → **Domains**
2. Klik **"Add"**
3. Masukkan domain Anda (contoh: `cryptostream.yourdomain.com`)

### 2. Update DNS Settings

Di DNS provider Anda, tambahkan:

**Type:** CNAME  
**Name:** `cryptostream` (atau `@` untuk root domain)  
**Value:** `cname.vercel-dns.com`

### 3. Verify

Tunggu propagasi DNS (5-60 menit), kemudian verify di Vercel Dashboard.

---

## 🔄 Auto Deploy

Setiap push ke branch `main` akan otomatis trigger deployment baru.

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan:
1. ✅ Build project
2. ✅ Run tests (jika ada)
3. ✅ Deploy ke production
4. ✅ Kirim notifikasi

---

## 🐛 Troubleshooting

### Error: Build Failed

**Solusi:**
1. Pastikan `package.json` memiliki `engines` yang benar:
```json
"engines": {
  "node": ">=20.19.0",
  "npm": ">=10.0.0"
}
```

2. Clear cache dan rebuild:
```bash
vercel --force
```

### Error: API Key Not Configured

Jika muncul error "Tidak bisa mendapatkan data karena API Key belum diset":

1. **Pastikan Environment Variables sudah diset** di Vercel Dashboard
2. **Redeploy** setelah menambahkan environment variables
3. **Verify** API keys valid di [CoinGecko Dashboard](https://www.coingecko.com/en/developers/dashboard)

### Error: 500 Internal Server Error

1. Check logs di Vercel Dashboard → **Deployments** → klik deployment → **Logs**
2. Periksa server-side API calls di `server/api/`

---

## 📊 Monitoring

### 1. Analytics (Gratis di Vercel)

- Buka **Analytics** di Vercel Dashboard
- Monitor page views, performance, dan user engagement

### 2. Real-time Logs

```bash
vercel logs [deployment-url]
```

### 3. Performance Insights

Vercel otomatis memberikan:
- ⚡ Core Web Vitals
- 🚀 Load Time
- 📱 Mobile Performance Score

---

## 💡 Tips Optimasi

### 1. Enable Edge Caching

Tambahkan headers di `nuxt.config.ts`:

```typescript
routeRules: {
  '/api/**': { cache: { maxAge: 60 } }, // Cache 60 detik
}
```

### 2. Optimize Images

Gunakan Nuxt Image module:

```bash
npm install @nuxt/image
```

### 3. Enable Gzip Compression

Vercel sudah otomatis enable compression untuk assets.

---

## 🎉 Selesai!

Project Anda sekarang live di:
- **Production:** `https://your-project.vercel.app`
- **Custom Domain:** `https://cryptostream.yourdomain.com` (jika sudah setup)

### Preview Deployments

Setiap PR akan dapat preview URL otomatis:
- `https://crypto-datastream-[hash].vercel.app`

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Happy Deploying! 🚀**
