import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers,
  Sparkles,
  Wallet
} from 'lucide-react';

export const FinanceCharts: React.FC = () => {
  const { monthlyCashflow, categoryExpenses, categoryIncomes, summary } = useFinance();
  const [activeChartTab, setActiveChartTab] = useState<'cashflow' | 'category'>('cashflow');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-left shadow-xs space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Analitik Grafik Keuangan Pribadi
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Visualisasi Arus Kas & Sebaran Kategori Pengeluaran
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau perbandingan pemasukan vs pengeluaran dan identifikasi kategori belanja terbesar.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveChartTab('cashflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeChartTab === 'cashflow'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tren Arus Kas</span>
          </button>

          <button
            onClick={() => setActiveChartTab('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeChartTab === 'category'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Kategori Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {activeChartTab === 'cashflow' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span>Total Pemasukan: <strong>Rp {summary.totalIncome.toLocaleString('id-ID')}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-3 h-3 rounded-md bg-rose-500 inline-block" />
              <span>Total Pengeluaran: <strong>Rp {summary.totalExpense.toLocaleString('id-ID')}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-3 rounded-md bg-indigo-500 inline-block" />
              <span>Arus Kas Bersih: <strong>Rp {summary.netBalance.toLocaleString('id-ID')}</strong></span>
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyCashflow}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.18} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#CBD5E1', opacity: 0.4 }} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toLocaleString('id-ID')}k`} 
                />
                <Tooltip content={<CustomCashflowTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-semibold">{value}</span>}
                />
                <Bar 
                  dataKey="income" 
                  name="Pemasukan" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={32} 
                />
                <Bar 
                  dataKey="expense" 
                  name="Pengeluaran" 
                  fill="#F43F5E" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={32} 
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  name="Saldo Bersih" 
                  stroke="#6366F1" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#6366F1' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Category Breakdown View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Proporsi Kategori Pengeluaran
            </h4>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400">Total Pengeluaran Terdistribusi:</span>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                Rp {summary.totalExpense.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Category List & Progress Bars */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Peringkat Pengeluaran Terbesar</span>
              <span className="text-[10px] text-slate-400 font-normal">Persentase</span>
            </h4>

            {categoryExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada data pengeluaran.</p>
            ) : (
              categoryExpenses.slice(0, 6).map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.category}</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rp {item.amount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomCashflowTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs space-y-1.5 min-w-[200px] text-left">
      <div className="font-bold text-white pb-1 border-b border-slate-700/80">
        Periode: {label}
      </div>
      {payload.map((item: any) => (
        <div key={item.name} className="flex items-center justify-between gap-3 text-[11px]">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}:</span>
          </span>
          <span className="font-mono font-bold text-white">
            Rp {(item.value || 0).toLocaleString('id-ID')}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white p-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs text-left">
      <span className="font-bold text-white block">{data.category}</span>
      <div className="font-mono text-emerald-400 font-bold mt-0.5">
        Rp {data.amount.toLocaleString('id-ID')} ({data.percentage}%)
      </div>
    </div>
  );
};
