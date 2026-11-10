import { StockProfile, StockDataPoint, StockTimeframe } from '../types';

export const STOCK_PROFILES: StockProfile[] = [
  {
    ticker: 'BBCA',
    name: 'PT Bank Central Asia Tbk',
    exchange: 'IDX',
    sector: 'Perbankan',
    currency: 'IDR',
    currentPrice: 10450,
    changePrice: 175,
    changePercent: 1.70,
    previousClose: 10275,
    dayOpen: 10300,
    dayHigh: 10500,
    dayLow: 10275,
    volume24h: 78450200,
    marketCap: 1288, // Triliun IDR
    peRatio: 23.4,
    pbvRatio: 4.8,
    dividendYield: 2.8,
    roe: 21.2,
    week52High: 10900,
    week52Low: 8700,
    consensusTarget: 11500,
    analystRating: 'Sangat Beli',
    analystScore: 4.8,
    supportLevels: [10200, 9950],
    resistanceLevels: [10650, 11000],
    description: 'Bank swasta terbesar di Indonesia dengan CASA (dana murah) terkuat, profitabilitas tertinggi, dan rasio NPL terendah di industrinya.',
    summaryReason: 'Kinerja laba bersih rekor berturut-turut, pertumbuhan kredit korporasi & konsumer stabil di atas 14%, serta rasio dividen royal.',
    lotSize: 100
  },
  {
    ticker: 'BBRI',
    name: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    exchange: 'IDX',
    sector: 'Perbankan',
    currency: 'IDR',
    currentPrice: 4890,
    changePrice: -40,
    changePercent: -0.81,
    previousClose: 4930,
    dayOpen: 4920,
    dayHigh: 4960,
    dayLow: 4850,
    volume24h: 112400500,
    marketCap: 741,
    peRatio: 12.1,
    pbvRatio: 2.3,
    dividendYield: 6.4,
    roe: 19.8,
    week52High: 6350,
    week52Low: 4620,
    consensusTarget: 5600,
    analystRating: 'Beli',
    analystScore: 4.3,
    supportLevels: [4750, 4600],
    resistanceLevels: [5150, 5400],
    description: 'Bank spesialis kredit mikro dan UMKM terbesar di dunia dengan jaringan unit cabang dan agen BRILink terluas di seluruh pelosok nusantara.',
    summaryReason: 'Valuasi terdiskon mendekati batas bawah PBV 5 tahun, dividen yield 6%+ yang sangat atraktif bagi investor dividen.',
    lotSize: 100
  },
  {
    ticker: 'BMRI',
    name: 'PT Bank Mandiri (Persero) Tbk',
    exchange: 'IDX',
    sector: 'Perbankan',
    currency: 'IDR',
    currentPrice: 6950,
    changePrice: 125,
    changePercent: 1.83,
    previousClose: 6825,
    dayOpen: 6850,
    dayHigh: 7000,
    dayLow: 6825,
    volume24h: 64120000,
    marketCap: 648,
    peRatio: 11.5,
    pbvRatio: 2.2,
    dividendYield: 5.2,
    roe: 20.4,
    week52High: 7450,
    week52Low: 5600,
    consensusTarget: 7800,
    analystRating: 'Sangat Beli',
    analystScore: 4.7,
    supportLevels: [6750, 6500],
    resistanceLevels: [7200, 7500],
    description: 'Bank aset terbesar di Indonesia dengan transformasi digital Livin & Kopra yang mendominasi transaksi ritel dan wholesale.',
    summaryReason: 'Pertumbuhan laba konsisten double digit, ekspansi margin bunga bersih (NIM) prima didorong penetrasi aplikasi digital.',
    lotSize: 100
  },
  {
    ticker: 'TLKM',
    name: 'PT Telkom Indonesia (Persero) Tbk',
    exchange: 'IDX',
    sector: 'Telekomunikasi',
    currency: 'IDR',
    currentPrice: 2980,
    changePrice: 30,
    changePercent: 1.02,
    previousClose: 2950,
    dayOpen: 2960,
    dayHigh: 3010,
    dayLow: 2940,
    volume24h: 89300000,
    marketCap: 295,
    peRatio: 12.8,
    pbvRatio: 2.1,
    dividendYield: 5.8,
    roe: 17.5,
    week52High: 3950,
    week52Low: 2680,
    consensusTarget: 3450,
    analystRating: 'Beli',
    analystScore: 4.2,
    supportLevels: [2850, 2700],
    resistanceLevels: [3150, 3350],
    description: 'Raksasa infrastruktur telekomunikasi digital, penyedia fiber optic IndiHome, dan pemilik jaringan seluler Telkomsel.',
    summaryReason: 'Katalis monetisasi bisnis Data Center Hyperscale dan pemulihan ARPU (Average Revenue per User) seluler pasca integrasi.',
    lotSize: 100
  },
  {
    ticker: 'ASII',
    name: 'PT Astra International Tbk',
    exchange: 'IDX',
    sector: 'Konglomerasi',
    currency: 'IDR',
    currentPrice: 5125,
    changePrice: 75,
    changePercent: 1.49,
    previousClose: 5050,
    dayOpen: 5075,
    dayHigh: 5175,
    dayLow: 5050,
    volume24h: 41250000,
    marketCap: 207,
    peRatio: 6.8,
    pbvRatio: 1.0,
    dividendYield: 8.5,
    roe: 16.2,
    week52High: 5800,
    week52Low: 4300,
    consensusTarget: 5900,
    analystRating: 'Beli',
    analystScore: 4.1,
    supportLevels: [4950, 4800],
    resistanceLevels: [5350, 5600],
    description: 'Konglomerasi terbesar Indonesia dengan diversifikasi lini otomotif (Toyota, Daihatsu, Honda), alat berat UNTR, agribisnis, dan finansial.',
    summaryReason: 'Valuasi P/E 6.8x sangat murah dan dividen jumbo historis >8%, dengan resiliensi diversifikasi pendapatan non-otomotif.',
    lotSize: 100
  },
  {
    ticker: 'GOTO',
    name: 'PT GoTo Gojek Tokopedia Tbk',
    exchange: 'IDX',
    sector: 'Teknologi',
    currency: 'IDR',
    currentPrice: 68,
    changePrice: -2,
    changePercent: -2.86,
    previousClose: 70,
    dayOpen: 70,
    dayHigh: 71,
    dayLow: 67,
    volume24h: 840500000,
    marketCap: 81,
    peRatio: -14.2,
    pbvRatio: 1.8,
    dividendYield: 0,
    roe: -8.5,
    week52High: 96,
    week52Low: 50,
    consensusTarget: 85,
    analystRating: 'Netral',
    analystScore: 3.4,
    supportLevels: [62, 54],
    resistanceLevels: [76, 88],
    description: 'Ekosistem digital terpadu on-demand service (Gojek) dan financial technology (GoTo Financial/GoPay) terkemuka di Asia Tenggara.',
    summaryReason: 'EBITDA disesuaikan mendekati profitabilitas berkelanjutan, kemitraan strategis e-commerce dengan TikTok Shop mengamankan fee rutin.',
    lotSize: 100
  },
  {
    ticker: 'BREN',
    name: 'PT Barito Renewables Energy Tbk',
    exchange: 'IDX',
    sector: 'Energi & Tambang',
    currency: 'IDR',
    currentPrice: 7425,
    changePrice: 225,
    changePercent: 3.12,
    previousClose: 7200,
    dayOpen: 7225,
    dayHigh: 7550,
    dayLow: 7175,
    volume24h: 38200000,
    marketCap: 993,
    peRatio: 145.0,
    pbvRatio: 92.5,
    dividendYield: 0.5,
    roe: 62.4,
    week52High: 12100,
    week52Low: 4500,
    consensusTarget: 8200,
    analystRating: 'Netral',
    analystScore: 3.3,
    supportLevels: [6800, 6200],
    resistanceLevels: [7900, 8600],
    description: 'Produsen energi baru terbarukan panas bumi (geotermal) terbesar di Indonesia melalui aset Star Energy Geothermal.',
    summaryReason: 'Kapasitas pembangkit hijau berskala global, didukung kontrak jangka panjang USD dengan PLN yang menjamin arus kas defensif.',
    lotSize: 100
  },
  {
    ticker: 'AMMN',
    name: 'PT Amman Mineral Internasional Tbk',
    exchange: 'IDX',
    sector: 'Energi & Tambang',
    currency: 'IDR',
    currentPrice: 8850,
    changePrice: 150,
    changePercent: 1.72,
    previousClose: 8700,
    dayOpen: 8750,
    dayHigh: 8950,
    dayLow: 8675,
    volume24h: 31200000,
    marketCap: 641,
    peRatio: 26.5,
    pbvRatio: 9.8,
    dividendYield: 0.8,
    roe: 28.5,
    week52High: 14550,
    week52Low: 7100,
    consensusTarget: 10200,
    analystRating: 'Beli',
    analystScore: 4.4,
    supportLevels: [8400, 7900],
    resistanceLevels: [9400, 10100],
    description: 'Operator tambang tembaga dan emas Batu Hijau di Sumbawa serta proyek ekspansi smelter dan eksplorasi deposit raksasa Elang.',
    summaryReason: 'Penyelesaian fasilitas smelter tembaga domestik membuka kembali kuota ekspor konsentrat dengan harga tembaga global yang kuat.',
    lotSize: 100
  },
  {
    ticker: 'ICBP',
    name: 'PT Indofood CBP Sukses Makmur Tbk',
    exchange: 'IDX',
    sector: 'Consumer Goods',
    currency: 'IDR',
    currentPrice: 11800,
    changePrice: 100,
    changePercent: 0.85,
    previousClose: 11700,
    dayOpen: 11750,
    dayHigh: 11950,
    dayLow: 11700,
    volume24h: 12800000,
    marketCap: 137,
    peRatio: 14.5,
    pbvRatio: 2.7,
    dividendYield: 3.4,
    roe: 21.0,
    week52High: 12600,
    week52Low: 10100,
    consensusTarget: 13200,
    analystRating: 'Sangat Beli',
    analystScore: 4.6,
    supportLevels: [11400, 11000],
    resistanceLevels: [12200, 12700],
    description: 'Produsen mi instan ikonik Indomie, dairy, biskuit, dan makanan ringan dengan jaringan distribusi mendunia di Afrika dan Timur Tengah.',
    summaryReason: 'Kekuatan pricing power merek Indomie di pasar domestik & global, beban bunga utang valas Pinehill mulai melandai.',
    lotSize: 100
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Global Tech',
    currency: 'USD',
    currentPrice: 134.80,
    changePrice: 3.45,
    changePercent: 2.63,
    previousClose: 131.35,
    dayOpen: 132.10,
    dayHigh: 136.20,
    dayLow: 131.80,
    volume24h: 68400000,
    marketCap: 3310, // Miliar USD
    peRatio: 46.2,
    pbvRatio: 38.5,
    dividendYield: 0.1,
    roe: 92.0,
    week52High: 140.76,
    week52Low: 45.20,
    consensusTarget: 155.00,
    analystRating: 'Sangat Beli',
    analystScore: 4.9,
    supportLevels: [126.0, 118.0],
    resistanceLevels: [141.0, 155.0],
    description: 'Pemimpin global akselerator GPU AI, arsitektur Blackwell, dan ekosistem software CUDA yang menjadi tulang punggung AI komputasi awan.',
    summaryReason: 'Permintaan chip AI dari hyperscalers (Microsoft, Meta, Google, Amazon) melampaui pasokan hingga beberapa kuartal ke depan.',
    lotSize: 1
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Global Tech',
    currency: 'USD',
    currentPrice: 228.50,
    changePrice: -1.20,
    changePercent: -0.52,
    previousClose: 229.70,
    dayOpen: 229.00,
    dayHigh: 231.40,
    dayLow: 227.60,
    volume24h: 44200000,
    marketCap: 3480,
    peRatio: 34.1,
    pbvRatio: 48.0,
    dividendYield: 0.5,
    roe: 145.0,
    week52High: 237.23,
    week52Low: 164.08,
    consensusTarget: 250.00,
    analystRating: 'Beli',
    analystScore: 4.4,
    supportLevels: [220.0, 212.0],
    resistanceLevels: [235.0, 245.0],
    description: 'Raksasa teknologi konsumen produsen iPhone, Mac, iPad, wearables, dan ekosistem layanan berulang (Services) dengan 2,2 miliar perangkat aktif.',
    summaryReason: 'Siklus upgrade Apple Intelligence memicu permintaan pembaruan smartphone, margin layanan Services terus bertumbuh.',
    lotSize: 1
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Global Tech',
    currency: 'USD',
    currentPrice: 422.30,
    changePrice: 4.10,
    changePercent: 0.98,
    previousClose: 418.20,
    dayOpen: 419.50,
    dayHigh: 424.80,
    dayLow: 418.90,
    volume24h: 21500000,
    marketCap: 3140,
    peRatio: 33.8,
    pbvRatio: 11.2,
    dividendYield: 0.8,
    roe: 38.6,
    week52High: 468.35,
    week52Low: 366.50,
    consensusTarget: 490.00,
    analystRating: 'Sangat Beli',
    analystScore: 4.8,
    supportLevels: [410.0, 398.0],
    resistanceLevels: [438.0, 455.0],
    description: 'Penyedia komputasi awan Azure, software produktivitas Microsoft 365, Copilot AI, dan pemilik platform GitHub serta LinkedIn.',
    summaryReason: 'Monetisasi Copilot enterprise meluas, pertumbuhan komputasi awan Azure di atas 30% didorong adopsi AI generatif.',
    lotSize: 1
  }
];

// Helper to format currency
export function formatStockPrice(val: number, currency: 'IDR' | 'USD'): string {
  if (currency === 'IDR') {
    return `Rp ${val.toLocaleString('id-ID')}`;
  }
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatStockChange(price: number, change: number, percent: number, currency: 'IDR' | 'USD'): {
  diffText: string;
  percentText: string;
  isPositive: boolean;
  isNeutral: boolean;
} {
  const isPositive = percent > 0;
  const isNeutral = percent === 0;
  const prefix = isPositive ? '+' : '';
  const diffVal = currency === 'IDR' 
    ? `${prefix}Rp ${Math.abs(change).toLocaleString('id-ID')}` 
    : `${prefix}$${Math.abs(change).toFixed(2)}`;
  
  return {
    diffText: diffVal,
    percentText: `${prefix}${percent.toFixed(2)}%`,
    isPositive,
    isNeutral
  };
}

export function formatLargeNumber(val: number, currency: 'IDR' | 'USD'): string {
  if (currency === 'IDR') {
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(2)} Ribu Triliun`;
    return `Rp ${val.toLocaleString('id-ID')} Triliun`;
  }
  if (val >= 1000) return `$${(val / 1000).toFixed(2)} Trillion`;
  return `$${val.toLocaleString('en-US')} Billion`;
}

export function formatVolume(val: number, currency: 'IDR' | 'USD'): string {
  if (currency === 'IDR') {
    const lots = Math.round(val / 100);
    if (lots >= 1000000) return `${(lots / 1000000).toFixed(2)} Juta Lot`;
    if (lots >= 1000) return `${(lots / 1000).toFixed(1)} Rb Lot`;
    return `${lots} Lot`;
  }
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M Lembar`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K Lembar`;
  return `${val} Lembar`;
}

// Generate deterministic historical data for consistent technical analysis
export function generateStockHistory(stock: StockProfile, timeframe: StockTimeframe): StockDataPoint[] {
  let count = 30;
  let intervalDays = 1;

  switch (timeframe) {
    case '1D':
      count = 28; // Every 15 mins during trading day
      intervalDays = 0.03;
      break;
    case '1W':
      count = 20; // 4 data points per day for 5 trading days
      intervalDays = 0.35;
      break;
    case '1M':
      count = 30; // daily
      intervalDays = 1;
      break;
    case '3M':
      count = 45; // ~2 days interval
      intervalDays = 2;
      break;
    case '1Y':
      count = 60; // weekly-ish
      intervalDays = 6;
      break;
    case 'ALL':
      count = 75; // monthly
      intervalDays = 24;
      break;
  }

  const basePrice = stock.currentPrice;
  const isIdr = stock.currency === 'IDR';
  const volatility = isIdr ? 0.015 : 0.02;

  // We walk backwards from today or walk forwards to today so that the final point matches stock.currentPrice
  const rawPoints: { date: Date; displayDate: string; close: number; open: number; high: number; low: number; volume: number }[] = [];
  const today = new Date();

  // Seed with pseudo-random walk anchored to currentPrice
  // Build prices backwards from today
  const prices: number[] = [basePrice];
  const dates: Date[] = [new Date(today)];

  // Seed based on ticker characters to make it deterministic yet distinct per ticker
  let seed = stock.ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 12345);
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 1; i < count; i++) {
    const prevPrice = prices[i - 1];
    // Trend bias towards earlier price based on 52w low/high
    const rand = pseudoRandom() - 0.48; // slight upward drift
    const priceChange = prevPrice * (rand * volatility * Math.sqrt(intervalDays));
    let nextPrice = prevPrice - priceChange;
    
    // Bounds check
    const minBound = stock.week52Low * 0.95;
    const maxBound = stock.week52High * 1.05;
    if (nextPrice < minBound) nextPrice = minBound + (prevPrice - minBound) * 0.5;
    if (nextPrice > maxBound) nextPrice = maxBound - (maxBound - prevPrice) * 0.5;

    prices.push(Math.round(nextPrice * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100));

    const pointDate = new Date(today.getTime() - i * intervalDays * 24 * 60 * 60 * 1000);
    dates.push(pointDate);
  }

  // Reverse so points go from oldest to newest (today)
  prices.reverse();
  dates.reverse();

  // Create OHLCV points
  for (let i = 0; i < count; i++) {
    const c = prices[i];
    const prevC = i > 0 ? prices[i - 1] : c * (1 - (pseudoRandom() - 0.5) * 0.01);
    const o = prevC;
    const intradayRange = Math.abs(c * volatility * (pseudoRandom() * 0.8 + 0.3));
    const h = Math.max(o, c) + intradayRange * pseudoRandom();
    const l = Math.min(o, c) - intradayRange * pseudoRandom();
    
    const baseVol = stock.volume24h / (timeframe === '1D' ? 20 : 1);
    const volVariance = (pseudoRandom() * 0.7 + 0.65);
    const volume = Math.round(baseVol * volVariance);

    const d = dates[i];
    let displayDate = '';
    if (timeframe === '1D') {
      displayDate = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W' || timeframe === '1M') {
      displayDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } else {
      displayDate = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    }

    rawPoints.push({
      date: d,
      displayDate,
      open: Math.round(o * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100),
      high: Math.round(h * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100),
      low: Math.round(Math.max(1, l) * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100),
      close: Math.round(c * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100),
      volume
    });
  }

  // Ensure last point close is exact currentPrice
  if (rawPoints.length > 0) {
    rawPoints[rawPoints.length - 1].close = stock.currentPrice;
  }

  // Calculate technical indicators: SMA 20, SMA 50, Bollinger Bands, RSI 14, MACD
  const dataPoints: StockDataPoint[] = [];

  for (let i = 0; i < rawPoints.length; i++) {
    const pt = rawPoints[i];
    
    // SMA 20 (or adaptive for shorter series)
    const smaWindow = Math.min(14, i + 1);
    let sum20 = 0;
    for (let j = Math.max(0, i - smaWindow + 1); j <= i; j++) {
      sum20 += rawPoints[j].close;
    }
    const sma20 = Math.round((sum20 / smaWindow) * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100);

    // SMA 50 (or longer window)
    const sma50Window = Math.min(25, i + 1);
    let sum50 = 0;
    for (let j = Math.max(0, i - sma50Window + 1); j <= i; j++) {
      sum50 += rawPoints[j].close;
    }
    const sma50 = Math.round((sum50 / sma50Window) * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100);

    // Standard Deviation for Bollinger Bands
    let variance = 0;
    for (let j = Math.max(0, i - smaWindow + 1); j <= i; j++) {
      variance += Math.pow(rawPoints[j].close - sma20, 2);
    }
    const stdDev = Math.sqrt(variance / smaWindow);
    const upperBand = Math.round((sma20 + 2 * stdDev) * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100);
    const lowerBand = Math.round(Math.max(1, sma20 - 2 * stdDev) * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100);

    // RSI 14 approximation
    let rsi = 50;
    const rsiWindow = Math.min(14, i);
    if (rsiWindow > 0) {
      let gains = 0;
      let losses = 0;
      for (let j = i - rsiWindow + 1; j <= i; j++) {
        if (j > 0) {
          const diff = rawPoints[j].close - rawPoints[j - 1].close;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
      }
      const avgGain = gains / rsiWindow;
      const avgLoss = losses / rsiWindow;
      if (avgLoss === 0) {
        rsi = 100;
      } else {
        const rs = avgGain / avgLoss;
        rsi = Math.round(100 - (100 / (1 + rs)));
      }
    }

    // MACD approximation
    const fastEma = sma20;
    const slowEma = sma50;
    const macd = Math.round((fastEma - slowEma) * 100) / 100;
    const macdSignal = Math.round((macd * 0.75) * 100) / 100;
    const macdHist = Math.round((macd - macdSignal) * 100) / 100;

    dataPoints.push({
      date: pt.date.toISOString(),
      displayDate: pt.displayDate,
      open: pt.open,
      high: pt.high,
      low: pt.low,
      close: pt.close,
      volume: pt.volume,
      sma20,
      sma50,
      upperBand,
      lowerBand,
      rsi,
      macd,
      macdSignal,
      macdHist
    });
  }

  return dataPoints;
}

// Watchlist local storage helpers
const WATCHLIST_STORAGE_KEY = 'pulsetrack_stock_watchlist';

export function getStoredWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return ['BBCA', 'BBRI', 'NVDA', 'TLKM'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ['BBCA', 'BBRI', 'NVDA', 'TLKM'];
  } catch {
    return ['BBCA', 'BBRI', 'NVDA', 'TLKM'];
  }
}

export function saveStoredWatchlist(tickers: string[]) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(tickers));
  } catch (err) {
    console.error('Failed to save watchlist', err);
  }
}
