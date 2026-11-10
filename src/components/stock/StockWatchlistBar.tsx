import React, { useState } from 'react';
import { StockProfile, StockSector } from '../../types';
import { formatStockPrice, formatStockChange } from '../../services/stockData';
import { Search, Star, TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface StockWatchlistBarProps {
  stocks: StockProfile[];
  selectedTicker: string;
  onSelectStock: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

export const StockWatchlistBar: React.FC<StockWatchlistBarProps> = ({
  stocks,
  selectedTicker,
  onSelectStock,
  watchlist,
  onToggleWatchlist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Semua');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);

  const sectors = ['Semua', 'Perbankan', 'Teknologi', 'Consumer Goods', 'Energi & Tambang', 'Global Tech'];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      selectedSector === 'Semua' || stock.sector === selectedSector;

    const matchesWatchlist = !onlyWatchlist || watchlist.includes(stock.ticker);

    return matchesSearch && matchesSector && matchesWatchlist;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
      {/* Search and Filters header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kode saham (e.g. BBCA, BBRI, NVDA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Watchlist only toggle */}
        <button
          onClick={() => setOnlyWatchlist(!onlyWatchlist)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shrink-0 ${
            onlyWatchlist
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${onlyWatchlist ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Favorit ({watchlist.length})</span>
        </button>
      </div>

      {/* Sector filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSector === sector
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Stock Cards Horizontal / Grid Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
        {filteredStocks.map((stock) => {
          const isSelected = stock.ticker === selectedTicker;
          const isFav = watchlist.includes(stock.ticker);
          const change = formatStockChange(stock.currentPrice, stock.changePrice, stock.changePercent, stock.currency);

          return (
            <div
              key={stock.ticker}
              onClick={() => onSelectStock(stock.ticker)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all relative group ${
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                      {stock.ticker}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">{stock.exchange}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                    {stock.name}
                  </p>
                </div>

                {/* Bookmark button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(stock.ticker);
                  }}
                  className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  {formatStockPrice(stock.currentPrice, stock.currency)}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold flex items-center ${
                    change.isPositive ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {change.percentText}
                </span>
              </div>
            </div>
          );
        })}

        {filteredStocks.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-slate-400">
            Tidak ada saham yang cocok dengan filter atau kata kunci pencarian.
          </div>
        )}
      </div>
    </div>
  );
};
