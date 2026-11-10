import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { HOURLY_TRAFFIC_DATA } from '../data/mockData';
import { generatePredictiveTrendData, TrendDataPoint } from '../utils/predictiveData';
import { TimeRangeFilter } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

interface InteractiveChartProps {
  timeRange: TimeRangeFilter;
  onTimeRangeChange: (range: TimeRangeFilter) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  // Chart Display Mode: 'predictive' (7 days past + 7 days forecast) OR 'hourly' (24h breakdown)
  const [chartMode, setChartMode] = useState<'predictive' | 'hourly'>('predictive');
  const [showPredictionLine, setShowPredictionLine] = useState<boolean>(true);
  const [showConfidenceBand, setShowConfidenceBand] = useState<boolean>(true);

  // Generate predictive data
  const { chartData, summary } = useMemo(() => generatePredictiveTrendData(), []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-left shadow-xs space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Analisis Tren & Prediksi Pertumbuhan
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Proyeksi AI 7 Hari
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Grafik Kinerja Trafik & Proyeksi 7 Hari ke Depan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Visualisasi gabungan data klik aktual serta garis tren prediksi pertumbuhan untuk 7 hari mendatang berdasarkan kecepatan konversi tautan medsos Anda.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Chart Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
            <button
              onClick={() => setChartMode('predictive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                chartMode === 'predictive'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prediksi 7 Hari (AI)</span>
            </button>

            <button
              onClick={() => setChartMode('hourly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                chartMode === 'hourly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pola 24 Jam</span>
            </button>
          </div>

          {/* Toggle for prediction line in predictive mode */}
          {chartMode === 'predictive' && (
            <button
              onClick={() => setShowPredictionLine(!showPredictionLine)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                showPredictionLine
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showPredictionLine ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Garis Prediksi: {showPredictionLine ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Forecasting Highlight Banner (Only in Predictive mode) */}
      {chartMode === 'predictive' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 block font-medium">Klik 7 Hari Terakhir:</span>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {summary.historicalTotal.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">Data terverifikasi</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium flex items-center justify-between">
              <span>Proyeksi 7 Hari:</span>
              <span className="text-[10px] font-bold text-emerald-600 font-mono">+{summary.growthPercent}%</span>
            </span>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300 mt-0.5">
              {summary.projectedTotal.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Estimasi klik masa depan</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 block font-medium">Rata-rata Harian Prediksi:</span>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {summary.avgDailyProjected.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">klik / hari</span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 block font-medium flex items-center justify-between">
              <span>Puncak Prediksi:</span>
              <span className="text-[10px] text-indigo-500">Sabtu Weekend</span>
            </span>
            <div className="text-lg font-bold font-mono tabular-nums text-indigo-700 dark:text-indigo-300 mt-0.5">
              {summary.peakProjectedDay.clicks.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
              {summary.peakProjectedDay.day}, {summary.peakProjectedDay.date}
            </span>
          </div>
        </div>
      )}

      {/* Legend & Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 text-xs">
          {/* Actual line indicator */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-indigo-600" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Data Historis Aktual
            </span>
          </div>

          {/* Predictive line indicator */}
          {chartMode === 'predictive' && showPredictionLine && (
            <div className="flex items-center gap-2">
              <span className="w-5 border-t-2 border-dashed border-emerald-500" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Garis Tren Prediktif 7 Hari</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 px-1 rounded text-emerald-800 dark:text-emerald-300">
                  AI
                </span>
              </span>
            </div>
          )}

          {/* Confidence interval */}
          {chartMode === 'predictive' && showPredictionLine && (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300" />
              <span className="text-[11px]">Batas Toleransi (94.6% Confidence)</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Model: Holt-Winters Exponential Smoothing + Social Momentum
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'predictive' ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                {/* Historical Area Gradient */}
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>

                {/* Prediction Range Band Gradient */}
                <linearGradient id="predictionBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94A3B8"
                opacity={0.18}
              />

              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1', opacity: 0.4 }}
              />

              <YAxis
                tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toLocaleString('id-ID')}
              />

              {/* Reference line marking Today */}
              <ReferenceLine
                x={chartData.find((d) => d.notes?.includes('Hari Ini'))?.displayDate}
                stroke="#6366F1"
                strokeDasharray="3 3"
                label={{
                  value: 'Hari Ini ➔ Prediksi',
                  position: 'insideTopLeft',
                  fill: '#6366F1',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              />

              {/* Custom Tooltip */}
              <Tooltip content={<CustomPredictiveTooltip />} />

              {/* Optional Confidence Interval Area */}
              {showPredictionLine && (
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="url(#predictionBandGradient)"
                  connectNulls
                  isAnimationActive={true}
                />
              )}

              {/* Historical Actual Clicks Area */}
              <Area
                type="monotone"
                dataKey="actualClicks"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#actualGradient)"
                connectNulls
                name="Klik Aktual"
                dot={{ r: 3.5, fill: '#4F46E5', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Predictive Trend Line (Dashed) */}
              {showPredictionLine && (
                <Line
                  type="monotone"
                  dataKey="predictedClicks"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  connectNulls
                  name="Proyeksi Pertumbuhan 7 Hari"
                  dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          ) : (
            /* Hourly Breakdown Chart */
            <ComposedChart
              data={HOURLY_TRAFFIC_DATA}
              margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.18} />

              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} tickLine={false} axisLine={false} />

              <Tooltip content={<CustomHourlyTooltip />} />

              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#hourlyGradient)"
                name="Total Klik"
              />
              <Line type="monotone" dataKey="instagram" stroke="#EC4899" strokeWidth={2} dot={false} name="Instagram" />
              <Line type="monotone" dataKey="tiktok" stroke="#06B6D4" strokeWidth={2} dot={false} name="TikTok" />
              <Line type="monotone" dataKey="youtube" stroke="#EF4444" strokeWidth={2} dot={false} name="YouTube" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Rich Custom Tooltip for Predictive Mode
const CustomPredictiveTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data: TrendDataPoint = payload[0].payload;
  const isPred = data.isPrediction;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs space-y-2 min-w-[210px] text-left">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/80">
        <div>
          <span className="font-bold text-white block">
            {data.dayName}, {data.displayDate}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {data.dateKey}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isPred
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
        }`}>
          {isPred ? 'Proyeksi AI' : 'Aktual'}
        </span>
      </div>

      {/* Data Row */}
      {data.actualClicks !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Klik Aktual:</span>
          </span>
          <span className="font-mono font-bold text-indigo-300 tabular-nums text-sm">
            {data.actualClicks.toLocaleString('id-ID')} klik
          </span>
        </div>
      )}

      {data.predictedClicks !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Prediksi Model:</span>
            </span>
            <span className="font-mono font-black text-emerald-400 tabular-nums text-sm">
              {data.predictedClicks.toLocaleString('id-ID')} klik
            </span>
          </div>

          {data.growthPercent !== undefined && data.growthPercent > 0 && (
            <div className="flex items-center justify-between text-[11px] text-emerald-400/90 pt-0.5">
              <span>Pertumbuhan vs Hari Ini:</span>
              <span className="font-bold font-mono">+{data.growthPercent}%</span>
            </div>
          )}

          {data.upperBound && data.lowerBound && (
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60 flex items-center justify-between">
              <span>Rentang Keyakinan:</span>
              <span className="font-mono">{data.lowerBound.toLocaleString('id-ID')} - {data.upperBound.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Tooltip for 24-hour mode
const CustomHourlyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs space-y-1.5 min-w-[190px] text-left">
      <div className="font-bold text-slate-200 pb-1 border-b border-slate-700">
        Pukul {data.hour} WIB
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-300">Total Klik:</span>
        <span className="font-mono font-bold text-indigo-300">{data.clicks}</span>
      </div>
      <div className="flex items-center justify-between text-pink-400">
        <span>Instagram:</span>
        <span className="font-mono">{data.instagram}</span>
      </div>
      <div className="flex items-center justify-between text-cyan-400">
        <span>TikTok:</span>
        <span className="font-mono">{data.tiktok}</span>
      </div>
      <div className="flex items-center justify-between text-rose-400">
        <span>YouTube:</span>
        <span className="font-mono">{data.youtube}</span>
      </div>
    </div>
  );
};
