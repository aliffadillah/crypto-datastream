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
- **API**: CoinGecko API
- **Language**: TypeScript

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup API Keys
# 1. Copy .env.example to .env
cp .env.example .env

# 2. Edit .env and add your 3 CoinGecko API keys
# NUXT_PUBLIC_COINGECKO_API_KEY_1=your_api_key_1
# NUXT_PUBLIC_COINGECKO_API_KEY_2=your_api_key_2
# NUXT_PUBLIC_COINGECKO_API_KEY_3=your_api_key_3

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔑 API Configuration

This application uses **CoinGecko API** with API key rotation system:

### Getting API Keys:
1. Register at [CoinGecko API](https://www.coingecko.com/en/api)
2. Get 3 API keys (for rotation to avoid rate limits)
3. Add them to your `.env` file

📖 **Detailed Setup Guide:** See [COINGECKO_SETUP.md](./COINGECKO_SETUP.md) for complete instructions.

### API Features:
- ✅ Real market data from CoinGecko
- ✅ 3 API key rotation system to avoid rate limits
- ✅ Support for historical data (OHLC)
- ✅ Multiple cryptocurrency support (9+ coins)
- ✅ Automatic key switching on rate limit
- ✅ Comprehensive error handling
- ✅ No ISP blocking issues (works in Indonesia)

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

Built with ❤️ using Nuxt 3 and CoinGecko API