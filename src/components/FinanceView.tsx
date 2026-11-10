import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { PersonalTransaction, TransactionType } from '../types';
import { exportFinanceToCSV, exportFinanceToPDF } from '../utils/financeExportUtils';
import { FinanceCharts } from './FinanceCharts';
import { TransactionModal } from './TransactionModal';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Sparkles,
  DollarSign,
  PieChart as PieIcon,
  HelpCircle
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    resetToSampleData, 
    summary 
  } = useFinance();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<PersonalTransaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inDesc = t.description.toLowerCase().includes(q);
        const inCat = t.category.toLowerCase().includes(q);
        const inNotes = (t.notes || '').toLowerCase().includes(q);
        const inMethod = t.paymentMethod.toLowerCase().includes(q);
        const inAmount = t.amount.toString().includes(q);
        if (!inDesc && !inCat && !inNotes && !inMethod && !inAmount) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, methodFilter, searchQuery]);

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: PersonalTransaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (data: Omit<PersonalTransaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setNotification('Catatan transaksi berhasil diperbarui!');
    } else {
      addTransaction(data);
      setNotification(`Transaksi ${data.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${data.amount.toLocaleString('id-ID')} berhasil dicatat!`);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = (id: string, desc: string) => {
    if (confirm(`Hapus catatan transaksi "${desc}"?`)) {
      deleteTransaction(id);
      setNotification('Transaksi berhasil dihapus.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleExportCSV = () => {
    exportFinanceToCSV({
      transactions: filteredTransactions,
      summary,
      user,
      periodLabel: typeFilter === 'all' ? 'Semua Catatan' : typeFilter === 'income' ? 'Pemasukan Saja' : 'Pengeluaran Saja',
    });
    setNotification('Berkas CSV keuangan berhasil diunduh!');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportPDF = () => {
    exportFinanceToPDF({
      transactions: filteredTransactions,
      summary,
      user,
      periodLabel: typeFilter === 'all' ? 'Semua Catatan Keuangan' : typeFilter === 'income' ? 'Laporan Pemasukan' : 'Laporan Pengeluaran',
    });
    setNotification('Laporan PDF keuangan formal berhasil diunduh!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Manajemen Finansial & Pembukuan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Pencatatan Keuangan Pribadi & Bisnis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Catat keterangan, pemasukan, dan pengeluaran harian, kelola rekening (BSI Rek: <strong className="font-mono text-slate-700 dark:text-slate-300">7373448995</strong>, DANA, BCA), serta ekspor laporan CSV dan PDF.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Catat Transaksi Baru</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            title="Ekspor seluruh data transaksi ke spreadsheet Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            title="Unduh laporan pembukuan formal dalam format PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Ekspor PDF</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Kembalikan transaksi ke data sampel default?')) {
                resetToSampleData();
                setNotification('Data transaksi telah direset ke sampel.');
                setTimeout(() => setNotification(null), 3000);
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset ke Data Sampel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Net Cash Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Saldo Bersih (Net Cash)</span>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            Rp {summary.netBalance.toLocaleString('id-ID')}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              summary.netBalance >= 0 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {summary.netBalance >= 0 ? '✓ Arus Kas Positif' : '⚠ Defisit'}
            </span>
            <span className="text-[11px] text-slate-400">Total Akumulasi</span>
          </div>
        </div>

        {/* 2. Total Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Pemasukan</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +Rp {summary.totalIncome.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dari {summary.incomeCount} transaksi masuk (Gaji, Komisi, Bisnis)
          </p>
        </div>

        {/* 3. Total Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Pengeluaran</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400">
            -Rp {summary.totalExpense.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dari {summary.expenseCount} transaksi keluar (Iklan, Operasional, Pribadi)
          </p>
        </div>

        {/* 4. Savings Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Rasio Tabungan (Savings)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {summary.savingsRate}%
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.max(0, summary.savingsRate))}%` }}
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Financial Analytics Interactive Charts */}
      <FinanceCharts />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi berdasarkan keterangan, catatan, kategori, nominal..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Pemasukan</span>
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Pengeluaran</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
          >
            <option value="all">Semua Kategori</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Payment Method Dropdown */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
          >
            <option value="all">Semua Rekening</option>
            <option value="BSI">BSI (Rek: 7373448995)</option>
            <option value="DANA">DANA</option>
            <option value="BCA">BCA</option>
            <option value="Mandiri">Mandiri</option>
            <option value="BRI">BRI</option>
            <option value="Tunai / Cash">Tunai / Cash</option>
            <option value="GoPay">GoPay</option>
            <option value="OVO">OVO</option>
            <option value="Rekening Lain">Rekening Lain</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Catatan Keuangan ({filteredTransactions.length} Transaksi)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian tanggal, kategori, keterangan, rekening, dan jumlah nominal.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {typeFilter !== 'all' ? `Filter: ${typeFilter.toUpperCase()}` : 'Semua Tipe'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-3">Jenis & Kategori</th>
                <th className="py-3 px-4">Keterangan & Catatan</th>
                <th className="py-3 px-3">Rekening / Metode</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Wallet className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        Tidak ada transaksi yang cocok
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Coba bersihkan kata kunci pencarian atau ganti filter kategori/rekening.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Type & Category */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          tx.type === 'income' 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.type === 'income' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {tx.category}
                          </span>
                          <span className={`text-[10px] font-medium uppercase font-mono ${
                            tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                          }`}>
                            {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description & Notes */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {tx.description}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 italic">
                          "{tx.notes}"
                        </div>
                      )}
                    </td>

                    {/* Payment Method / Bank */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <span>{tx.paymentMethod}</span>
                        {tx.paymentMethod === 'BSI' && (
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold ml-0.5">
                            7373448995
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-black text-sm whitespace-nowrap">
                      <span className={tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {tx.type === 'income' ? '+Rp ' : '-Rp '}
                        {tx.amount.toLocaleString('id-ID')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          title="Edit Catatan"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id, tx.description)}
                          title="Hapus Catatan"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />
    </div>
  );
};
