import { 
  StockProfile, 
  StockOrderBook, 
  StockBandarmology, 
  FinancialYearData, 
  StockFinancialRatios, 
  StockValuationModels, 
  StockDividendItem, 
  StockCorporateAction, 
  StockTechnicalSignal, 
  StockPivotPoints, 
  StockNewsItem, 
  StockTradePlan 
} from '../types';

/**
 * Generates an authentic IDX / Global orderbook ladder with bid/offer depths
 */
export function generateOrderBook(price: number, lotSizeMultiplier: number = 1): StockOrderBook {
  const tickSize = price >= 5000 ? 25 : price >= 2000 ? 10 : price >= 500 ? 5 : price >= 200 ? 2 : 1;
  const bids = [];
  const offers = [];

  let totalBidLots = 0;
  let totalOfferLots = 0;

  for (let i = 0; i < 7; i++) {
    const bidPrice = price - i * tickSize;
    const offerPrice = price + (i + 1) * tickSize;

    // Organic variance in lot sizes
    const baseLots = Math.round((Math.sin(i * 1.2) * 0.4 + 1.2) * 12500 * lotSizeMultiplier);
    const bidLots = Math.max(800, Math.round(baseLots * (1 + (i % 3 === 0 ? 0.6 : 0))));
    const offerLots = Math.max(650, Math.round(baseLots * (0.9 + (i % 2 === 0 ? 0.4 : -0.1))));

    const bidOrders = Math.max(12, Math.round(bidLots / 180));
    const offerOrders = Math.max(10, Math.round(offerLots / 195));

    bids.push({ price: bidPrice, lots: bidLots, orders: bidOrders });
    offers.push({ price: offerPrice, lots: offerLots, orders: offerOrders });

    totalBidLots += bidLots;
    totalOfferLots += offerLots;
  }

  const bidPowerPercent = Math.round((totalBidLots / (totalBidLots + totalOfferLots)) * 100);

  return {
    bids,
    offers,
    totalBidLots,
    totalOfferLots,
    bidPowerPercent
  };
}

/**
 * Calculates classical and Fibonacci pivot levels
 */
export function calculatePivotPoints(high: number, low: number, close: number): StockPivotPoints {
  const p = (high + low + close) / 3;
  const range = high - low;

  // Classical Pivots
  const r1 = 2 * p - low;
  const s1 = 2 * p - high;
  const r2 = p + range;
  const s2 = p - range;
  const r3 = high + 2 * (p - low);
  const s3 = low - 2 * (high - p);

  // Fibonacci Pivots
  const fibR1 = p + 0.382 * range;
  const fibR2 = p + 0.618 * range;
  const fibR3 = p + 1.000 * range;
  const fibS1 = p - 0.382 * range;
  const fibS2 = p - 0.618 * range;
  const fibS3 = p - 1.000 * range;

  const round = (v: number) => Math.round(v * 100) / 100;

  return {
    classical: {
      pivot: round(p),
      r1: round(r1),
      r2: round(r2),
      r3: round(r3),
      s1: round(s1),
      s2: round(s2),
      s3: round(s3)
    },
    fibonacci: {
      pivot: round(p),
      r1: round(fibR1),
      r2: round(fibR2),
      r3: round(fibR3),
      s1: round(fibS1),
      s2: round(fibS2),
      s3: round(fibS3)
    }
  };
}

/**
 * Enriches stock profiles with deep analytical models
 */
export const ENRICHED_STOCK_EXTRAS: Record<string, Partial<StockProfile>> = {
  BBCA: {
    orderBook: generateOrderBook(10450, 1.4),
    bandarmology: {
      phase: 'Akumulasi Masif',
      phaseScore: 88,
      whaleParticipationPercent: 68,
      buyerConcentration: 74,
      sellerConcentration: 42,
      netForeignToday: 245.8, // +Rp 245.8 Miliar
      netForeign5D: 890.4,
      netForeign20D: 2410.0,
      foreignOwnershipPercent: 64.2,
      topBuyers: [
        { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing', lots: 142500, avgPrice: 10425, value: 148556 },
        { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing', lots: 98400, avgPrice: 10450, value: 102828 },
        { code: 'CC', name: 'Mandiri Sekuritas', type: 'Domestik', lots: 76200, avgPrice: 10400, value: 79248 },
        { code: 'AK', name: 'UBS Sekuritas', type: 'Asing', lots: 54100, avgPrice: 10450, value: 56534 },
        { code: 'YU', name: 'CGS International', type: 'Asing', lots: 42300, avgPrice: 10475, value: 44309 }
      ],
      topSellers: [
        { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Domestik', lots: 48200, avgPrice: 10425, value: 50248 },
        { code: 'XC', name: 'Ajaib Sekuritas', type: 'Domestik', lots: 39500, avgPrice: 10450, value: 41277 },
        { code: 'NI', name: 'BNI Sekuritas', type: 'Domestik', lots: 31200, avgPrice: 10475, value: 32682 },
        { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Domestik', lots: 29800, avgPrice: 10400, value: 30992 },
        { code: 'XL', name: 'Stockbit Sekuritas', type: 'Domestik', lots: 21400, avgPrice: 10425, value: 22309 }
      ],
      foreignFlowHistory: [
        { date: 'Senin', netForeign: 180.5, price: 10275 },
        { date: 'Selasa', netForeign: 215.2, price: 10325 },
        { date: 'Rabu', netForeign: 140.8, price: 10375 },
        { date: 'Kamis', netForeign: 108.1, price: 10400 },
        { date: 'Jumat (Hari Ini)', netForeign: 245.8, price: 10450 }
      ]
    },
    financialHistory: [
      { year: 2024, period: 'FY 2024 (E)', revenue: 104.2, grossProfit: 86.4, operatingProfit: 62.1, netProfit: 54.8, eps: 445, operatingCashFlow: 58.2, totalAssets: 1420.5, totalDebt: 1145.2, totalEquity: 275.3 },
      { year: 2023, period: 'FY 2023', revenue: 94.6, grossProfit: 78.5, operatingProfit: 55.4, netProfit: 48.6, eps: 395, operatingCashFlow: 52.4, totalAssets: 1358.8, totalDebt: 1102.1, totalEquity: 256.7 },
      { year: 2022, period: 'FY 2022', revenue: 82.3, grossProfit: 68.2, operatingProfit: 46.8, netProfit: 40.7, eps: 331, operatingCashFlow: 44.1, totalAssets: 1314.7, totalDebt: 1076.5, totalEquity: 238.2 },
      { year: 2021, period: 'FY 2021', revenue: 73.8, grossProfit: 60.5, operatingProfit: 36.2, netProfit: 31.4, eps: 255, operatingCashFlow: 37.8, totalAssets: 1228.3, totalDebt: 1012.4, totalEquity: 215.9 }
    ],
    detailedRatios: {
      roe: 21.2,
      roa: 3.9,
      gpm: 82.9,
      opm: 59.6,
      npm: 52.6,
      der: 4.16, // Typical for commercial banks (CAR sehat >28%)
      currentRatio: 1.15,
      quickRatio: 1.15,
      interestCoverage: 14.8,
      peRatio: 23.4,
      pbvRatio: 4.8,
      evEbitda: 18.2,
      pegRatio: 1.62,
      priceToSales: 12.3,
      bvps: 2180,
      piotroskiFScore: 8, // Near perfect financial health
      piotroskiAssessment: 'Kondisi Finansial Prima (Skor 8/9)',
      altmanZScore: 3.85,
      altmanZone: 'Aman (Safe Zone)',
      sectorPeAverage: 14.2,
      sectorPbvAverage: 2.1,
      sectorRoeAverage: 16.5
    },
    valuation: {
      grahamNumber: 4670, // Standard Graham conservative
      dcfFairValue: 11800,
      peBandMean: 10600,
      peBandHigh: 11950,
      peBandLow: 9200,
      pbvBandMean: 10400,
      averageFairValue: 11450,
      marginOfSafetyPercent: 9.5,
      status: 'Fair Value (Wajar)',
      assumptions: {
        growthRate: 11.5,
        discountRate: 8.5,
        terminalRate: 5.0
      }
    },
    dividends: [
      { year: 2024, exDate: '28 Nov 2024', paymentDate: '18 Des 2024', dps: 50, yieldPercent: 0.5, payoutRatio: 24.5 },
      { year: 2024, exDate: '22 Mar 2024', paymentDate: '04 Apr 2024', dps: 220, yieldPercent: 2.3, payoutRatio: 55.7 },
      { year: 2023, exDate: '20 Nov 2023', paymentDate: '12 Des 2023', dps: 42.5, yieldPercent: 0.5, payoutRatio: 21.5 },
      { year: 2023, exDate: '24 Mar 2023', paymentDate: '14 Apr 2023', dps: 170, yieldPercent: 2.0, payoutRatio: 51.4 },
      { year: 2022, exDate: '25 Mar 2022', paymentDate: '19 Apr 2022', dps: 145, yieldPercent: 1.9, payoutRatio: 48.0 }
    ],
    dividendStreakYears: 24,
    corporateActions: [
      { title: 'Pembagian Dividen Interim Tunai TA 2024', type: 'Dividen', date: '18 Des 2024', notes: 'Dividen interim Rp 50/saham telah cair ke RDN', status: 'Selesai' },
      { title: 'Rapat Umum Pemegang Saham Tahunan (RUPST)', type: 'RUPS', date: '14 Mar 2025', notes: 'Agenda penetapan dividen final tahun buku 2024', status: 'Akan Datang' },
      { title: 'Paparan Publik Tahunan (Public Expose)', type: 'Paparan Publik', date: '28 Jan 2025', notes: 'Presentasi capaian kinerja FY24 dan target laba 2025', status: 'Akan Datang' }
    ],
    technicalSignals: [
      { indicator: 'Moving Average (MA 20)', value: '10.350', signal: 'Beli', description: 'Harga bergerak di atas MA 20 (Golden Momentum)' },
      { indicator: 'Moving Average (MA 50)', value: '10.180', signal: 'Beli', description: 'Trend jangka menengah bullish kuat' },
      { indicator: 'Moving Average (MA 200)', value: '9.850', signal: 'Sangat Beli', description: 'Jauh di atas MA 200 konfirmasi tren super bullish' },
      { indicator: 'RSI (14 Hari)', value: '62.4', signal: 'Beli', description: 'Momentum positif, belum memasuki area Overbought (>70)' },
      { indicator: 'MACD (12, 26, 9)', value: '+45.2', signal: 'Beli', description: 'Histogram MACD melebar ke area positif' },
      { indicator: 'Stochastic (14, 3, 3)', value: '71.5', signal: 'Netral', description: 'Mendekati resistance jangka pendek' },
      { indicator: 'Bollinger Bands (20, 2)', value: '10.200 - 10.600', signal: 'Netral', description: 'Berada di kuadran atas saluran Bollinger' }
    ],
    pivotPoints: calculatePivotPoints(10500, 10275, 10450),
    news: [
      {
        id: 'bbca-1',
        title: 'BCA Catatkan Laba Bersih Tumbuh 13,8% Capai Rp 53,2 Triliun',
        source: 'Bisnis Indonesia',
        time: '3 jam yang lalu',
        sentiment: 'Positif',
        snippet: 'Kinerja ditopang peningkatan volume kredit di segmen korporasi dan konsumer yang solid serta biaya dana (CoF) yang terjaga rendah.',
        category: 'Laporan Keuangan'
      },
      {
        id: 'bbca-2',
        title: 'Asing Borong Saham BBCA Rp 245 Miliar di Sesi I',
        source: 'Kontan Market',
        time: '5 jam yang lalu',
        sentiment: 'Positif',
        snippet: 'Saham BBCA kembali menjadi incaran utama investor asing melalui broker BK (JP Morgan) dan ZP (Maybank) seiring optimisme dividen jumbo.',
        category: 'Bandarmologi'
      },
      {
        id: 'bbca-3',
        title: 'Rasio CASA BCA Sentuh Rekor 82,1%, Tertinggi di Sektor Finansial',
        source: 'CNBC Indonesia',
        time: '1 hari yang lalu',
        sentiment: 'Positif',
        snippet: 'Dana murah tabungan dan giro terus mengalir berkat transaksi digital harian yang menembus lebih dari 110 juta transaksi per hari.',
        category: 'Operasional'
      }
    ],
    tradePlan: {
      entryZone: [10300, 10450],
      target1: 10800,
      target2: 11200,
      stopLoss: 10050,
      riskRewardRatio: '1 : 2.8',
      strategyName: 'Trend Following & Swing Accumulation',
      thesis: 'Akumulasi buy on breakout dengan perlindungan stop loss di bawah support MA 50 (10.050).'
    }
  },

  BBRI: {
    orderBook: generateOrderBook(4890, 1.8),
    bandarmology: {
      phase: 'Akumulasi Normal',
      phaseScore: 72,
      whaleParticipationPercent: 62,
      buyerConcentration: 68,
      sellerConcentration: 45,
      netForeignToday: 112.4, // +Rp 112.4 Miliar
      netForeign5D: 380.2,
      netForeign20D: 940.5,
      foreignOwnershipPercent: 28.5,
      topBuyers: [
        { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing', lots: 220000, avgPrice: 4880, value: 107360 },
        { code: 'KZ', name: 'CLSA Sekuritas', type: 'Asing', lots: 185000, avgPrice: 4890, value: 90465 },
        { code: 'CC', name: 'Mandiri Sekuritas', type: 'Domestik', lots: 140000, avgPrice: 4875, value: 68250 },
        { code: 'AK', name: 'UBS Sekuritas', type: 'Asing', lots: 112000, avgPrice: 4900, value: 54880 },
        { code: 'CS', name: 'Credit Suisse / Indo', type: 'Asing', lots: 95000, avgPrice: 4890, value: 46455 }
      ],
      topSellers: [
        { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Domestik', lots: 98000, avgPrice: 4890, value: 47922 },
        { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Domestik', lots: 84000, avgPrice: 4880, value: 40992 },
        { code: 'XC', name: 'Ajaib Sekuritas', type: 'Domestik', lots: 76000, avgPrice: 4900, value: 37240 },
        { code: 'NI', name: 'BNI Sekuritas', type: 'Domestik', lots: 64000, avgPrice: 4885, value: 31264 },
        { code: 'CP', name: 'KB Valbury Sekuritas', type: 'Domestik', lots: 52000, avgPrice: 4870, value: 25324 }
      ],
      foreignFlowHistory: [
        { date: 'Senin', netForeign: -45.2, price: 4930 },
        { date: 'Selasa', netForeign: 65.4, price: 4910 },
        { date: 'Rabu', netForeign: 120.8, price: 4880 },
        { date: 'Kamis', netForeign: 126.8, price: 4860 },
        { date: 'Jumat (Hari Ini)', netForeign: 112.4, price: 4890 }
      ]
    },
    financialHistory: [
      { year: 2024, period: 'FY 2024 (E)', revenue: 198.5, grossProfit: 164.2, operatingProfit: 78.4, netProfit: 60.5, eps: 404, operatingCashFlow: 72.1, totalAssets: 1965.0, totalDebt: 1645.0, totalEquity: 320.0 },
      { year: 2023, period: 'FY 2023', revenue: 182.1, grossProfit: 152.0, operatingProfit: 74.2, netProfit: 60.4, eps: 403, operatingCashFlow: 68.5, totalAssets: 1865.3, totalDebt: 1558.0, totalEquity: 307.3 },
      { year: 2022, period: 'FY 2022', revenue: 160.8, grossProfit: 135.4, operatingProfit: 62.5, netProfit: 51.4, eps: 341, operatingCashFlow: 59.2, totalAssets: 1865.6, totalDebt: 1563.8, totalEquity: 301.8 },
      { year: 2021, period: 'FY 2021', revenue: 145.2, grossProfit: 122.0, operatingProfit: 41.2, netProfit: 32.2, eps: 214, operatingCashFlow: 46.5, totalAssets: 1678.1, totalDebt: 1386.4, totalEquity: 291.7 }
    ],
    detailedRatios: {
      roe: 19.8,
      roa: 3.1,
      gpm: 82.7,
      opm: 39.5,
      npm: 30.5,
      der: 5.14,
      currentRatio: 1.12,
      quickRatio: 1.12,
      interestCoverage: 9.8,
      peRatio: 12.1,
      pbvRatio: 2.3,
      evEbitda: 10.4,
      pegRatio: 1.15,
      priceToSales: 3.7,
      bvps: 2125,
      piotroskiFScore: 7,
      piotroskiAssessment: 'Kondisi Finansial Sehat & Stabil (Skor 7/9)',
      altmanZScore: 3.12,
      altmanZone: 'Aman (Safe Zone)',
      sectorPeAverage: 14.2,
      sectorPbvAverage: 2.1,
      sectorRoeAverage: 16.5
    },
    valuation: {
      grahamNumber: 4390,
      dcfFairValue: 5650,
      peBandMean: 5450,
      peBandHigh: 6200,
      peBandLow: 4700,
      pbvBandMean: 5350,
      averageFairValue: 5500,
      marginOfSafetyPercent: 12.5,
      status: 'Undervalued (Diskon Murah)',
      assumptions: {
        growthRate: 8.5,
        discountRate: 9.0,
        terminalRate: 5.0
      }
    },
    dividends: [
      { year: 2024, exDate: '13 Des 2024', paymentDate: '15 Jan 2025', dps: 84, yieldPercent: 1.7, payoutRatio: 21.0 },
      { year: 2024, exDate: '13 Mar 2024', paymentDate: '28 Mar 2024', dps: 235, yieldPercent: 4.8, payoutRatio: 58.2 },
      { year: 2023, exDate: '29 Des 2023', paymentDate: '18 Jan 2024', dps: 84, yieldPercent: 1.7, payoutRatio: 21.0 },
      { year: 2023, exDate: '21 Mar 2023', paymentDate: '12 Apr 2023', dps: 231, yieldPercent: 4.7, payoutRatio: 57.5 }
    ],
    dividendStreakYears: 20,
    corporateActions: [
      { title: 'Pembagian Dividen Interim Rp 84/Saham', type: 'Dividen', date: '15 Jan 2025', notes: 'Dividen interim per lembar saham dibayarkan tunai', status: 'Akan Datang' },
      { title: 'RUPST Tahun Buku 2024', type: 'RUPS', date: '20 Mar 2025', notes: 'Penetapan dividen final dengan ekspektasi payout ratio 80%', status: 'Akan Datang' }
    ],
    technicalSignals: [
      { indicator: 'Moving Average (MA 20)', value: '4.880', signal: 'Netral', description: 'Harga berkonsolidasi di sekitar garis MA 20' },
      { indicator: 'Moving Average (MA 50)', value: '4.950', signal: 'Netral', description: 'Mencoba menembus resistance MA 50' },
      { indicator: 'Moving Average (MA 200)', value: '5.280', signal: 'Jual', description: 'Masih di bawah MA 200 jangka panjang' },
      { indicator: 'RSI (14 Hari)', value: '48.5', signal: 'Netral', description: 'Kondisi netral, ruang akumulasi terbuka' },
      { indicator: 'MACD (12, 26, 9)', value: '-8.5', signal: 'Beli', description: 'Peluang MACD Golden Cross dari area oversold' },
      { indicator: 'Stochastic (14, 3, 3)', value: '42.0', signal: 'Beli', description: 'Rebound dari area bawah' }
    ],
    pivotPoints: calculatePivotPoints(4960, 4850, 4890),
    news: [
      {
        id: 'bbri-1',
        title: 'Manajemen BRI Targetkan Dividen Payout Ratio 80% untuk Tahun Buku 2024',
        source: 'Bisnis.com',
        time: '2 jam yang lalu',
        sentiment: 'Positif',
        snippet: 'Direksi menegaskan kecukupan modal (CAR) BRI mencapai 26% sehingga memiliki ruang pembagian dividen maksimal kepada pemegang saham.',
        category: 'Dividen'
      },
      {
        id: 'bbri-2',
        title: 'Kredit Kupedes dan Ultra Mikro BRI Tumbuh 11,2% Menopang Margin Bunga',
        source: 'Investor Daily',
        time: '6 jam yang lalu',
        sentiment: 'Positif',
        snippet: 'Kualitas aset kredit mikro membaik dengan rasio NPL gross terkendali di 3,05% diiringi pencadangan coverage yang solid di atas 210%.',
        category: 'Operasional'
      }
    ],
    tradePlan: {
      entryZone: [4800, 4900],
      target1: 5200,
      target2: 5600,
      stopLoss: 4650,
      riskRewardRatio: '1 : 2.9',
      strategyName: 'Value Investing & Dividend Play',
      thesis: 'Beli di area diskon dengan yield dividen >6% dan potensi capital gain ke rata-rata PE historis.'
    }
  },

  BMRI: {
    orderBook: generateOrderBook(6950, 1.2),
    bandarmology: {
      phase: 'Akumulasi Masif',
      phaseScore: 85,
      whaleParticipationPercent: 65,
      buyerConcentration: 72,
      sellerConcentration: 41,
      netForeignToday: 185.2,
      netForeign5D: 640.8,
      netForeign20D: 1850.0,
      foreignOwnershipPercent: 35.8,
      topBuyers: [
        { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing', lots: 110000, avgPrice: 6925, value: 76175 },
        { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing', lots: 85000, avgPrice: 6950, value: 59075 },
        { code: 'CC', name: 'Mandiri Sekuritas', type: 'Domestik', lots: 72000, avgPrice: 6900, value: 49680 },
        { code: 'AK', name: 'UBS Sekuritas', type: 'Asing', lots: 58000, avgPrice: 6950, value: 40310 },
        { code: 'YU', name: 'CGS International', type: 'Asing', lots: 41000, avgPrice: 6975, value: 28597 }
      ],
      topSellers: [
        { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Domestik', lots: 45000, avgPrice: 6950, value: 31275 },
        { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Domestik', lots: 39000, avgPrice: 6925, value: 27007 },
        { code: 'XC', name: 'Ajaib Sekuritas', type: 'Domestik', lots: 34000, avgPrice: 6950, value: 23630 },
        { code: 'NI', name: 'BNI Sekuritas', type: 'Domestik', lots: 28000, avgPrice: 6975, value: 19530 },
        { code: 'CP', name: 'KB Valbury Sekuritas', type: 'Domestik', lots: 21000, avgPrice: 6900, value: 14490 }
      ],
      foreignFlowHistory: [
        { date: 'Senin', netForeign: 110.2, price: 6825 },
        { date: 'Selasa', netForeign: 135.4, price: 6875 },
        { date: 'Rabu', netForeign: 95.8, price: 6900 },
        { date: 'Kamis', netForeign: 114.2, price: 6925 },
        { date: 'Jumat (Hari Ini)', netForeign: 185.2, price: 6950 }
      ]
    },
    financialHistory: [
      { year: 2024, period: 'FY 2024 (E)', revenue: 145.2, grossProfit: 118.0, operatingProfit: 68.5, netProfit: 56.4, eps: 604, operatingCashFlow: 61.2, totalAssets: 2174.0, totalDebt: 1880.0, totalEquity: 294.0 },
      { year: 2023, period: 'FY 2023', revenue: 132.5, grossProfit: 108.4, operatingProfit: 62.1, netProfit: 55.1, eps: 590, operatingCashFlow: 57.8, totalAssets: 2008.8, totalDebt: 1735.0, totalEquity: 273.8 },
      { year: 2022, period: 'FY 2022', revenue: 115.4, grossProfit: 94.2, operatingProfit: 51.0, netProfit: 41.2, eps: 441, operatingCashFlow: 48.0, totalAssets: 1992.5, totalDebt: 1748.2, totalEquity: 244.3 }
    ],
    detailedRatios: {
      roe: 20.4,
      roa: 2.7,
      gpm: 81.3,
      opm: 47.2,
      npm: 38.8,
      der: 6.39,
      currentRatio: 1.10,
      quickRatio: 1.10,
      interestCoverage: 11.2,
      peRatio: 11.5,
      pbvRatio: 2.2,
      evEbitda: 9.8,
      pegRatio: 0.95,
      priceToSales: 4.4,
      bvps: 3150,
      piotroskiFScore: 8,
      piotroskiAssessment: 'Kondisi Finansial Prima (Skor 8/9)',
      altmanZScore: 3.45,
      altmanZone: 'Aman (Safe Zone)',
      sectorPeAverage: 14.2,
      sectorPbvAverage: 2.1,
      sectorRoeAverage: 16.5
    },
    valuation: {
      grahamNumber: 6540,
      dcfFairValue: 7950,
      peBandMean: 7600,
      peBandHigh: 8400,
      peBandLow: 6400,
      pbvBandMean: 7450,
      averageFairValue: 7750,
      marginOfSafetyPercent: 11.5,
      status: 'Undervalued (Diskon Murah)',
      assumptions: {
        growthRate: 10.0,
        discountRate: 8.8,
        terminalRate: 5.0
      }
    },
    dividends: [
      { year: 2024, exDate: '19 Mar 2024', paymentDate: '03 Apr 2024', dps: 353.95, yieldPercent: 5.2, payoutRatio: 60.0 },
      { year: 2023, exDate: '24 Mar 2023', paymentDate: '12 Apr 2023', dps: 264.45, yieldPercent: 5.0, payoutRatio: 60.0 }
    ],
    dividendStreakYears: 22,
    corporateActions: [
      { title: 'RUPST Laporan Keuangan 2024 & Dividen', type: 'RUPS', date: '25 Mar 2025', notes: 'Usulan dividen tunai payout 60%', status: 'Akan Datang' }
    ],
    technicalSignals: [
      { indicator: 'Moving Average (MA 20)', value: '6.840', signal: 'Beli', description: 'Strong uptrend di atas MA 20' },
      { indicator: 'Moving Average (MA 50)', value: '6.710', signal: 'Beli', description: 'Garis MA 50 melengkung ke atas' },
      { indicator: 'RSI (14 Hari)', value: '61.8', signal: 'Beli', description: 'Momentum bullish stabil' },
      { indicator: 'MACD', value: '+32.4', signal: 'Beli', description: 'Sinyal beli menguat' }
    ],
    pivotPoints: calculatePivotPoints(7000, 6825, 6950),
    news: [
      {
        id: 'bmri-1',
        title: 'Transaksi Livin by Mandiri Tembus Rp 3.200 Triliun dengan 27 Juta Pengguna',
        source: 'Bisnis.com',
        time: '4 jam yang lalu',
        sentiment: 'Positif',
        snippet: 'Aplikasi Livin terus mendominasi transaksi ritel, menghasilkan fee-based income signifikan bagi bank.',
        category: 'Digital'
      }
    ],
    tradePlan: {
      entryZone: [6850, 6950],
      target1: 7400,
      target2: 7800,
      stopLoss: 6650,
      riskRewardRatio: '1 : 2.8',
      strategyName: 'Breakout Momentum',
      thesis: 'Manfaatkan momentum laba kuartal 4 dan dividen yield 5%.'
    }
  },

  TLKM: {
    orderBook: generateOrderBook(2980, 1.5),
    bandarmology: {
      phase: 'Akumulasi Normal',
      phaseScore: 68,
      whaleParticipationPercent: 58,
      buyerConcentration: 64,
      sellerConcentration: 44,
      netForeignToday: 78.5,
      netForeign5D: 210.4,
      netForeign20D: 540.2,
      foreignOwnershipPercent: 24.1,
      topBuyers: [
        { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing', lots: 180000, avgPrice: 2970, value: 53460 },
        { code: 'AK', name: 'UBS Sekuritas', type: 'Asing', lots: 145000, avgPrice: 2980, value: 43210 },
        { code: 'CC', name: 'Mandiri Sekuritas', type: 'Domestik', lots: 110000, avgPrice: 2960, value: 32560 }
      ],
      topSellers: [
        { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Domestik', lots: 85000, avgPrice: 2980, value: 25330 },
        { code: 'PD', name: 'Indo Premier Sekuritas', type: 'Domestik', lots: 72000, avgPrice: 2970, value: 21384 }
      ],
      foreignFlowHistory: [
        { date: 'Senin', netForeign: 15.2, price: 2950 },
        { date: 'Selasa', netForeign: 32.4, price: 2960 },
        { date: 'Rabu', netForeign: 41.8, price: 2970 },
        { date: 'Kamis', netForeign: 42.5, price: 2960 },
        { date: 'Jumat (Hari Ini)', netForeign: 78.5, price: 2980 }
      ]
    },
    financialHistory: [
      { year: 2024, period: 'FY 2024 (E)', revenue: 153.2, grossProfit: 105.4, operatingProfit: 41.2, netProfit: 25.4, eps: 256, operatingCashFlow: 54.0, totalAssets: 298.5, totalDebt: 148.2, totalEquity: 150.3 },
      { year: 2023, period: 'FY 2023', revenue: 149.2, grossProfit: 102.1, operatingProfit: 39.8, netProfit: 24.6, eps: 248, operatingCashFlow: 51.5, totalAssets: 287.0, totalDebt: 141.5, totalEquity: 145.5 }
    ],
    detailedRatios: {
      roe: 17.5,
      roa: 8.5,
      gpm: 68.8,
      opm: 26.9,
      npm: 16.6,
      der: 0.98,
      currentRatio: 0.85,
      quickRatio: 0.82,
      interestCoverage: 9.4,
      peRatio: 12.8,
      pbvRatio: 2.1,
      evEbitda: 5.4,
      pegRatio: 1.25,
      priceToSales: 1.9,
      bvps: 1515,
      piotroskiFScore: 7,
      piotroskiAssessment: 'Kondisi Finansial Sehat (Skor 7/9)',
      altmanZScore: 2.85,
      altmanZone: 'Abu-Abu (Grey Zone)',
      sectorPeAverage: 15.8,
      sectorPbvAverage: 2.4,
      sectorRoeAverage: 14.2
    },
    valuation: {
      grahamNumber: 2950,
      dcfFairValue: 3600,
      peBandMean: 3450,
      peBandHigh: 3900,
      peBandLow: 2800,
      pbvBandMean: 3500,
      averageFairValue: 3550,
      marginOfSafetyPercent: 19.1,
      status: 'Undervalued (Diskon Murah)',
      assumptions: {
        growthRate: 6.5,
        discountRate: 9.2,
        terminalRate: 4.5
      }
    },
    dividends: [
      { year: 2024, exDate: '15 Mei 2024', paymentDate: '06 Jun 2024', dps: 178.5, yieldPercent: 5.8, payoutRatio: 72.0 },
      { year: 2023, exDate: '13 Jun 2023', paymentDate: '05 Jul 2023', dps: 167.6, yieldPercent: 4.8, payoutRatio: 70.0 }
    ],
    dividendStreakYears: 26,
    corporateActions: [
      { title: 'Inbreng Aset Data Center NeutraDC', type: 'Paparan Publik', date: '15 Feb 2025', notes: 'Katalis unlock value bisnis hyperscale data center', status: 'Akan Datang' }
    ],
    technicalSignals: [
      { indicator: 'Moving Average (MA 20)', value: '2.940', signal: 'Beli', description: 'Rebound dari area support MA 20' },
      { indicator: 'Moving Average (MA 50)', value: '2.910', signal: 'Beli', description: 'Konfirmasi pembalikan arah jangka menengah' },
      { indicator: 'RSI (14 Hari)', value: '54.2', signal: 'Beli', description: 'Momentum pemulihan stabil' }
    ],
    pivotPoints: calculatePivotPoints(3010, 2940, 2980),
    news: [
      {
        id: 'tlkm-1',
        title: 'Telkom Kebut Proyek Hyperscale Data Center Cikarang & Batam',
        source: 'Kontan',
        time: '1 hari yang lalu',
        sentiment: 'Positif',
        snippet: 'Ekspansi kapasitas komputasi awan dan AI ditargetkan rampung pertengahan 2025.',
        category: 'Ekspansi'
      }
    ],
    tradePlan: {
      entryZone: [2920, 2980],
      target1: 3250,
      target2: 3500,
      stopLoss: 2820,
      riskRewardRatio: '1 : 3.2',
      strategyName: 'Bottom Fishing / Trend Reversal',
      thesis: 'Valuasi EV/EBITDA 5.4x terendah dalam 7 tahun terakhir, dividen yield tinggi.'
    }
  },

  ASII: {
    orderBook: generateOrderBook(5125, 1.1),
    bandarmology: {
      phase: 'Akumulasi Normal',
      phaseScore: 70,
      whaleParticipationPercent: 59,
      buyerConcentration: 66,
      sellerConcentration: 42,
      netForeignToday: 64.2,
      netForeign5D: 185.0,
      netForeign20D: 420.5,
      foreignOwnershipPercent: 49.2,
      topBuyers: [
        { code: 'BK', name: 'J.P. Morgan Sekuritas', type: 'Asing', lots: 75000, avgPrice: 5100, value: 38250 },
        { code: 'ZP', name: 'Maybank Sekuritas', type: 'Asing', lots: 54000, avgPrice: 5125, value: 27675 }
      ],
      topSellers: [
        { code: 'YP', name: 'Mirae Asset Sekuritas', type: 'Domestik', lots: 42000, avgPrice: 5125, value: 21525 }
      ],
      foreignFlowHistory: [
        { date: 'Senin', netForeign: 12.0, price: 5050 },
        { date: 'Selasa', netForeign: 25.5, price: 5075 },
        { date: 'Rabu', netForeign: 38.0, price: 5100 },
        { date: 'Kamis', netForeign: 45.3, price: 5100 },
        { date: 'Jumat (Hari Ini)', netForeign: 64.2, price: 5125 }
      ]
    },
    financialHistory: [
      { year: 2024, period: 'FY 2024 (E)', revenue: 320.5, grossProfit: 68.2, operatingProfit: 41.5, netProfit: 31.8, eps: 785, operatingCashFlow: 38.5, totalAssets: 440.0, totalDebt: 185.0, totalEquity: 255.0 }
    ],
    detailedRatios: {
      roe: 16.2,
      roa: 7.2,
      gpm: 21.3,
      opm: 12.9,
      npm: 9.9,
      der: 0.73,
      currentRatio: 1.45,
      quickRatio: 1.20,
      interestCoverage: 15.6,
      peRatio: 6.8,
      pbvRatio: 1.0,
      evEbitda: 4.8,
      pegRatio: 0.72,
      priceToSales: 0.65,
      bvps: 5125,
      piotroskiFScore: 8,
      piotroskiAssessment: 'Kondisi Finansial Prima (Skor 8/9)',
      altmanZScore: 3.25,
      altmanZone: 'Aman (Safe Zone)',
      sectorPeAverage: 11.5,
      sectorPbvAverage: 1.5,
      sectorRoeAverage: 13.8
    },
    valuation: {
      grahamNumber: 9510,
      dcfFairValue: 6200,
      peBandMean: 5900,
      peBandHigh: 6800,
      peBandLow: 4800,
      pbvBandMean: 6100,
      averageFairValue: 6050,
      marginOfSafetyPercent: 18.0,
      status: 'Undervalued (Diskon Murah)',
      assumptions: {
        growthRate: 6.0,
        discountRate: 9.5,
        terminalRate: 4.5
      }
    },
    dividends: [
      { year: 2024, exDate: '08 Okt 2024', paymentDate: '31 Okt 2024', dps: 98, yieldPercent: 1.9, payoutRatio: 15.0 },
      { year: 2024, exDate: '13 Mei 2024', paymentDate: '30 Mei 2024', dps: 421, yieldPercent: 8.2, payoutRatio: 64.0 },
      { year: 2023, exDate: '06 Okt 2023', paymentDate: '31 Okt 2023', dps: 98, yieldPercent: 1.8, payoutRatio: 15.0 },
      { year: 2023, exDate: '08 Mei 2023', paymentDate: '19 Mei 2023', dps: 552, yieldPercent: 9.2, payoutRatio: 75.0 }
    ],
    dividendStreakYears: 25,
    corporateActions: [
      { title: 'Dividen Final Astra TA 2024', type: 'Dividen', date: 'Mei 2025', notes: 'Potensi total yield >8% per tahun', status: 'Akan Datang' }
    ],
    technicalSignals: [
      { indicator: 'Moving Average (MA 20)', value: '5.060', signal: 'Beli', description: 'Breakout ke atas MA 20' },
      { indicator: 'RSI (14 Hari)', value: '56.4', signal: 'Beli', description: 'Sinyal akumulasi berlanjut' }
    ],
    pivotPoints: calculatePivotPoints(5175, 5050, 5125),
    news: [
      {
        id: 'asii-1',
        title: 'Penjualan Mobil Domestik Naik di Q4, Astra Kokohkan Pangsa Pasar 55%',
        source: 'Bisnis.com',
        time: '1 hari yang lalu',
        sentiment: 'Positif',
        snippet: 'Model hybrid Toyota dan Daihatsu terus memimpin minat konsumen otomotif.',
        category: 'Industri'
      }
    ],
    tradePlan: {
      entryZone: [5050, 5150],
      target1: 5600,
      target2: 6000,
      stopLoss: 4850,
      riskRewardRatio: '1 : 3.0',
      strategyName: 'High Dividend Value Play',
      thesis: 'Valuasi P/E 6.8x dan dividend yield jumbo 8.5% menjamin margin of safety tebal.'
    }
  }
};

/**
 * Returns complete profile with auto-fallback for any missing metrics
 */
export function getEnrichedStockProfile(baseStock: StockProfile): StockProfile {
  const extra = ENRICHED_STOCK_EXTRAS[baseStock.ticker] || {};

  // If orderbook is not explicitly declared, generate deterministic one
  const orderBook = extra.orderBook || generateOrderBook(baseStock.currentPrice, baseStock.currency === 'IDR' ? 1 : 0.05);

  // If pivot points not declared, calculate from high, low, close
  const pivotPoints = extra.pivotPoints || calculatePivotPoints(baseStock.dayHigh, baseStock.dayLow, baseStock.currentPrice);

  // Deterministic fallback for bandarmology if missing
  const bandarmology: StockBandarmology = extra.bandarmology || {
    phase: baseStock.changePercent > 0 ? 'Akumulasi Normal' : 'Netral / Konsolidasi',
    phaseScore: baseStock.changePercent > 0 ? 70 : 50,
    whaleParticipationPercent: 55,
    buyerConcentration: 62,
    sellerConcentration: 48,
    netForeignToday: Math.round(baseStock.changePrice * 5.2),
    netForeign5D: Math.round(baseStock.changePrice * 18.4),
    netForeign20D: Math.round(baseStock.changePrice * 45.0),
    foreignOwnershipPercent: 32.5,
    topBuyers: [
      { code: 'BK', name: 'J.P. Morgan', type: 'Asing', lots: 45000, avgPrice: baseStock.currentPrice, value: 45000 },
      { code: 'ZP', name: 'Maybank', type: 'Asing', lots: 32000, avgPrice: baseStock.currentPrice, value: 32000 },
      { code: 'CC', name: 'Mandiri Sekuritas', type: 'Domestik', lots: 28000, avgPrice: baseStock.currentPrice, value: 28000 }
    ],
    topSellers: [
      { code: 'YP', name: 'Mirae Asset', type: 'Domestik', lots: 31000, avgPrice: baseStock.currentPrice, value: 31000 },
      { code: 'PD', name: 'Indo Premier', type: 'Domestik', lots: 24000, avgPrice: baseStock.currentPrice, value: 24000 }
    ],
    foreignFlowHistory: [
      { date: 'T-4', netForeign: 15, price: baseStock.dayLow },
      { date: 'T-3', netForeign: 22, price: baseStock.previousClose },
      { date: 'T-2', netForeign: -10, price: baseStock.dayOpen },
      { date: 'T-1', netForeign: 35, price: baseStock.currentPrice },
      { date: 'Hari Ini', netForeign: 45, price: baseStock.currentPrice }
    ]
  };

  // Detailed ratios fallback
  const detailedRatios: StockFinancialRatios = extra.detailedRatios || {
    roe: baseStock.roe,
    roa: Math.round((baseStock.roe / 2.2) * 10) / 10,
    gpm: 38.5,
    opm: 22.0,
    npm: 18.5,
    der: 0.85,
    currentRatio: 1.6,
    quickRatio: 1.3,
    interestCoverage: 12.0,
    peRatio: baseStock.peRatio,
    pbvRatio: baseStock.pbvRatio,
    evEbitda: 8.5,
    pegRatio: 1.2,
    priceToSales: 2.4,
    bvps: Math.round(baseStock.currentPrice / (baseStock.pbvRatio || 1)),
    piotroskiFScore: baseStock.analystScore >= 4.5 ? 8 : 6,
    piotroskiAssessment: baseStock.analystScore >= 4.5 ? 'Kondisi Finansial Prima' : 'Kondisi Finansial Moderat',
    altmanZScore: 3.2,
    altmanZone: 'Aman (Safe Zone)',
    sectorPeAverage: 15.0,
    sectorPbvAverage: 2.2,
    sectorRoeAverage: 15.5
  };

  // Valuation fallback
  const valuation: StockValuationModels = extra.valuation || {
    grahamNumber: Math.round(baseStock.currentPrice * 0.95),
    dcfFairValue: baseStock.consensusTarget,
    peBandMean: Math.round(baseStock.currentPrice * 1.08),
    peBandHigh: Math.round(baseStock.currentPrice * 1.25),
    peBandLow: Math.round(baseStock.currentPrice * 0.88),
    pbvBandMean: Math.round(baseStock.currentPrice * 1.05),
    averageFairValue: baseStock.consensusTarget,
    marginOfSafetyPercent: Math.round(((baseStock.consensusTarget - baseStock.currentPrice) / baseStock.currentPrice) * 100),
    status: baseStock.consensusTarget > baseStock.currentPrice ? 'Undervalued (Diskon Murah)' : 'Fair Value (Wajar)',
    assumptions: {
      growthRate: 10.0,
      discountRate: 9.0,
      terminalRate: 4.5
    }
  };

  // Technical signals fallback
  const technicalSignals: StockTechnicalSignal[] = extra.technicalSignals || [
    { indicator: 'MA 20', value: `${baseStock.currentPrice * 0.98}`, signal: 'Beli', description: 'Di atas MA 20 tren positif' },
    { indicator: 'MA 50', value: `${baseStock.currentPrice * 0.96}`, signal: 'Beli', description: 'Golden cross jangka menengah' },
    { indicator: 'RSI 14', value: '58.5', signal: 'Beli', description: 'Momentum bullish belum jenuh beli' },
    { indicator: 'MACD', value: '+14.2', signal: 'Beli', description: 'Histogram di area positif' },
    { indicator: 'Stochastic', value: '62.0', signal: 'Netral', description: 'Konsolidasi wajar' }
  ];

  // News fallback
  const news: StockNewsItem[] = extra.news || [
    {
      id: `${baseStock.ticker}-1`,
      title: `Rekomendasi Analis untuk ${baseStock.ticker}: ${baseStock.summaryReason}`,
      source: 'Riset Pasar Modal',
      time: 'Hari ini',
      sentiment: 'Positif',
      snippet: baseStock.description,
      category: 'Riset'
    }
  ];

  // Trade Plan fallback
  const tradePlan: StockTradePlan = extra.tradePlan || {
    entryZone: [baseStock.supportLevels[0], baseStock.currentPrice],
    target1: baseStock.resistanceLevels[0],
    target2: baseStock.consensusTarget,
    stopLoss: baseStock.supportLevels[1],
    riskRewardRatio: '1 : 2.5',
    strategyName: 'Swing Trade & Value Buy',
    thesis: baseStock.summaryReason
  };

  return {
    ...baseStock,
    orderBook,
    bandarmology,
    financialHistory: extra.financialHistory || [
      { year: 2024, period: 'FY 2024 (E)', revenue: 100, grossProfit: 45, operatingProfit: 25, netProfit: 18, eps: 200, operatingCashFlow: 22, totalAssets: 150, totalDebt: 60, totalEquity: 90 }
    ],
    detailedRatios,
    valuation,
    dividends: extra.dividends || [
      { year: 2024, exDate: 'Nov 2024', paymentDate: 'Des 2024', dps: Math.round(baseStock.currentPrice * (baseStock.dividendYield / 100)), yieldPercent: baseStock.dividendYield, payoutRatio: 50 }
    ],
    dividendStreakYears: extra.dividendStreakYears || 10,
    corporateActions: extra.corporateActions || [
      { title: `RUPST Tahunan ${baseStock.name}`, type: 'RUPS', date: 'Maret 2025', notes: 'Agenda penetapan dividen tunai', status: 'Akan Datang' }
    ],
    technicalSignals,
    pivotPoints,
    news,
    tradePlan
  };
}
