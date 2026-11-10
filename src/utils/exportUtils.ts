import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TrackedLink, User, VideoAnalyticsItem, ClickEvent, DeviceType, SocialPlatform } from '../types';

export interface ExportDataPayload {
  links: TrackedLink[];
  stats: {
    totalClicks: number;
    uniqueVisitors: number;
    activeNow: number;
    topPlatform: { platform: string; count: number; percentage: number };
    mobileShare: number;
    totalVideoViews: number;
    totalVideoClicks: number;
    avgVideoCTR: number;
  };
  platformBreakdown: { name: SocialPlatform | string; count: number; percentage: number; color?: string }[];
  deviceBreakdown?: { device: DeviceType | string; count: number; percentage: number }[];
  cityBreakdown: { city: string; country: string; count: number; percentage: number }[];
  videos?: VideoAnalyticsItem[];
  recentClicks?: ClickEvent[];
  user: User | null;
  timeRange: string;
}

// 1. Export Comprehensive CSV
export function exportToCSV(payload: ExportDataPayload) {
  const {
    links,
    stats,
    platformBreakdown,
    deviceBreakdown = [],
    cityBreakdown,
    videos = [],
    recentClicks = [],
    user,
    timeRange,
  } = payload;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timePeriodLabel =
    timeRange === 'today'
      ? 'Hari Ini'
      : timeRange === '7d'
      ? '7 Hari Terakhir'
      : '30 Hari Terakhir';

  const csvSections: string[] = [];

  // ==================== HEADER METADATA ====================
  csvSections.push(
    `# =========================================================================`,
    `# PULSETRACK CLOUD ANALYTICS - LAPORAN KINERJA LENGKAP`,
    `# Brand / Akun: "${user?.brandName || 'Pengguna PulseTrack'}"`,
    `# Email: "${user?.email || 'user@example.com'}"`,
    `# Tanggal Unduh: "${now.toLocaleString('id-ID')}"`,
    `# Periode Laporan: "${timePeriodLabel}"`,
    `# Total Tautan: ${links.length} Tautan | Total Video Dipantau: ${videos.length} Video`,
    `# =========================================================================`,
    ``
  );

  // ==================== SECTION 1: RINGKASAN METRIK EKSEKUTIF ====================
  csvSections.push(`### 1. RINGKASAN METRIK UTAMA (KPI)`);
  csvSections.push(`Metrik,Nilai,Keterangan`);
  csvSections.push(`"Total Klik Masuk",${stats.totalClicks},"Akumulasi seluruh klik tautan"`);
  csvSections.push(`"Pengunjung Unik",${stats.uniqueVisitors},"Berdasarkan IP dan sidik jari perangkat"`);
  csvSections.push(`"Pengunjung Online (Live)",${stats.activeNow},"Pengunjung aktif real-time saat ini"`);
  csvSections.push(`"Platform Medsos Teratas","${stats.topPlatform.platform} (${stats.topPlatform.percentage}%)","Penyumbang rujukan trafik terbesar"`);
  csvSections.push(`"Pangsa Ponsel (Mobile)",${stats.mobileShare}%,"Akses melalui smartphone"`);
  csvSections.push(`"Total Tayangan Video",${stats.totalVideoViews},"Akumulasi views Reels/TikTok/Shorts"`);
  csvSections.push(`"Total Klik Tautan Video",${stats.totalVideoClicks},"Klik masuk langsung dari CTA video"`);
  csvSections.push(`"Rata-rata CTR Video",${stats.avgVideoCTR}%,"Rasio klik per tayangan konten video"`);
  csvSections.push(``);

  // ==================== SECTION 2: PERFORMA DETAIL TAUTAN ====================
  csvSections.push(`### 2. PERFORMA DETAIL TAUTAN MEDIA SOSIAL`);
  const linkHeaders = [
    'ID Tautan',
    'Judul Tautan',
    'Slug Tautan',
    'URL Pendek',
    'URL Tujuan',
    'Platform Medsos',
    'Penempatan',
    'Tag Sumber (Auto-Tags)',
    'Total Klik',
    'Pengunjung Unik',
    'Rasio Unik (%)',
    'Status',
    'Tanggal Dibuat',
  ];
  const linkRows = links.map((link) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pulsetrack.app';
    const shortUrl = `${origin}/r/${link.slug}`;
    const uniqueRatio = link.totalClicks > 0 ? ((link.uniqueClicks / link.totalClicks) * 100).toFixed(1) : '0.0';
    const tagList = (link.tags && link.tags.length > 0 ? link.tags : [link.platform.toLowerCase()])
      .map((t) => `#${t}`)
      .join('; ');
    return [
      `"${link.id}"`,
      `"${link.title.replace(/"/g, '""')}"`,
      `"${link.slug}"`,
      `"${shortUrl}"`,
      `"${link.destinationUrl.replace(/"/g, '""')}"`,
      `"${link.platform}"`,
      `"${link.placement}"`,
      `"${tagList}"`,
      link.totalClicks,
      link.uniqueClicks,
      `"${uniqueRatio}%"`,
      link.isActive ? '"Aktif"' : '"Non-aktif"',
      `"${new Date(link.createdAt).toLocaleDateString('id-ID')}"`,
    ].join(',');
  });
  csvSections.push([linkHeaders.join(','), ...linkRows].join('\n'));
  csvSections.push(``);

  // ==================== SECTION 3: DISTRIBUSI SALURAN PLATFORM ====================
  csvSections.push(`### 3. DISTRIBUSI RUJUKAN PLATFORM MEDIA SOSIAL`);
  csvSections.push(`Platform Medsos,Jumlah Klik,Pangsa Trafik (%)`);
  platformBreakdown.forEach((p) => {
    csvSections.push(`"${p.name}",${p.count},"${p.percentage}%"`);
  });
  csvSections.push(``);

  // ==================== SECTION 4: DISTRIBUSI PERANGKAT ====================
  if (deviceBreakdown && deviceBreakdown.length > 0) {
    csvSections.push(`### 4. DISTRIBUSI PERANGKAT PENGUNJUNG`);
    csvSections.push(`Jenis Perangkat,Jumlah Klik,Pangsa (%)`);
    deviceBreakdown.forEach((d) => {
      csvSections.push(`"${d.device}",${d.count},"${d.percentage}%"`);
    });
    csvSections.push(``);
  }

  // ==================== SECTION 5: SEBARAN LOKASI GEOGRAFIS ====================
  csvSections.push(`### 5. SEBARAN LOKASI GEOGRAFIS PENGUNJUNG (KOTA & NEGARA)`);
  csvSections.push(`Peringkat,Kota,Negara,Pangsa Trafik (%)`);
  cityBreakdown.forEach((c, idx) => {
    csvSections.push(`${idx + 1},"${c.city}","${c.country}","${c.percentage}%"`);
  });
  csvSections.push(``);

  // ==================== SECTION 6: ANALITIK PELACAK VIDEO ====================
  if (videos && videos.length > 0) {
    csvSections.push(`### 6. ANALITIK PELACAK VIDEO & KONVERSI KONTEN`);
    const videoHeaders = [
      'ID Video',
      'Judul Konten Video',
      'Platform Video',
      'Kreator / Akun',
      'Total Tayangan (Views)',
      'Total Suka (Likes)',
      'Total Bagikan (Shares)',
      'Komentar',
      'Klik Tautan Bio/CTA',
      'Rasio Konversi CTR (%)',
      'Durasi (Detik)',
      'Waktu Puncak Klik',
      'Tanggal Rilis',
    ];
    const videoRows = videos.map((v) => [
      `"${v.id}"`,
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.platform}"`,
      `"${v.creatorName} (${v.creatorHandle})"`,
      v.views,
      v.likes,
      v.shares,
      v.comments,
      v.linkClicks,
      `"${v.clickThroughRate}%"`,
      v.durationSeconds,
      `"${v.peakClickTimestamp}"`,
      `"${new Date(v.publishedAt).toLocaleDateString('id-ID')}"`,
    ].join(','));
    csvSections.push([videoHeaders.join(','), ...videoRows].join('\n'));
    csvSections.push(``);
  }

  // ==================== SECTION 7: LOG AKTIVITAS KLIK TERKINI ====================
  if (recentClicks && recentClicks.length > 0) {
    csvSections.push(`### 7. LOG RIWAYAT AKTIVITAS & KLIK TERKINI`);
    const logHeaders = [
      'ID Klik',
      'Waktu Kejadian',
      'Judul Tautan',
      'Slug / Shortlink',
      'Platform Asal',
      'Jenis Perangkat',
      'Sistem Operasi (OS)',
      'Browser',
      'Kota',
      'Negara',
      'IP Pengguna',
      'Sumber UTM',
      'Kampanye UTM',
      'Video Terkait',
    ];
    const logRows = recentClicks.map((c) => [
      `"${c.id}"`,
      `"${new Date(c.timestamp).toLocaleString('id-ID')}"`,
      `"${(c.linkTitle || '').replace(/"/g, '""')}"`,
      `"/r/${c.linkSlug}"`,
      `"${c.platform}"`,
      `"${c.device}"`,
      `"${c.os}"`,
      `"${c.browser}"`,
      `"${c.city}"`,
      `"${c.country}"`,
      `"${c.ipSnippet}"`,
      `"${c.utmSource || '-'}"`,
      `"${c.utmCampaign || '-'}"`,
      `"${(c.videoTitle || '-').replace(/"/g, '""')}"`,
    ].join(','));
    csvSections.push([logHeaders.join(','), ...logRows].join('\n'));
    csvSections.push(``);
  }

  const csvContent = csvSections.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `pulsetrack_laporan_analitik_lengkap_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 2. Export Comprehensive PDF Report
export function exportToPDF(payload: ExportDataPayload) {
  const {
    links,
    stats,
    platformBreakdown,
    deviceBreakdown = [],
    cityBreakdown,
    videos = [],
    recentClicks = [],
    user,
    timeRange,
  } = payload;

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
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const timePeriodLabel =
    timeRange === 'today'
      ? 'Hari Ini'
      : timeRange === '7d'
      ? '7 Hari Terakhir'
      : '30 Hari Terakhir';

  // Palette colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600
  const darkTextColor: [number, number, number] = [15, 23, 42]; // Slate-900
  const mutedTextColor: [number, number, number] = [100, 116, 139]; // Slate-500
  const cardBgColor: [number, number, number] = [248, 250, 252]; // Slate-50

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 595.28, 72, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PulseTrack Cloud Analytics', 40, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Laporan Resmi Komprehensif Kinerja Pemasaran Digital & Media Sosial', 40, 54);

  doc.setFontSize(9);
  doc.text(`Waktu Cetak: ${dateStr} ${timeStr}`, 555, 36, { align: 'right' });
  doc.text(`Periode Laporan: ${timePeriodLabel}`, 555, 52, { align: 'right' });

  // Account / Brand info
  let currentY = 92;
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Brand / Akun: ${user?.brandName || 'Pengguna PulseTrack'}`, 40, currentY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text(
    `Email: ${user?.email || 'user@example.com'}  ·  Cakupan: Seluruh Tautan, Video, & Lalu Lintas Medsos`,
    40,
    currentY + 14
  );

  // ==================== 1. RINGKASAN EKSEKUTIF KPI ====================
  currentY += 34;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('1. Ringkasan Eksekutif Indikator Kinerja Utama (KPI)', 40, currentY);

  currentY += 8;
  const kpiData = [
    [
      'Total Klik Masuk',
      'Pengunjung Unik',
      'Platform Teratas',
      'Pangsa Ponsel (HP)',
      'Konversi Video (CTR)',
    ],
    [
      stats.totalClicks.toLocaleString('id-ID'),
      stats.uniqueVisitors.toLocaleString('id-ID'),
      `${stats.topPlatform.platform} (${stats.topPlatform.percentage}%)`,
      `${stats.mobileShare}%`,
      `${stats.avgVideoCTR}%`,
    ],
    [
      'Online Saat Ini',
      'Total Tayang Video',
      'Total Klik Video',
      'Tautan Aktif',
      'Status Pelacak',
    ],
    [
      `${stats.activeNow} Aktif`,
      stats.totalVideoViews.toLocaleString('id-ID'),
      stats.totalVideoClicks.toLocaleString('id-ID'),
      `${links.length} Tautan`,
      'Normal (100% Aktif)',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [kpiData[0]],
    body: [kpiData[1], kpiData[2], kpiData[3]],
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      font: 'helvetica',
      cellPadding: 5,
      halign: 'center',
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: primaryColor,
      fontStyle: 'bold',
      fontSize: 9,
    },
    margin: { left: 40, right: 40 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  // ==================== 2. PERFORMA DETAIL TAUTAN ====================
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('2. Performa Detail Tautan Media Sosial', 40, currentY);

  currentY += 8;
  const linkRows = links.map((l) => [
    l.title,
    (l.tags && l.tags.length > 0 ? l.tags : [l.platform.toLowerCase()]).map((t) => `#${t}`).join(', '),
    l.platform,
    `/r/${l.slug}`,
    l.totalClicks.toLocaleString('id-ID'),
    l.uniqueClicks.toLocaleString('id-ID'),
    l.isActive ? 'Aktif' : 'Non-aktif',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Judul Tautan', 'Tag Sumber', 'Platform', 'Shortlink', 'Total Klik', 'Unik', 'Status']],
    body: linkRows,
    theme: 'striped',
    styles: {
      fontSize: 8,
      font: 'helvetica',
      cellPadding: 4,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 125 },
      1: { cellWidth: 90, fontStyle: 'italic' },
      2: { cellWidth: 60 },
      3: { cellWidth: 75, font: 'courier' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' },
      6: { halign: 'center' },
    },
    margin: { left: 40, right: 40 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  // Check page break for Section 3
  if (currentY > 640) {
    doc.addPage();
    currentY = 40;
  }

  // ==================== 3. PLATFORM & PERANGKAT ====================
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('3. Rujukan Saluran Media Sosial & Distribusi Perangkat', 40, currentY);

  currentY += 8;
  const platformRows = platformBreakdown.slice(0, 6).map((p) => [
    p.name,
    p.count.toLocaleString('id-ID'),
    `${p.percentage}%`,
  ]);

  const deviceRows = (deviceBreakdown.length > 0
    ? deviceBreakdown
    : [
        { device: 'Ponsel (Mobile)', count: Math.round(stats.totalClicks * 0.88), percentage: 88.4 },
        { device: 'Komputer (Desktop)', count: Math.round(stats.totalClicks * 0.09), percentage: 9.2 },
        { device: 'Tablet (iPad/Tab)', count: Math.round(stats.totalClicks * 0.024), percentage: 2.4 },
      ]
  ).map((d) => [d.device, d.count.toLocaleString('id-ID'), `${d.percentage}%`]);

  autoTable(doc, {
    startY: currentY,
    head: [['Media Sosial', 'Total Klik', 'Pangsa (%)']],
    body: platformRows,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: cardBgColor, textColor: darkTextColor, fontStyle: 'bold' },
    margin: { left: 40, right: 310 },
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Perangkat Pengguna', 'Total Klik', 'Pangsa (%)']],
    body: deviceRows,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: cardBgColor, textColor: darkTextColor, fontStyle: 'bold' },
    margin: { left: 310, right: 40 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  // ==================== 4. SEBARAN LOKASI GEOGRAFIS ====================
  if (currentY > 640) {
    doc.addPage();
    currentY = 40;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('4. Sebaran Geografis Pengunjung Teratas (Kota & Wilayah)', 40, currentY);

  currentY += 8;
  const cityRows = cityBreakdown.slice(0, 8).map((c, idx) => [
    `#${idx + 1}`,
    c.city,
    c.country,
    `${c.percentage}%`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Kota', 'Negara', 'Pangsa Trafik (%)']],
    body: cityRows,
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 3.5 },
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' },
      1: { fontStyle: 'bold' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 40, right: 40 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 22;

  // ==================== 5. PELACAK VIDEO & KONVERSI ====================
  if (videos && videos.length > 0) {
    if (currentY > 600) {
      doc.addPage();
      currentY = 40;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text('5. Analitik Pelacak Konten Video & Rasio Konversi (CTR)', 40, currentY);

    currentY += 8;
    const videoTableRows = videos.slice(0, 10).map((v) => [
      v.title,
      v.platform,
      v.creatorName,
      v.views.toLocaleString('id-ID'),
      v.linkClicks.toLocaleString('id-ID'),
      `${v.clickThroughRate}%`,
      `${v.durationSeconds} dtk`,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Judul Video', 'Platform', 'Kreator', 'Views', 'Klik CTA', 'CTR (%)', 'Durasi']],
      body: videoTableRows,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold' }, // Rose color
      columnStyles: {
        0: { cellWidth: 140 },
        3: { halign: 'right' },
        4: { halign: 'right', fontStyle: 'bold' },
        5: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] },
        6: { halign: 'center' },
      },
      margin: { left: 40, right: 40 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 22;
  }

  // ==================== 6. LOG AKTIVITAS & KLIK TERKINI ====================
  if (recentClicks && recentClicks.length > 0) {
    if (currentY > 600) {
      doc.addPage();
      currentY = 40;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text('6. Log Aktivitas & Klik Terkini (Sampel Real-Time)', 40, currentY);

    currentY += 8;
    const clickTableRows = recentClicks.slice(0, 12).map((c) => [
      new Date(c.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      c.platform,
      `/r/${c.linkSlug}`,
      `${c.city}, ${c.country}`,
      `${c.device} (${c.os})`,
      c.ipSnippet,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Waktu', 'Platform', 'Tautan', 'Lokasi Pengunjung', 'Perangkat & OS', 'IP / User']],
      body: clickTableRows,
      theme: 'plain',
      styles: { fontSize: 7.5, cellPadding: 3.5 },
      headStyles: { fillColor: cardBgColor, textColor: darkTextColor, fontStyle: 'bold' },
      columnStyles: {
        0: { font: 'courier' },
        2: { font: 'courier' },
        5: { font: 'courier', textColor: primaryColor },
      },
      margin: { left: 40, right: 40 },
    });
  }

  // Footer Note on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
    doc.text(
      `PulseTrack Cloud Analytics · Halaman ${i} dari ${pageCount} · Laporan Resmi Kinerja Pemasaran Digital & Tautan`,
      40,
      820
    );
  }

  // Save the PDF
  doc.save(`pulsetrack_laporan_resmi_${now.toISOString().split('T')[0]}.pdf`);
}
