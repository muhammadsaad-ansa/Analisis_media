import React, { useState } from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { Calculator, ArrowRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface StockInvestmentCalculatorProps {
  stock: StockProfile;
}

export const StockInvestmentCalculator: React.FC<StockInvestmentCalculatorProps> = ({ stock }) => {
  const isIdr = stock.currency === 'IDR';
  const defaultCapital = isIdr ? 10000000 : 1000; // Rp 10 Juta or $1,000

  const [capital, setCapital] = useState<number>(defaultCapital);
  const [buyPrice, setBuyPrice] = useState<number>(stock.currentPrice);
  const [targetPrice, setTargetPrice] = useState<number>(stock.consensusTarget);
  const [stopLossPrice, setStopLossPrice] = useState<number>(stock.supportLevels[1]);

  // Calculations
  const lotSize = stock.lotSize; // 100 for IDX, 1 for US
  const pricePerLot = buyPrice * lotSize;
  const totalLots = Math.max(1, Math.floor(capital / (pricePerLot || 1)));
  const totalShares = totalLots * lotSize;
  const actualInvested = totalShares * buyPrice;

  const targetValue = totalShares * targetPrice;
  const potentialProfit = targetValue - actualInvested;
  const profitPercentage = actualInvested > 0 ? (potentialProfit / actualInvested) * 100 : 0;

  const stopLossValue = totalShares * stopLossPrice;
  const potentialLoss = actualInvested - stopLossValue;
  const riskRewardRatio = potentialLoss > 0 ? (potentialProfit / potentialLoss) : 0;

  const handleSetTargetPreset = (multiplier: number) => {
    const calculated = Math.round(stock.currentPrice * multiplier * (isIdr ? 1 : 100)) / (isIdr ? 1 : 100);
    setTargetPrice(calculated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulasi Investasi & Target Cuan
            </h3>
            <p className="text-xs text-slate-500">Hitung potensi imbal hasil & manajemen risiko</p>
          </div>
        </div>

        <button
          onClick={() => {
            setCapital(defaultCapital);
            setBuyPrice(stock.currentPrice);
            setTargetPrice(stock.consensusTarget);
            setStopLossPrice(stock.supportLevels[1]);
          }}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset ke default"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Modal Investasi */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Modal Rencana ({stock.currency})
          </label>
          <div className="relative">
            <input
              type="number"
              min={pricePerLot}
              step={isIdr ? 500000 : 50}
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <span>Preset:</span>
            {[5000000, 10000000, 25000000, 50000000].map((preset) => {
              if (!isIdr && preset > 10000) return null;
              const val = isIdr ? preset : preset / 10000;
              return (
                <button
                  key={preset}
                  onClick={() => setCapital(val)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 font-mono transition-colors"
                >
                  {isIdr ? `${val / 1000000}jt` : `$${val}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Harga Beli */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Harga Beli ({stock.currency})
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
            <span>Harga Pasar Terkini:</span>
            <button
              onClick={() => setBuyPrice(stock.currentPrice)}
              className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Gunakan {formatStockPrice(stock.currentPrice, stock.currency)}
            </button>
          </div>
        </div>

        {/* Target Jual */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Target Harga Jual ({stock.currency})
          </label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            <button
              onClick={() => setTargetPrice(stock.resistanceLevels[0])}
              className="text-slate-500 hover:text-indigo-600 underline"
            >
              R1 ({stock.resistanceLevels[0]})
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setTargetPrice(stock.consensusTarget)}
              className="text-slate-500 hover:text-indigo-600 underline"
            >
              Konsensus ({stock.consensusTarget})
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => handleSetTargetPreset(1.15)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              +15%
            </button>
          </div>
        </div>

        {/* Stop Loss Batas Risiko */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Batas Stop Loss / Cut Loss ({stock.currency})
          </label>
          <input
            type="number"
            value={stopLossPrice}
            onChange={(e) => setStopLossPrice(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
            <span>Level Support 2:</span>
            <button
              onClick={() => setStopLossPrice(stock.supportLevels[1])}
              className="text-rose-500 font-semibold hover:underline"
            >
              {formatStockPrice(stock.supportLevels[1], stock.currency)}
            </button>
          </div>
        </div>
      </div>

      {/* Output Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <span className="text-xs text-slate-400">Kepemilikan Saham:</span>
            <div className="text-base font-bold font-mono text-cyan-400">
              {isIdr ? `${totalLots.toLocaleString('id-ID')} Lot` : `${totalShares} Lembar`}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({totalShares.toLocaleString('id-ID')} lembar)
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Modal Terpakai:</span>
            <div className="text-sm font-semibold font-mono text-slate-200">
              {formatStockPrice(actualInvested, stock.currency)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Nilai Target */}
          <div>
            <span className="text-[11px] text-slate-400">Estimasi Nilai Target:</span>
            <div className="text-base font-bold font-mono text-white">
              {formatStockPrice(targetValue, stock.currency)}
            </div>
          </div>

          {/* Potensi Cuan / Untung */}
          <div>
            <span className="text-[11px] text-slate-400">Potensi Keuntungan:</span>
            <div className="text-base font-bold font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>+{formatStockPrice(potentialProfit, stock.currency)}</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-medium">
              ROI: +{profitPercentage.toFixed(2)}%
            </span>
          </div>

          {/* Risk:Reward */}
          <div>
            <span className="text-[11px] text-slate-400">Rasio Risk : Reward:</span>
            <div className="text-base font-bold font-mono text-amber-400">
              {riskRewardRatio > 0 ? `1 : ${riskRewardRatio.toFixed(1)}` : 'N/A'}
            </div>
            <span className="text-[10px] text-slate-400">
              {riskRewardRatio >= 2 ? 'Sangat Layak (R:R > 2)' : 'Rasio Cukup'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
