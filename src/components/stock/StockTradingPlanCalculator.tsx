import React, { useState } from 'react';
import { StockProfile } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { 
  Calculator, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  RefreshCw, 
  HelpCircle,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface StockTradingPlanCalculatorProps {
  stock: StockProfile;
}

export const StockTradingPlanCalculator: React.FC<StockTradingPlanCalculatorProps> = ({ stock }) => {
  const isIdr = stock.currency === 'IDR';
  const defaultCapital = isIdr ? 50000000 : 5000; // Rp 50 Juta or $5,000

  const [totalCapital, setTotalCapital] = useState<number>(defaultCapital);
  const [riskPercent, setRiskPercent] = useState<number>(2); // 2% risk per trade rule
  const [entryPrice, setEntryPrice] = useState<number>(stock.currentPrice);
  const [stopLossPrice, setStopLossPrice] = useState<number>(stock.supportLevels[1]);
  const [targetPrice, setTargetPrice] = useState<number>(stock.consensusTarget);

  // Broker fee settings (Standard IDX: 0.15% buy, 0.25% sell including tax)
  const feeBuyPercent = isIdr ? 0.0015 : 0.0005;
  const feeSellPercent = isIdr ? 0.0025 : 0.0005;

  // Position sizing calculation
  const maxRiskMoney = totalCapital * (riskPercent / 100);
  const priceRiskPerShare = Math.max(1, entryPrice - stopLossPrice);
  const lotSize = stock.lotSize || (isIdr ? 100 : 1);
  const riskPerLot = priceRiskPerShare * lotSize;

  // Max safe lots
  const calculatedMaxLots = Math.max(1, Math.floor(maxRiskMoney / (riskPerLot || 1)));
  const totalShares = calculatedMaxLots * lotSize;
  const grossCapitalInvested = totalShares * entryPrice;
  const buyFee = grossCapitalInvested * feeBuyPercent;
  const totalInvestedWithFee = grossCapitalInvested + buyFee;

  // If capital invested exceeds total capital, clamp
  const safeLotClamped = grossCapitalInvested > totalCapital 
    ? Math.max(1, Math.floor(totalCapital / (entryPrice * lotSize)))
    : calculatedMaxLots;

  const actualShares = safeLotClamped * lotSize;
  const actualInvested = actualShares * entryPrice;
  const actualBuyFee = actualInvested * feeBuyPercent;

  // Target profit outcome
  const grossTargetReturn = actualShares * targetPrice;
  const sellFeeTarget = grossTargetReturn * feeSellPercent;
  const netProfit = grossTargetReturn - actualInvested - actualBuyFee - sellFeeTarget;
  const profitPercent = actualInvested > 0 ? (netProfit / actualInvested) * 100 : 0;

  // Stop loss outcome
  const grossStopLossReturn = actualShares * stopLossPrice;
  const sellFeeStop = grossStopLossReturn * feeSellPercent;
  const netLoss = actualInvested - grossStopLossReturn + actualBuyFee + sellFeeStop;
  const lossPercent = actualInvested > 0 ? (netLoss / actualInvested) * 100 : 0;

  // Risk to Reward Ratio
  const potentialPerShareReward = targetPrice - entryPrice;
  const potentialPerShareRisk = entryPrice - stopLossPrice;
  const rrr = potentialPerShareRisk > 0 ? (potentialPerShareReward / potentialPerShareRisk) : 0;

  const plan = stock.tradePlan;

  return (
    <div className="space-y-6">
      {/* Top Banner: Preset Action Plan */}
      {plan && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Actionable Trading Plan
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Rencana Eksekusi: {plan.strategyName}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold self-start sm:self-auto font-mono">
              RRR {plan.riskRewardRatio}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Area Beli (Entry Zone)</span>
              <span className="text-sm font-black font-mono text-white mt-0.5 block">
                {formatStockPrice(plan.entryZone[0], stock.currency)} - {formatStockPrice(plan.entryZone[1], stock.currency)}
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Target 1 (Konservatif)</span>
              <span className="text-sm font-black font-mono text-emerald-400 mt-0.5 block">
                {formatStockPrice(plan.target1, stock.currency)}
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Target 2 (Optimis)</span>
              <span className="text-sm font-black font-mono text-cyan-400 mt-0.5 block">
                {formatStockPrice(plan.target2, stock.currency)}
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Stop Loss (Batas Risiko)</span>
              <span className="text-sm font-black font-mono text-rose-400 mt-0.5 block">
                {formatStockPrice(plan.stopLoss, stock.currency)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed">
            <strong>Tesis Trading:</strong> {plan.thesis}
          </p>
        </div>
      )}

      {/* Interactive Money Management & Position Sizing Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              Kalkulator Money Management & Ukuran Posisi (Position Sizing)
            </h4>
            <p className="text-xs text-slate-500">
              Hitung jumlah lot maksimal yang aman sesuai toleransi risiko 1-2% portofolio Anda
            </p>
          </div>

          <button
            onClick={() => {
              setTotalCapital(defaultCapital);
              setRiskPercent(2);
              setEntryPrice(stock.currentPrice);
              setStopLossPrice(stock.supportLevels[1]);
              setTargetPrice(stock.consensusTarget);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Nilai
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Modal Portofolio */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Total Modal Portofolio
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalCapital}
                onChange={(e) => setTotalCapital(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {formatStockPrice(totalCapital, stock.currency)}
            </span>
          </div>

          {/* Batas Risiko Portofolio % */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Toleransi Risiko (% Modal)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
              />
              <span className="text-xs font-bold text-slate-500 font-mono">%</span>
            </div>
            <span className="text-[10px] text-rose-500 block font-mono">
              Max Rugi: {formatStockPrice(maxRiskMoney, stock.currency)}
            </span>
          </div>

          {/* Harga Beli / Entry */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Harga Beli (Entry Price)
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
            />
            <span className="text-[10px] text-slate-400 block font-mono">
              Saat ini: {formatStockPrice(stock.currentPrice, stock.currency)}
            </span>
          </div>

          {/* Harga Stop Loss */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Harga Stop Loss (SL)
            </label>
            <input
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 focus:outline-rose-500"
            />
            <span className="text-[10px] text-rose-500 block font-mono">
              Jarak SL: {(((entryPrice - stopLossPrice) / entryPrice) * 100).toFixed(1)}%
            </span>
          </div>

          {/* Harga Target / TP */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Target Jual (Take Profit)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 focus:outline-emerald-500"
            />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
              Potensi TP: +{(((targetPrice - entryPrice) / entryPrice) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Results Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Rekomendasi Ukuran Lot */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20">
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 block">
              Ukuran Lot Maksimal Aman
            </span>
            <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {safeLotClamped.toLocaleString('id-ID')} <span className="text-xs font-sans font-semibold">Lot</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block font-mono">
              {actualShares.toLocaleString('id-ID')} lembar saham
            </span>
          </div>

          {/* Modal Terpakai */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Modal Yang Digunakan
            </span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatStockPrice(actualInvested, stock.currency)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Est. Fee Beli (0.15%): {formatStockPrice(actualBuyFee, stock.currency)}
            </span>
          </div>

          {/* Potensi Cuan Bersih */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 block flex items-center justify-between">
              <span>Potensi Cuan (Net Profit)</span>
              <span className="font-mono font-bold">+{profitPercent.toFixed(1)}%</span>
            </span>
            <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              +{formatStockPrice(netProfit, stock.currency)}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
              Sudah dipotong fee beli & fee jual
            </span>
          </div>

          {/* Potensi Rugi Terbatas */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-300 block flex items-center justify-between">
              <span>Maksimal Rugi Jika Kena SL</span>
              <span className="font-mono font-bold">-{lossPercent.toFixed(1)}%</span>
            </span>
            <div className="text-lg font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
              -{formatStockPrice(netLoss, stock.currency)}
            </div>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">
              Terkunci sesuai batas risiko akun
            </span>
          </div>
        </div>

        {/* Risk Reward Ratio Meter */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Risk-to-Reward Ratio (RRR): <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">1 : {rrr.toFixed(2)}</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {rrr >= 2 ? '✅ Rasio Risk/Reward sangat ideal (Minimal 1:2 terpenuhi).' : '⚠️ Rasio Risk/Reward kurang dari 1:2. Disarankan menunggu harga entry yang lebih dekat ke support.'}
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-600 dark:text-slate-300 text-right">
            <span>Per Share: </span>
            <span className="text-emerald-600 font-bold">+{formatStockPrice(potentialPerShareReward, stock.currency)}</span>
            <span> / </span>
            <span className="text-rose-600 font-bold">-{formatStockPrice(potentialPerShareRisk, stock.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
