# 🚀 Quick Deploy Guide - Vercel

## Cara Tercepat Deploy (3 Langkah!)

### 1️⃣ Push ke GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ Import di Vercel

1. Buka: https://vercel.com/new
2. Login dengan GitHub
3. Klik **Import** pada repository `crypto-datastream`
4. Klik **Deploy**

### 3️⃣ Done! 🎉

Aplikasi Anda akan live di: `https://crypto-datastream.vercel.app`

---

## 🔧 Konfigurasi (Required)

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

```
NUXT_PUBLIC_CRYPTO_API_PROVIDER=coingecko
NUXT_PUBLIC_COINGECKO_API_KEY_1=your_key_1
NUXT_PUBLIC_COINGECKO_API_KEY_2=your_key_2
NUXT_PUBLIC_COINGECKO_API_KEY_3=your_key_3
```

📖 Lihat [COINGECKO_SETUP.md](./COINGECKO_SETUP.md) untuk panduan mendapatkan API keys.

### Custom Domain
Settings → Domains → Add Domain

---

## 📱 Deploy via CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔄 Auto Deploy

✅ Setiap push ke `main` branch = auto deploy!

```bash
git add .
git commit -m "Update"
git push
```

---

## 💡 Tips

- ✅ **Free tier Vercel:** Unlimited deploys
- ✅ **SSL:** Otomatis HTTPS
- ✅ **CDN:** Global edge network
- ✅ **Preview:** Setiap PR dapat preview URL

---

**Dokumentasi lengkap:** `README-DEPLOY.md`
