import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PersonalTransaction, FinanceSummary, User } from '../types';

export interface FinanceExportOptions {
  transactions: PersonalTransaction[];
  summary: FinanceSummary;
  user: User | null;
  periodLabel?: string;
}

/**
 * 1. Export Personal Finance to CSV
 */
export function exportFinanceToCSV({
  transactions,
  summary,
  user,
  periodLabel = 'Semua Periode',
}: FinanceExportOptions) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const headers = [
    'ID Transaksi',
    'Tanggal Transaksi',
    'Jenis (Tipe)',
    'Nominal (Rp)',
    'Kategori',
    'Keterangan / Deskripsi',
    'Metode / Rekening',
    'Catatan',
  ];

  const rows = transactions.map((tx) => {
    const typeLabel = tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const amountVal = tx.type === 'income' ? tx.amount : -tx.amount;
    return [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${typeLabel}"`,
      amountVal,
      `"${tx.category.replace(/"/g, '""')}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.paymentMethod}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const summaryLines = [
    `# LAPORAN CATATAN KEUANGAN PRIBADI & BISNIS`,
    `# Pemilik: "${user?.name || 'Aisyah Nabila'}" (${user?.email || 'nisaad1526@gmail.com'})`,
    `# Brand: "${user?.brandName || 'Glow & Style Studio'}"`,
    `# Tanggal Unduh: ${now.toLocaleString('id-ID')}`,
    `# Periode: ${periodLabel}`,
    `# Total Pemasukan: Rp ${summary.totalIncome.toLocaleString('id-ID')}`,
    `# Total Pengeluaran: Rp ${summary.totalExpense.toLocaleString('id-ID')}`,
    `# Saldo Bersih: Rp ${summary.netBalance.toLocaleString('id-ID')}`,
    `# Rasio Tabungan: ${summary.savingsRate}%`,
    `# Total Transaksi: ${transactions.length} (${summary.incomeCount} Pemasukan, ${summary.expenseCount} Pengeluaran)`,
    ``,
  ];

  const csvContent = summaryLines.join('\n') + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', url);
  downloadLink.setAttribute('download', `laporan_keuangan_pribadi_${dateStr}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * 2. Export Personal Finance to PDF
 */
export function exportFinanceToPDF({
  transactions,
  summary,
  user,
  periodLabel = 'Semua Transaksi',
}: FinanceExportOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Top Accent Header Bar
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, doc.internal.pageSize.width, 10, 'F');

  // Title and Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('LAPORAN KEUANGAN PRIBADI & BISNIS', 40, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(
    `PulseTrack Financial Ledger · Periode: ${periodLabel} · Dicetak pada ${dateStr}`,
    40,
    64
  );

  // User details block
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, 78, doc.internal.pageSize.width - 80, 52, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Akun: ${user?.name || 'Aisyah Nabila'}`, 55, 96);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Email: ${user?.email || 'nisaad1526@gmail.com'}`, 55, 110);
  doc.text(`Brand / Usaha: ${user?.brandName || 'Glow & Style Studio'}`, 55, 122);

  doc.setFont('helvetica', 'bold');
  doc.text(`Status Member:`, doc.internal.pageSize.width - 200, 96);
  doc.setTextColor(16, 185, 129);
  doc.text(`VIP AKTIF`, doc.internal.pageSize.width - 120, 96);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Catatan: ${transactions.length} baris`, doc.internal.pageSize.width - 200, 112);

  // Summary KPI Cards (4 columns)
  const cardY = 142;
  const cardW = (doc.internal.pageSize.width - 80 - 24) / 4;
  const cardH = 50;

  // 1. Saldo Bersih
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40, cardY, cardW, cardH, 5, 5, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('SALDO BERSIH', 48, cardY + 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(summary.netBalance >= 0 ? 16 : 225, summary.netBalance >= 0 ? 185 : 29, summary.netBalance >= 0 ? 129 : 72);
  doc.text(`Rp ${summary.netBalance.toLocaleString('id-ID')}`, 48, cardY + 34);

  // 2. Total Pemasukan
  const c2X = 40 + cardW + 8;
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(c2X, cardY, cardW, cardH, 5, 5, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('TOTAL PEMASUKAN', c2X + 8, cardY + 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${summary.totalIncome.toLocaleString('id-ID')}`, c2X + 8, cardY + 34);

  // 3. Total Pengeluaran
  const c3X = c2X + cardW + 8;
  doc.setFillColor(255, 241, 242);
  doc.roundedRect(c3X, cardY, cardW, cardH, 5, 5, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(225, 29, 72);
  doc.text('TOTAL PENGELUARAN', c3X + 8, cardY + 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${summary.totalExpense.toLocaleString('id-ID')}`, c3X + 8, cardY + 34);

  // 4. Rasio Tabungan
  const c4X = c3X + cardW + 8;
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(c4X, cardY, cardW, cardH, 5, 5, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('RASIO TABUNGAN', c4X + 8, cardY + 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${summary.savingsRate}%`, c4X + 8, cardY + 34);

  // Transactions Table
  const tableData = transactions.map((t) => [
    t.date,
    t.type === 'income' ? '+ Pemasukan' : '- Pengeluaran',
    t.category,
    t.description,
    t.paymentMethod,
    t.type === 'income'
      ? `+Rp ${t.amount.toLocaleString('id-ID')}`
      : `-Rp ${t.amount.toLocaleString('id-ID')}`,
  ]);

  autoTable(doc, {
    startY: 206,
    head: [['Tanggal', 'Jenis', 'Kategori', 'Keterangan & Catatan', 'Rekening / Metode', 'Nominal']],
    body: tableData,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 70 },
      2: { cellWidth: 90 },
      3: { cellWidth: 140 },
      4: { cellWidth: 80 },
      5: { cellWidth: 75, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Highlight income in emerald and expense in rose
      if (data.section === 'body') {
        if (data.column.index === 1 || data.column.index === 5) {
          const raw = String(data.cell.raw || '');
          if (raw.includes('+')) {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (raw.includes('-')) {
            data.cell.styles.textColor = [225, 29, 72];
          }
        }
      }
    },
    foot: [
      [
        'Total',
        `${summary.incomeCount} In / ${summary.expenseCount} Out`,
        '-',
        'Rekap Arus Kas Bersih',
        'Saldo Akhir',
        `Rp ${summary.netBalance.toLocaleString('id-ID')}`,
      ],
    ],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `PulseTrack Personal Finance System · Halaman ${i} dari ${pageCount}`,
      40,
      doc.internal.pageSize.height - 20
    );
    doc.text(
      'Dokumen ini dibuat otomatis dan dapat digunakan sebagai pembukuan resmi.',
      doc.internal.pageSize.width - 280,
      doc.internal.pageSize.height - 20
    );
  }

  const fileDate = now.toISOString().split('T')[0];
  doc.save(`laporan_keuangan_pribadi_${fileDate}.pdf`);
}
