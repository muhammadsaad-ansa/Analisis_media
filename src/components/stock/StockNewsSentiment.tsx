import React, { useState } from 'react';
import { StockProfile } from '../../types';
import { Newspaper, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Filter, ExternalLink } from 'lucide-react';

interface StockNewsSentimentProps {
  stock: StockProfile;
}

export const StockNewsSentiment: React.FC<StockNewsSentimentProps> = ({ stock }) => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'Positif' | 'Netral' | 'Waspada'>('all');

  const newsItems = stock.news || [];
  const filtered = filterSentiment === 'all' 
    ? newsItems 
    : newsItems.filter(n => n.sentiment === filterSentiment);

  const posCount = newsItems.filter(n => n.sentiment === 'Positif').length;
  const netCount = newsItems.filter(n => n.sentiment === 'Netral').length;
  const alertCount = newsItems.filter(n => n.sentiment === 'Waspada').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-indigo-500" />
            Berita Emiten & Sentimen Pasar Saham
          </h4>
          <p className="text-xs text-slate-500">
            Katalis berita keuangan, rilis kinerja, dan perkembangan bisnis {stock.ticker}
          </p>
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterSentiment('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterSentiment === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            Semua ({newsItems.length})
          </button>
          <button
            onClick={() => setFilterSentiment('Positif')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterSentiment === 'Positif' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}
          >
            Positif ({posCount})
          </button>
          <button
            onClick={() => setFilterSentiment('Netral')}
            className={`px-2.5 py-1 rounded-lg transition-all ${filterSentiment === 'Netral' ? 'bg-slate-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          >
            Netral ({netCount})
          </button>
          {alertCount > 0 && (
            <button
              onClick={() => setFilterSentiment('Waspada')}
              className={`px-2.5 py-1 rounded-lg transition-all ${filterSentiment === 'Waspada' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}
            >
              Waspada ({alertCount})
            </button>
          )}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isPos = item.sentiment === 'Positif';
          const isAlert = item.sentiment === 'Waspada';

          return (
            <div 
              key={item.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.source} · {item.time}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isPos ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : isAlert ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'}`}>
                  Sentimen {item.sentiment}
                </span>
              </div>

              <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h5>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.snippet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
