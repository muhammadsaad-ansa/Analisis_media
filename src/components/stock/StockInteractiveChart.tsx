import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { StockProfile, StockDataPoint, ChartDisplayMode, StockTimeframe } from '../../types';
import { formatStockPrice } from '../../services/stockData';
import { TrendingUp, TrendingDown, Layers, BarChart2, Eye, Activity } from 'lucide-react';

interface StockInteractiveChartProps {
  stock: StockProfile;
  data: StockDataPoint[];
  timeframe: StockTimeframe;
  onTimeframeChange: (tf: StockTimeframe) => void;
}

export const StockInteractiveChart: React.FC<StockInteractiveChartProps> = ({
  stock,
  data,
  timeframe,
  onTimeframeChange
}) => {
  const [chartMode, setChartMode] = useState<ChartDisplayMode>('area');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);

  const isPositive = stock.changePercent >= 0;
  const isIdr = stock.currency === 'IDR';

  // Calculate dynamic min and max for price YAxis with a bit of padding
  const prices = data.flatMap(d => [d.low, d.high, d.close, d.open].filter(Boolean));
  const minPrice = prices.length ? Math.min(...prices) : stock.dayLow;
  const maxPrice = prices.length ? Math.max(...prices) : stock.dayHigh;
  const yPadding = (maxPrice - minPrice) * 0.08 || minPrice * 0.02;
  const yDomain: [number, number] = [
    Math.max(0, Math.floor(minPrice - yPadding)),
    Math.ceil(maxPrice + yPadding)
  ];

  const timeframes: { key: StockTimeframe; label: string }[] = [
    { key: '1D', label: '1 Hari' },
    { key: '1W', label: '1 Minggu' },
    { key: '1M', label: '1 Bulan' },
    { key: '3M', label: '3 Bulan' },
    { key: '1Y', label: '1 Tahun' },
    { key: 'ALL', label: 'Semua' }
  ];

  // Custom Candlestick shape for Recharts
  const renderCandlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload || payload.open === undefined || payload.close === undefined) return null;

    const { open, close, high, low } = payload;
    const isBull = close >= open;
    const color = isBull ? '#10b981' : '#f43f5e'; // Emerald vs Rose

    // Scale helpers from Recharts internals
    const yAxis = props.yAxis;
    if (!yAxis || !yAxis.scale) return null;
    const scale = yAxis.scale;

    const yHigh = scale(high);
    const yLow = scale(low);
    const yOpen = scale(open);
    const yClose = scale(close);

    const candleTop = Math.min(yOpen, yClose);
    const candleHeight = Math.max(2, Math.abs(yOpen - yClose));
    const candleWidth = Math.max(4, Math.min(width * 0.7, 14));
    const candleX = x + (width - candleWidth) / 2;
    const wickX = x + width / 2;

    return (
      <g>
        {/* Wick line from High to Low */}
        <line
          x1={wickX}
          y1={yHigh}
          x2={wickX}
          y2={yLow}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.85}
        />
        {/* Body rectangle from Open to Close */}
        <rect
          x={candleX}
          y={candleTop}
          width={candleWidth}
          height={candleHeight}
          fill={isBull ? color : color}
          stroke={color}
          strokeWidth={1}
          rx={1}
        />
      </g>
    );
  };

  // Custom Tooltip
  const CustomPriceTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt: StockDataPoint = payload[0].payload;
    if (!pt) return null;

    const candleDiff = pt.close - pt.open;
    const candlePct = pt.open > 0 ? (candleDiff / pt.open) * 100 : 0;
    const candleUp = candleDiff >= 0;

    return (
      <div className="bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[210px] pointer-events-none">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-medium">
          <span className="text-slate-300">{pt.displayDate}</span>
          <span className={`font-semibold ${candleUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {candleUp ? '+' : ''}{candlePct.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 font-mono">
          <div>
            <span className="text-slate-400">Open: </span>
            <span className="font-semibold text-slate-200">{formatStockPrice(pt.open, stock.currency)}</span>
          </div>
          <div>
            <span className="text-slate-400">Close: </span>
            <span className="font-semibold text-slate-100">{formatStockPrice(pt.close, stock.currency)}</span>
          </div>
          <div>
            <span className="text-slate-400">High: </span>
            <span className="font-semibold text-emerald-400">{formatStockPrice(pt.high, stock.currency)}</span>
          </div>
          <div>
            <span className="text-slate-400">Low: </span>
            <span className="font-semibold text-rose-400">{formatStockPrice(pt.low, stock.currency)}</span>
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Volume:</span>
          <span className="font-semibold text-slate-200">
            {isIdr ? `${Math.round(pt.volume / 100).toLocaleString('id-ID')} Lot` : `${pt.volume.toLocaleString('en-US')} Lembar`}
          </span>
        </div>

        {(showSMA20 || showSMA50) && (
          <div className="pt-1 border-t border-slate-800/60 flex items-center gap-3 text-[10px]">
            {showSMA20 && pt.sma20 && (
              <span className="text-amber-400 font-mono">
                SMA20: {formatStockPrice(pt.sma20, stock.currency)}
              </span>
            )}
            {showSMA50 && pt.sma50 && (
              <span className="text-purple-400 font-mono">
                SMA50: {formatStockPrice(pt.sma50, stock.currency)}
              </span>
            )}
          </div>
        )}

        {showRSI && pt.rsi !== undefined && (
          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
            <span className="text-cyan-400">RSI (14):</span>
            <span className={`font-mono font-bold ${pt.rsi > 70 ? 'text-rose-400' : pt.rsi < 30 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {pt.rsi} {pt.rsi > 70 ? '(Overbought)' : pt.rsi < 30 ? '(Oversold)' : '(Netral)'}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Chart Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        {/* Timeframe switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => onTimeframeChange(tf.key)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf.key
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart View Modes */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setChartMode('area')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              chartMode === 'area'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
          <button
            onClick={() => setChartMode('line')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              chartMode === 'line'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Garis</span>
          </button>
          <button
            onClick={() => setChartMode('candle')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              chartMode === 'candle'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 rotate-90" />
            <span>Candle</span>
          </button>
        </div>

        {/* Indicator Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showSMA20
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowSMA50(!showSMA50)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showSMA50
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showBollinger
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Bollinger
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showVolume
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showRSI
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            RSI (14)
          </button>
          <button
            onClick={() => setShowMACD(!showMACD)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
              showMACD
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            MACD
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="stockAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? '#10b981' : '#f43f5e'}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? '#10b981' : '#f43f5e'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />

            <YAxis
              domain={yDomain}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              orientation="right"
              tickFormatter={(v) => {
                if (isIdr) {
                  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
                  return `${v}`;
                }
                return `$${v}`;
              }}
            />

            <Tooltip content={<CustomPriceTooltip />} />

            {/* Support and Resistance Horizontal Reference Lines */}
            <ReferenceLine
              y={stock.resistanceLevels[0]}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1}
              opacity={0.65}
              label={{
                value: `R1: ${stock.resistanceLevels[0]}`,
                fill: '#f43f5e',
                fontSize: 10,
                position: 'right'
              }}
            />
            <ReferenceLine
              y={stock.supportLevels[0]}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1}
              opacity={0.65}
              label={{
                value: `S1: ${stock.supportLevels[0]}`,
                fill: '#10b981',
                fontSize: 10,
                position: 'right'
              }}
            />

            {/* Bollinger Bands */}
            {showBollinger && (
              <>
                <Line
                  type="monotone"
                  dataKey="upperBand"
                  stroke="#06b6d4"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  dot={false}
                  name="BB Atas"
                />
                <Line
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="#06b6d4"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  dot={false}
                  name="BB Bawah"
                />
              </>
            )}

            {/* SMA lines */}
            {showSMA20 && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#f59e0b"
                strokeWidth={1.8}
                dot={false}
                name="SMA 20"
              />
            )}
            {showSMA50 && (
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#a855f7"
                strokeWidth={1.8}
                dot={false}
                name="SMA 50"
              />
            )}

            {/* Chart Modes */}
            {chartMode === 'area' && (
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#stockAreaGradient)"
                activeDot={{ r: 5, fill: isPositive ? '#10b981' : '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {chartMode === 'line' && (
              <Line
                type="monotone"
                dataKey="close"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth={2.2}
                dot={false}
                activeDot={{ r: 5, fill: isPositive ? '#10b981' : '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {chartMode === 'candle' && (
              <Bar
                dataKey="close"
                shape={renderCandlestick}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Synchronized Volume Sub-chart */}
      {showVolume && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 px-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Volume Transaksi</span>
            <span className="font-mono">
              24 Jam: {isIdr ? `${(stock.volume24h / 100).toLocaleString('id-ID')} Lot` : `${stock.volume24h.toLocaleString('en-US')} Lembar`}
            </span>
          </div>
          <div className="w-full h-18 sm:h-20">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 10, left: 0, bottom: 0 }}>
                <YAxis hide orientation="right" />
                <Bar
                  dataKey="volume"
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const isBull = payload && payload.close >= payload.open;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={Math.max(2, width - 1)}
                        height={height}
                        fill={isBull ? '#10b981' : '#f43f5e'}
                        opacity={0.65}
                        rx={1}
                      />
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RSI Sub-indicator panel */}
      {showRSI && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">RSI (14 Periode)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Overbought: 70 | Oversold: 30
              </span>
            </div>
            <span className="font-mono font-bold text-indigo-500">
              Terbaru: {data.length > 0 ? data[data.length - 1].rsi : 50}
            </span>
          </div>
          <div className="w-full h-20">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 10, left: 0, bottom: 0 }}>
                <YAxis domain={[0, 100]} ticks={[30, 50, 70]} stroke="#64748b" fontSize={9} orientation="right" />
                <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.6} />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" opacity={0.6} />
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="2 2" opacity={0.3} />
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MACD Sub-indicator panel */}
      {showMACD && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 px-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">MACD (12, 26, 9)</span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="text-cyan-500">MACD Line</span>
              <span className="text-amber-500">Signal Line</span>
            </div>
          </div>
          <div className="w-full h-20">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 10, left: 0, bottom: 0 }}>
                <YAxis hide orientation="right" />
                <ReferenceLine y={0} stroke="#94a3b8" opacity={0.3} />
                <Bar
                  dataKey="macdHist"
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const isPositiveHist = payload && payload.macdHist >= 0;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={Math.max(2, width - 1)}
                        height={height}
                        fill={isPositiveHist ? '#10b981' : '#f43f5e'}
                        opacity={0.7}
                      />
                    );
                  }}
                />
                <Line type="monotone" dataKey="macd" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Legend & quick helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Support 1: <strong className="text-slate-800 dark:text-slate-200">{formatStockPrice(stock.supportLevels[0], stock.currency)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Resistance 1: <strong className="text-slate-800 dark:text-slate-200">{formatStockPrice(stock.resistanceLevels[0], stock.currency)}</strong></span>
          </div>
          {showSMA20 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500"></span>
              <span>SMA 20 Periode</span>
            </div>
          )}
          {showSMA50 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-500"></span>
              <span>SMA 50 Periode</span>
            </div>
          )}
        </div>
        <div className="text-[10px] text-slate-400">
          Arahkan kursor ke grafik untuk detail OHLC interaktif
        </div>
      </div>
    </div>
  );
};
