import React from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { Layers, ShieldCheck, Scale, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface StockOrderBookDepthProps {
  stock: StockProfile;
}

export const StockOrderBookDepth: React.FC<StockOrderBookDepthProps> = ({ stock }) => {
  const ob = stock.orderBook;
  if (!ob) return null;

  const isIdr = stock.currency === 'IDR';

  // Find max lot for bar width scaling
  const allLots = [...ob.bids.map(b => b.lots), ...ob.offers.map(o => o.lots)];
  const maxLot = Math.max(...allLots, 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Power Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Order Book & Kedalaman Pasar (Bid / Offer Depth)
            </h4>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Antrian antarmuka beli (Bid) dan jual (Offer) reguler secara real-time
          </p>
        </div>

        {/* Bid vs Offer Power Ratio */}
        <div className="min-w-[200px]">
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Bid {ob.bidPowerPercent}%
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              Offer {100 - ob.bidPowerPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${ob.bidPowerPercent}%` }}
              title={`Bid Power: ${ob.bidPowerPercent}%`}
            />
            <div 
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${100 - ob.bidPowerPercent}%` }}
              title={`Offer Power: ${100 - ob.bidPowerPercent}%`}
            />
          </div>
        </div>
      </div>

      {/* Main Orderbook Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Bids Column (Left) */}
        <div className="space-y-1">
          <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 px-1">
            <span className="text-left">Antri</span>
            <span className="text-center">Lot Bid</span>
            <span className="text-right">Harga Beli</span>
          </div>
          {ob.bids.map((b, idx) => {
            const barWidth = Math.min(100, Math.round((b.lots / maxLot) * 100));
            return (
              <div 
                key={idx}
                className="relative grid grid-cols-3 py-1.5 px-2 rounded-lg hover:bg-emerald-500/10 font-mono transition-all overflow-hidden"
              >
                {/* Background visual bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none"
                  style={{ width: `${barWidth}%` }}
                />
                <span className="text-slate-400 text-[10px] self-center relative z-10">
                  {b.orders}
                </span>
                <span className="text-center font-bold text-slate-800 dark:text-slate-200 relative z-10 tabular-nums">
                  {b.lots.toLocaleString('id-ID')}
                </span>
                <span className="text-right font-extrabold text-emerald-600 dark:text-emerald-400 relative z-10 tabular-nums">
                  {b.price.toLocaleString('id-ID')}
                </span>
              </div>
            );
          })}
          {/* Total Bids */}
          <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs px-2 font-mono">
            <span className="text-slate-500 font-sans font-semibold">Total Bid:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {ob.totalBidLots.toLocaleString('id-ID')} Lot
            </span>
          </div>
        </div>

        {/* Offers Column (Right) */}
        <div className="space-y-1">
          <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 px-1">
            <span className="text-left">Harga Jual</span>
            <span className="text-center">Lot Offer</span>
            <span className="text-right">Antri</span>
          </div>
          {ob.offers.map((o, idx) => {
            const barWidth = Math.min(100, Math.round((o.lots / maxLot) * 100));
            return (
              <div 
                key={idx}
                className="relative grid grid-cols-3 py-1.5 px-2 rounded-lg hover:bg-rose-500/10 font-mono transition-all overflow-hidden"
              >
                {/* Background visual bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none"
                  style={{ width: `${barWidth}%` }}
                />
                <span className="text-left font-extrabold text-rose-600 dark:text-rose-400 relative z-10 tabular-nums">
                  {o.price.toLocaleString('id-ID')}
                </span>
                <span className="text-center font-bold text-slate-800 dark:text-slate-200 relative z-10 tabular-nums">
                  {o.lots.toLocaleString('id-ID')}
                </span>
                <span className="text-right text-slate-400 text-[10px] self-center relative z-10">
                  {o.orders}
                </span>
              </div>
            );
          })}
          {/* Total Offers */}
          <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs px-2 font-mono">
            <span className="text-slate-500 font-sans font-semibold">Total Offer:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {ob.totalOfferLots.toLocaleString('id-ID')} Lot
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
