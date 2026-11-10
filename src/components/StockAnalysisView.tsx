import React, { useState, useMemo } from 'react';
import { 
  STOCK_PROFILES, 
  generateStockHistory, 
  formatStockPrice, 
  formatStockChange, 
  formatLargeNumber, 
  formatVolume,
  getStoredWatchlist,
  saveStoredWatchlist
} from '../services/stockData';
import { getEnrichedStockProfile } from '../services/stockAnalysisData';
import { StockProfile, StockTimeframe } from '../types';
import { StockInteractiveChart } from './stock/StockInteractiveChart';
import { StockMetricCards } from './stock/StockMetricCards';
import { StockSignalCard } from './stock/StockSignalCard';
import { StockInvestmentCalculator } from './stock/StockInvestmentCalculator';
import { StockWatchlistBar } from './stock/StockWatchlistBar';
import { StockBandarmologyPanel } from './stock/StockBandarmologyPanel';
import { StockFundamentalDeepDive } from './stock/StockFundamentalDeepDive';
import { StockFairValueValuation } from './stock/StockFairValueValuation';
import { StockOrderBookDepth } from './stock/StockOrderBookDepth';
import { StockTechnicalPivotPanel } from './stock/StockTechnicalPivotPanel';
import { StockDividendCorporateAction } from './stock/StockDividendCorporateAction';
import { StockNewsSentiment } from './stock/StockNewsSentiment';
import { StockTradingPlanCalculator } from './stock/StockTradingPlanCalculator';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Download, 
  Building2, 
  Activity,
  ShieldAlert,
  Info,
  Layers,
  PieChart,
  Users,
  Target,
  Calendar,
  Newspaper,
  Calculator,
  Search,
  Sparkles
} from 'lucide-react';

export type StockAnalysisTab = 
  | 'overview' 
  | 'bandarmology' 
  | 'fundamental' 
  | 'valuation' 
  | 'technical' 
  | 'dividends' 
  | 'news' 
  | 'tradeplan';

export const StockAnalysisView: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<string>('BBCA');
  const [timeframe, setTimeframe] = useState<StockTimeframe>('1M');
  const [watchlist, setWatchlist] = useState<string[]>(() => getStoredWatchlist());
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<StockAnalysisTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find selected stock profile and enrich it with complete deep analysis models
  const rawStock: StockProfile = useMemo(() => {
    return STOCK_PROFILES.find((s) => s.ticker === selectedTicker) || STOCK_PROFILES[0];
  }, [selectedTicker]);

  const stock: StockProfile = useMemo(() => {
    return getEnrichedStockProfile(rawStock);
  }, [rawStock]);

  // Generate historical data points for selected timeframe
  const chartData = useMemo(() => {
    return generateStockHistory(stock, timeframe);
  }, [stock, timeframe]);

  const changeInfo = formatStockChange(
    stock.currentPrice,
    stock.changePrice,
    stock.changePercent,
    stock.currency
  );

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker];
      saveStoredWatchlist(next);
      return next;
    });
  };

  const isFavorited = watchlist.includes(stock.ticker);

  // Filtered stocks for quick switcher search
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return STOCK_PROFILES;
    const q = searchQuery.toLowerCase();
    return STOCK_PROFILES.filter(s => 
      s.ticker.toLowerCase().includes(q) || 
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Market Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                IHSG 7.320,50 (+0.45%) · Sesi Reguler IDX
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Bursa Efek Indonesia & Global Market
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                Sistem Analisis Saham Terlengkap
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Sistem Analis Saham Komprehensif (IDX & Global)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Analisis multi-dimensi lengkap: Bandarmologi & Arus Dana Asing, Laporan Keuangan Fundamental & Piotroski Score, Valuasi Harga Wajar (Graham & DCF), Orderbook Kedalaman Pasar, Sinyal Pivot Indikator Teknikal, Dividen, Berita Emiten, dan Kalkulator Money Management.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => toggleWatchlist(stock.ticker)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                isFavorited
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFavorited ? 'Favorit' : 'Tambah Favorit'}</span>
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-all"
              title="Cetak Ringkasan Saham"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Selected Stock Live Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
          {/* Main Price */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-white">
                {stock.ticker}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                {stock.sector}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {stock.exchange}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                {formatStockPrice(stock.currentPrice, stock.currency)}
              </span>
              <span
                className={`text-xs sm:text-sm font-bold font-mono px-2 py-0.5 rounded-lg flex items-center gap-0.5 tabular-nums ${
                  changeInfo.isPositive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {changeInfo.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {changeInfo.diffText} ({changeInfo.percentText})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {stock.name}
            </p>
          </div>

          {/* Rentang Hari Ini */}
          <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Rentang Hari Ini</span>
            <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5 tabular-nums">
              {formatStockPrice(stock.dayLow, stock.currency)} - {formatStockPrice(stock.dayHigh, stock.currency)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
              Open: {formatStockPrice(stock.dayOpen, stock.currency)}
            </span>
          </div>

          {/* Volume 24H */}
          <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Volume 24 Jam</span>
            <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5 tabular-nums">
              {formatVolume(stock.volume24h, stock.currency)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
              Prev: {formatStockPrice(stock.previousClose, stock.currency)}
            </span>
          </div>

          {/* Market Cap */}
          <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Kapitalisasi Pasar</span>
            <div className="font-mono text-xs font-semibold text-cyan-400 mt-0.5 tabular-nums">
              {formatLargeNumber(stock.marketCap, stock.currency)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Sektor: {stock.sector}
            </span>
          </div>

          {/* Rating Snapshot */}
          <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Konsensus Sekuritas</span>
            <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5 tabular-nums">
              {stock.analystRating} ({stock.analystScore}/5)
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
              Target: {formatStockPrice(stock.consensusTarget, stock.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Stock Watchlist & Selector Carousel */}
      <StockWatchlistBar
        stocks={filteredStocks}
        selectedTicker={selectedTicker}
        onSelectStock={(ticker) => setSelectedTicker(ticker)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Key Metric Snapshot Cards */}
      <StockMetricCards stock={stock} />

      {/* Main Analysis Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveAnalysisTab('overview')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Ikhtisar & Grafik</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('bandarmology')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'bandarmology'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Bandarmologi & Asing</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveAnalysisTab('fundamental')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'fundamental'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Fundamental & Rasio</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('valuation')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'valuation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Valuasi Harga Wajar</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('technical')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'technical'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Teknikal & Pivot</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('dividends')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'dividends'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Dividen & Korporasi</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('news')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'news'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Berita & Sentimen</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('tradeplan')}
            className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeAnalysisTab === 'tradeplan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Trading Plan</span>
          </button>
        </div>
      </div>

      {/* Dynamic Tab Content Display */}
      {activeAnalysisTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Interactive Chart & Order Book */}
            <div className="lg:col-span-2 space-y-6">
              <StockInteractiveChart
                stock={stock}
                data={chartData}
                timeframe={timeframe}
                onTimeframeChange={(tf) => setTimeframe(tf)}
              />

              {/* Orderbook Depth */}
              <StockOrderBookDepth stock={stock} />

              {/* Company Brief & Core Thesis */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Profil Bisnis & Tesis Investasi {stock.ticker} ({stock.name})
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {stock.description}
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Katalis Utama Analis:</strong> {stock.summaryReason}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Signal Card & Quick Investment Calculator */}
            <div className="space-y-6">
              <StockSignalCard stock={stock} />
              <StockInvestmentCalculator stock={stock} />
            </div>
          </div>
        </div>
      )}

      {activeAnalysisTab === 'bandarmology' && (
        <StockBandarmologyPanel stock={stock} />
      )}

      {activeAnalysisTab === 'fundamental' && (
        <StockFundamentalDeepDive stock={stock} />
      )}

      {activeAnalysisTab === 'valuation' && (
        <StockFairValueValuation stock={stock} />
      )}

      {activeAnalysisTab === 'technical' && (
        <StockTechnicalPivotPanel stock={stock} />
      )}

      {activeAnalysisTab === 'dividends' && (
        <StockDividendCorporateAction stock={stock} />
      )}

      {activeAnalysisTab === 'news' && (
        <StockNewsSentiment stock={stock} />
      )}

      {activeAnalysisTab === 'tradeplan' && (
        <StockTradingPlanCalculator stock={stock} />
      )}

      {/* Disclaimer Section for OJK & Financial Safety */}
      <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Catatan Risiko & Penafian (Disclaimer Pasar Modal)
          </p>
          <p className="leading-relaxed text-[11px]">
            Data harga pasar, kalkulasi valuasi wajar (DCF/Graham Number), indikator teknikal (SMA, RSI, MACD, Pivot), serta arus bandarmologi & broker summary disajikan sebagai sarana riset dan analisis edukasi finansial. Seluruh keputusan transaksi jual/beli saham merupakan tanggung jawab independen investor. Disiplin selalu gunakan manajemen risiko (stop loss) dan diversifikasi aset.
          </p>
        </div>
      </div>
    </div>
  );
};
