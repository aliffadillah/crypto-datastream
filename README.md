# 🚀 Crypto DataStream

Real-time cryptocurrency market data dashboard with live streaming and historical data analysis.

## ✨ Features

### 📊 Live Data Stream
- Real-time price updates every 5 seconds
- Support for multiple cryptocurrencies (BTC, ETH, SOL, XRP)
- Live market statistics and trend indicators
- Auto-refresh functionality
- Export live stream data to CSV

### 📈 Historical Data Analysis
- **Date Range Picker** - Select custom date ranges for historical data
- **Multiple Intervals** - Support for 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w intervals
- **Quick Presets** - Last 1 hour, 6 hours, 24 hours, 7 days, 30 days
- **Interactive Charts** - Candlestick, Line, and Area chart types
- **Data Export** - Export historical data to CSV with full OHLCV data
- **Statistics Summary** - Highest, lowest, average price and total change
- **Advanced Filtering** - Zoom, pan, and analyze specific time periods

### 🎨 UI/UX Features
- Dark mode optimized design
- Responsive layout for all devices
- Real-time price flash animations
- Tab-based navigation (Live Stream / Historical Data)
- Loading states and error handling
- Mini sparkline charts
- Color-coded price movements

## 🛠️ Tech Stack

- **Framework**: Nuxt 3
- **UI**: TailwindCSS
- **Charts**: ApexCharts
- **State Management**: Pinia
- **API**: Binance Public API
- **Language**: TypeScript

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🛡️ ISP Blocking Solution (Indonesia)

**Masalah:** Binance API diblokir oleh ISP di Indonesia

**Solusi:** Proyek ini sudah dilengkapi dengan **automatic fallback strategy**:

### Quick Setup (3 options):

**1. SSH Tunnel (Recommended untuk Development):**
```powershell
# Terminal 1: Buat tunnel
ssh -D 1080 -C -N user@your-server.com

# Terminal 2: Run dengan proxy
$env:USE_PROXY="true"; $env:HTTPS_PROXY="socks5://127.0.0.1:1080"; npm run dev
```

**2. Deploy ke Cloud (Recommended untuk Production):**
```bash
# Deploy ke Vercel (GRATIS & AUTO WORKS)
npm i -g vercel
vercel
```

**3. Premium Proxy (Stable):**
```bash
# Edit .env
USE_PROXY=true
HTTPS_PROXY=http://user:pass@proxy.smartproxy.com:7000
```

📖 **Dokumentasi Lengkap:**
- **QUICK_PROXY_SETUP.md** - Setup cepat 3 menit
- **PROXY_SETUP_GUIDE.md** - Panduan lengkap semua opsi

### Features:
- ✅ Auto-detect proxy dari environment
- ✅ Fallback ke alternative endpoints
- ✅ Support SOCKS5, HTTP, HTTPS proxy
- ✅ Multiple retry strategies
- ✅ Detailed logging untuk debugging

## 🌐 API Integration

This application uses **Binance Public API** (no API key required):
- `/api/v3/ticker/24hr` - 24-hour ticker price change statistics
- `/api/v3/klines` - Candlestick/kline data with historical support

### API Features:
- ✅ Real market data from Binance
- ✅ Free to use (no authentication required)
- ✅ Support for historical data with timestamps
- ✅ Multiple interval options
- ✅ Up to 1000 data points per request
- ✅ **ISP blocking bypass** with proxy support
- ✅ **Auto fallback** ke alternative endpoints

## 📱 Pages

### `/` - Dashboard
- Overview of all cryptocurrencies
- Market statistics
- Interactive candlestick chart
- Real-time price updates

### `/stream` - Data Stream
- **Live Stream Tab**: Real-time data streaming with auto-updates
- **Historical Data Tab**: Custom date range analysis with charts and tables

## 🎯 Usage

### Viewing Live Stream
1. Navigate to the Stream page
2. Select a cryptocurrency (BTC, ETH, SOL, or XRP)
3. View real-time data updates in the table
4. Export data using the Export button

### Analyzing Historical Data
1. Navigate to the Stream page
2. Select a cryptocurrency
3. Click on "Historical Data" tab
4. Select date range and interval:
   - Use date pickers for custom range
   - Or click quick preset buttons (Last 1 Hour, 24 Hours, etc.)
5. Click "Load Data" to fetch historical data
6. View data in chart and table format
7. Export data to CSV if needed

### Available Intervals
- `1m` - 1 Minute
- `5m` - 5 Minutes (default)
- `15m` - 15 Minutes
- `30m` - 30 Minutes
- `1h` - 1 Hour
- `4h` - 4 Hours
- `1d` - 1 Day
- `1w` - 1 Week

## 📊 Components

### New Components for Historical Data:
- `DateRangePicker.vue` - Date range selection with quick presets
- `HistoricalChart.vue` - Interactive chart with multiple types
- `HistoricalDataTable.vue` - Paginated table with export functionality

### Existing Components:
- `CandlestickChart.vue` - Main candlestick chart
- `CryptoTickerTable.vue` - Live ticker table
- `ExportPanel.vue` - Data export functionality
- `MiniSparkline.vue` - Small trend indicators
- `StatusWidget.vue` - Status indicators

## 🔧 Composables

- `useCryptoData.ts` - Live market data management
- `useHistoricalData.ts` - Historical data fetching and management
- `useDataExport.ts` - Data export utilities

## 🎨 Styling

The application uses a custom design system with:
- Custom color palette for finance/crypto theme
- Responsive breakpoints
- Animation utilities
- Component-specific styles

## 🚀 Future Enhancements

- [ ] WebSocket integration for true real-time updates
- [ ] More cryptocurrencies support
- [ ] Advanced technical indicators
- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] Multi-chart comparison
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

## 📝 License

MIT License

## 👤 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Nuxt 3 and Binance API