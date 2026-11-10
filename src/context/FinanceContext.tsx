import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  PersonalTransaction, 
  TransactionType, 
  FinanceSummary,
  IncomeCategory,
  ExpenseCategory,
  FinancePaymentMethod
} from '../types';

interface FinanceContextType {
  transactions: PersonalTransaction[];
  addTransaction: (data: Omit<PersonalTransaction, 'id' | 'createdAt'>) => PersonalTransaction;
  updateTransaction: (id: string, data: Partial<Omit<PersonalTransaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  resetToSampleData: () => void;
  summary: FinanceSummary;
  categoryExpenses: { category: string; amount: number; percentage: number; color: string }[];
  categoryIncomes: { category: string; amount: number; percentage: number; color: string }[];
  monthlyCashflow: { period: string; income: number; expense: number; net: number }[];
}

const INITIAL_SAMPLE_TRANSACTIONS: PersonalTransaction[] = [
  {
    id: 'tx-01',
    type: 'income',
    amount: 6500000,
    category: 'Gaji / Upah',
    description: 'Gaji Bulanan Pekerjaan Tetap & Konten',
    date: '2026-10-28',
    paymentMethod: 'BCA',
    notes: 'Transfer payroll resmi akhir bulan',
    createdAt: '2026-10-28T09:00:00Z',
  },
  {
    id: 'tx-02',
    type: 'income',
    amount: 2450000,
    category: 'Penjualan Online',
    description: 'Hasil Penjualan Produk Glow & Style Studio (@glowandstyle.id)',
    date: '2026-10-29',
    paymentMethod: 'BSI',
    notes: 'Order via link bio Instagram & TikTok',
    createdAt: '2026-10-29T14:30:00Z',
  },
  {
    id: 'tx-03',
    type: 'income',
    amount: 120000,
    category: 'Komisi Afiliasi',
    description: 'Pencairan Komisi Afiliasi PulseTrack Juara (12 Member)',
    date: '2026-10-30',
    paymentMethod: 'DANA',
    notes: 'Tarik 100% semua komisi',
    createdAt: '2026-10-30T11:15:00Z',
  },
  {
    id: 'tx-04',
    type: 'income',
    amount: 1200000,
    category: 'Endorsement / Konten',
    description: 'Sponsor Video Review Produk Skincare di Reels',
    date: '2026-10-25',
    paymentMethod: 'Mandiri',
    notes: 'Kontrak promosi 1 video pendek',
    createdAt: '2026-10-25T16:00:00Z',
  },
  {
    id: 'tx-05',
    type: 'income',
    amount: 800000,
    category: 'Bonus',
    description: 'Bonus Performa Konten Viral TikTok',
    date: '2026-10-22',
    paymentMethod: 'BCA',
    notes: 'Tembus 200k views',
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'tx-06',
    type: 'expense',
    amount: 1150000,
    category: 'Iklan & Operasional Bisnis',
    description: 'Restok Bahan Kemasan & Produk Kosmetik',
    date: '2026-10-29',
    paymentMethod: 'BSI',
    notes: 'Pengadaan stok batch akhir tahun',
    createdAt: '2026-10-29T15:45:00Z',
  },
  {
    id: 'tx-07',
    type: 'expense',
    amount: 450000,
    category: 'Iklan & Operasional Bisnis',
    description: 'Kampanye Iklan Berbayar TikTok Ads & Instagram Boost',
    date: '2026-10-27',
    paymentMethod: 'BCA',
    notes: 'Promosi link pelacak produk promo',
    createdAt: '2026-10-27T18:20:00Z',
  },
  {
    id: 'tx-08',
    type: 'expense',
    amount: 950000,
    category: 'Kebutuhan Pokok',
    description: 'Belanja Kebutuhan Pokok Supermarket & Dapur',
    date: '2026-10-26',
    paymentMethod: 'BSI',
    notes: 'Keperluan sehari-hari',
    createdAt: '2026-10-26T12:00:00Z',
  },
  {
    id: 'tx-09',
    type: 'expense',
    amount: 280000,
    category: 'Makanan & Minuman',
    description: 'Makan Bersama Keluarga & Minuman Kopi',
    date: '2026-10-30',
    paymentMethod: 'DANA',
    notes: 'Santai akhir pekan',
    createdAt: '2026-10-30T19:30:00Z',
  },
  {
    id: 'tx-10',
    type: 'expense',
    amount: 60000,
    category: 'Tagihan & Langganan',
    description: 'Perpanjangan Member VIP PulseTrack (1 Bulan)',
    date: '2026-10-20',
    paymentMethod: 'DANA',
    notes: 'Akses link analitik & afiliasi tak terbatas',
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'tx-11',
    type: 'expense',
    amount: 380000,
    category: 'Tagihan & Langganan',
    description: 'Tagihan Listrik PLN & Internet WiFi Fiber',
    date: '2026-10-24',
    paymentMethod: 'BSI',
    notes: 'Operasional studio & internet rumah',
    createdAt: '2026-10-24T09:30:00Z',
  },
  {
    id: 'tx-12',
    type: 'expense',
    amount: 150000,
    category: 'Transportasi',
    description: 'Bensin Kendaraan & Parkir',
    date: '2026-10-28',
    paymentMethod: 'Tunai / Cash',
    notes: 'Aktivitas pengiriman barang',
    createdAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 'tx-13',
    type: 'expense',
    amount: 275000,
    category: 'Belanja Pribadi',
    description: 'Aksesoris Studio / Mini Tripod & Lampu Ring',
    date: '2026-10-23',
    paymentMethod: 'GoPay',
    notes: 'Alat pembuatan konten video',
    createdAt: '2026-10-23T13:10:00Z',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  // Expense
  'Kebutuhan Pokok': '#3B82F6',
  'Makanan & Minuman': '#F97316',
  'Iklan & Operasional Bisnis': '#8B5CF6',
  'Transportasi': '#EC4899',
  'Tagihan & Langganan': '#EAB308',
  'Belanja Pribadi': '#06B6D4',
  'Hiburan & Liburan': '#10B981',
  'Kesehatan': '#EF4444',
  'Pengeluaran Lainnya': '#64748B',
  // Income
  'Gaji / Upah': '#10B981',
  'Komisi Afiliasi': '#059669',
  'Penjualan Online': '#6366F1',
  'Endorsement / Konten': '#F43F5E',
  'Investasi & Bunga': '#0EA5E9',
  'Bonus': '#D97706',
  'Pemasukan Lainnya': '#64748B',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<PersonalTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_finance_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SAMPLE_TRANSACTIONS;
    } catch {
      return INITIAL_SAMPLE_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('pulsetrack_finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data: Omit<PersonalTransaction, 'id' | 'createdAt'>): PersonalTransaction => {
    const newTx: PersonalTransaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<Omit<PersonalTransaction, 'id' | 'createdAt'>>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
  };

  const resetToSampleData = () => {
    setTransactions(INITIAL_SAMPLE_TRANSACTIONS);
  };

  // Compute summary stats
  const summary = useMemo<FinanceSummary>(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        incomeCount += 1;
      } else {
        totalExpense += tx.amount;
        expenseCount += 1;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Number(((netBalance / totalIncome) * 100).toFixed(1))) : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      transactionCount: transactions.length,
      incomeCount,
      expenseCount,
    };
  }, [transactions]);

  // Compute category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    const totals: Record<string, number> = {};
    let total = 0;

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
        total += t.amount;
      });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[category] || '#6366F1',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Compute category breakdown for incomes
  const categoryIncomes = useMemo(() => {
    const totals: Record<string, number> = {};
    let total = 0;

    transactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
        total += t.amount;
      });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[category] || '#10B981',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Group by date or month for cashflow chart
  const monthlyCashflow = useMemo(() => {
    const groups: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((tx) => {
      // Use YYYY-MM or display date
      const key = tx.date.slice(0, 10);
      if (!groups[key]) {
        groups[key] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        groups[key].income += tx.amount;
      } else {
        groups[key].expense += tx.amount;
      }
    });

    const sortedKeys = Object.keys(groups).sort();
    return sortedKeys.map((k) => {
      // format as readable e.g. "28 Okt"
      const parts = k.split('-');
      const d = parts[2] ? `${parseInt(parts[2], 10)}` : k;
      const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
      const display = `${d} ${mNames[mIdx] || ''}`;

      const inc = groups[k].income;
      const exp = groups[k].expense;
      return {
        period: display,
        income: inc,
        expense: exp,
        net: inc - exp,
      };
    });
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllTransactions,
        resetToSampleData,
        summary,
        categoryExpenses,
        categoryIncomes,
        monthlyCashflow,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
