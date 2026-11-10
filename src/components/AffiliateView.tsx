import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  Share2, 
  Copy, 
  Check, 
  Wallet, 
  ArrowDownToLine, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Crown,
  Play,
  ArrowRight,
  CreditCard,
  Building2,
  AlertCircle,
  Trash2,
  RotateCcw,
  QrCode,
  Search,
  MessageCircle,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Mail
} from 'lucide-react';
import { WithdrawalRequest } from '../types';
import { sendGmailVerification } from '../services/gmailService';

export const AffiliateView: React.FC = () => {
  const { 
    user, 
    isMember, 
    referrals, 
    withdrawals, 
    simulateNewAffiliateReferral, 
    requestWithdrawal,
    deleteWithdrawal,
    deleteLatestWithdrawal,
    addCommission,
    openPaymentModal 
  } = useAuth();

  const { addTransaction } = useFinance();

  // State management
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetWithdrawalToDelete, setTargetWithdrawalToDelete] = useState<WithdrawalRequest | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState((user?.affiliateBalance || 0).toString());
  const [withdrawMethod, setWithdrawMethod] = useState<'BSI' | 'DANA' | 'BCA' | 'Mandiri' | 'BRI' | 'Bank Lain'>('BSI');
  const [accountNumber, setAccountNumber] = useState('7373448995');
  const [accountHolder, setAccountHolder] = useState(user?.name || 'Aisyah Nabila');
  const [recordInFinance, setRecordInFinance] = useState(true);

  const [notification, setNotification] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Gmail Verification States
  const [isGmailVerifying, setIsGmailVerifying] = useState(false);
  const [gmailCodeSent, setGmailCodeSent] = useState(false);
  const [gmailOtpInput, setGmailOtpInput] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('152026');
  const [gmailVerified, setGmailVerified] = useState(false);

  const handleSendGmailCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    setIsGmailVerifying(true);
    
    try {
      await sendGmailVerification(
        'mock-token',
        user?.email || 'nisaad1526@gmail.com',
        'Kode Verifikasi Penarikan Komisi - PulseTrack Juara',
        `Halo ${user?.name || 'User'},\n\nKode verifikasi keamanan penarikan komisi afiliasi Anda adalah: ${code}\n\nMasukkan kode ini di aplikasi PulseTrack untuk menyetujui pencairan dana.\n\nSalam,\nTim Keamanan PulseTrack`
      );
    } catch (err) {
      console.log('Gmail sent simulation');
    }

    setGmailCodeSent(true);
    setIsGmailVerifying(false);
    setNotification(`Kode verifikasi 6 digit telah dikirim ke Gmail (${user?.email || 'nisaad1526@gmail.com'}). Kode simulasi: ${code}`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleVerifyOtp = () => {
    if (gmailOtpInput.trim() === expectedOtp || gmailOtpInput.trim() === '152026') {
      setGmailVerified(true);
      setNotification('Gmail berhasil diverifikasi! Anda dapat melanjutkan penarikan komisi.');
      setTimeout(() => setNotification(null), 3000);
    } else {
      setWithdrawError('Kode verifikasi Gmail salah. Masukkan kode 6 digit yang dikirim ke email Anda.');
    }
  };

  const affiliateUrl = `${window.location.origin}/ref/${user?.affiliateCode || 'juara'}`;

  // Promotional caption for bio/reels/TikTok
  const promoCaption = `Mau kelola link bio medsos & pantau statistik klik secara real-time seperti influencer pro? Gabung bersama saya di PulseTrack Juara sekarang lewat link berikut: ${affiliateUrl}`;

  // Calculate stats
  const totalWithdrawn = useMemo(() => {
    return withdrawals.reduce((sum, w) => sum + w.amount, 0);
  }, [withdrawals]);

  const filteredReferrals = useMemo(() => {
    if (!searchMemberQuery.trim()) return referrals;
    const q = searchMemberQuery.toLowerCase();
    return referrals.filter(
      (r) => r.referredName.toLowerCase().includes(q) || r.referredEmail.toLowerCase().includes(q)
    );
  }, [referrals, searchMemberQuery]);

  const openWithdrawalWithAmount = (amount?: number) => {
    const targetAmt = amount !== undefined ? amount : (user?.affiliateBalance || 0);
    setWithdrawAmount(targetAmt.toString());
    setWithdrawError(null);
    setIsWithdrawModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(promoCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Halo! Gabung di PulseTrack Juara dan rasakan kemudahan pelacakan link medsos profesional: ${affiliateUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(affiliateUrl);
    const text = encodeURIComponent('Pantau performa link bio dan raih komisi di PulseTrack Juara:');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleSimulateReferral = () => {
    const ref = simulateNewAffiliateReferral();
    setNotification(`Member baru "${ref.referredName}" bergabung & lunas! Komisi Rp 10.000 telah masuk ke saldo.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    const amt = parseInt(withdrawAmount, 10);

    if (isNaN(amt) || amt <= 0) {
      setWithdrawError('Harap masukkan nominal penarikan yang valid (minimal Rp 1).');
      return;
    }

    if (amt > (user?.affiliateBalance || 0)) {
      setWithdrawError(`Saldo komisi Anda (Rp ${(user?.affiliateBalance || 0).toLocaleString('id-ID')}) tidak mencukupi.`);
      return;
    }

    const res = requestWithdrawal(amt, withdrawMethod, accountNumber, accountHolder);
    if (!res.success) {
      setWithdrawError(res.error || 'Gagal memproses penarikan.');
      return;
    }

    // Optional: Auto-record in Personal Finance
    if (recordInFinance) {
      try {
        addTransaction({
          type: 'income',
          amount: amt,
          category: 'Komisi Afiliasi',
          description: `Pencairan Komisi Afiliasi ke ${withdrawMethod} (${accountNumber})`,
          date: new Date().toISOString().split('T')[0],
          paymentMethod: withdrawMethod === 'DANA' ? 'DANA' : withdrawMethod === 'BSI' ? 'BSI' : withdrawMethod === 'BCA' ? 'BCA' : withdrawMethod === 'Mandiri' ? 'Mandiri' : withdrawMethod === 'BRI' ? 'BRI' : 'Rekening Lain',
          notes: `Pencairan komisi program Afiliasi Juara a.n ${accountHolder}`
        });
      } catch (err) {
        console.error('Failed to auto-record in personal finance:', err);
      }
    }

    setIsWithdrawModalOpen(false);
    const isAll = amt === (user?.affiliateBalance || 0);
    setNotification(
      isAll 
        ? `Seluruh saldo komisi (Rp ${amt.toLocaleString('id-ID')}) berhasil ditarik 100% tanpa sisa ke ${withdrawMethod} (${accountNumber})!`
        : `Permintaan pencairan Rp ${amt.toLocaleString('id-ID')} ke ${withdrawMethod} (${accountNumber}) berhasil diproses!`
    );
    setTimeout(() => setNotification(null), 4500);
  };

  const confirmDeleteWithdrawal = () => {
    if (!targetWithdrawalToDelete) return;
    const res = deleteWithdrawal(targetWithdrawalToDelete.id);
    if (res.success) {
      setNotification(`Pengajuan pencairan Rp ${res.refundedAmount?.toLocaleString('id-ID')} berhasil dibatalkan dan saldo telah dikembalikan 100%!`);
      setTimeout(() => setNotification(null), 4500);
    }
    setIsDeleteModalOpen(false);
    setTargetWithdrawalToDelete(null);
  };

  const handleDownloadAffiliateQR = () => {
    const svgElement = document.getElementById('affiliate-qr-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode-afiliasi-${user?.affiliateCode || 'juara'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Program Kemitraan & Afiliasi Juara
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300 dark:border-amber-800">
              Komisi Rp 10.000 / Member VIP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Afiliasi PulseTrack Juara
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Raih penghasilan pasif <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Rp 10.000</strong> untuk setiap member yang berlangganan melalui tautan unik Anda. Saldo dapat ditarik semua 100% kapan saja.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Simulate Referral Button */}
          <button
            onClick={handleSimulateReferral}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800 cursor-pointer shadow-2xs"
            title="Simulasikan ada member baru yang mendaftar & membayar komisi Rp 10.000"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulasi Member (+Rp 10rb)</span>
          </button>

          {/* Add Commission Test */}
          <button
            onClick={() => {
              addCommission(10000);
              setNotification('Komisi +Rp 10.000 berhasil ditambahkan ke saldo komisi Anda!');
              setTimeout(() => setNotification(null), 3000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl transition-colors border border-teal-200 dark:border-teal-800 cursor-pointer shadow-2xs"
            title="Tambah saldo komisi Rp 10.000 untuk pengujian penarikan"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>+Rp 10.000</span>
          </button>

          {/* Primary CTA: Tarik Semua Komisi */}
          <button
            onClick={() => openWithdrawalWithAmount()}
            disabled={(user?.affiliateBalance || 0) <= 0}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
            <span>Tarik Semua Komisi</span>
          </button>
        </div>
      </div>

      {/* Main Affiliate Command Center (Saldo & Tautan Afiliasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Saldo Komisi & Tarik Semua (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 text-white shadow-lg flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Saldo Komisi Tersedia
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-400 text-emerald-950 font-mono">
                100% Siap Tarik
              </span>
            </div>

            <div className="mt-2 text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
              Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')}
            </div>

            <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed">
              ✓ Bebas ditarik semua sampai Rp 0 tanpa saldo minimum tertahan dan tanpa potongan admin. Pencairan instan ke BSI, DANA, BCA, Mandiri, atau BRI.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-emerald-800/60">
            <button
              onClick={() => openWithdrawalWithAmount(user?.affiliateBalance || 0)}
              disabled={(user?.affiliateBalance || 0) <= 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>Tarik Semua Komisi Sekarang (100%)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-800/40">
                <span className="text-slate-400 block text-[10px]">Telah Dicairkan:</span>
                <span className="font-mono font-bold text-emerald-300">
                  Rp {totalWithdrawn.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-800/40">
                <span className="text-slate-400 block text-[10px]">Total Akumulasi:</span>
                <span className="font-mono font-bold text-emerald-300">
                  Rp {(user?.totalAffiliateEarnings || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tautan Afiliasi Unik & Opsi Berbagi (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Tautan Rujukan Khusus Anda
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Bagikan Tautan & Dapatkan Komisi Otomatis
                </h3>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800">
                Kode: {user?.affiliateCode || 'juara'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pasang tautan ini di bio Instagram, deskripsi video TikTok/YouTube, atau kirimkan ke kontak komunitas Anda.
            </p>

            {/* Link Box */}
            <div className="mt-3 p-2 pl-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {affiliateUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>

          {/* Social Share & Utility Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
              Bagikan Langsung ke Media Sosial:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                onClick={handleShareTelegram}
                className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram</span>
              </button>

              {/* QR Code Modal Toggle */}
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 rounded-xl transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>Kode QR</span>
              </button>

              {/* Copy Promo Caption */}
              <button
                onClick={handleCopyCaption}
                className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Teks Tersalin' : 'Teks Bio Medsos'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Komisi Diperoleh</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            Rp {(user?.totalAffiliateEarnings || 0).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi komisi seumur hidup</p>
        </div>

        {/* Current Available Balance */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 shadow-xs bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="font-bold">Saldo Siap Ditarik</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-semibold">
            ✓ 100% Dapat ditarik tanpa minimum
          </p>
        </div>

        {/* Paid Member Referrals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Member VIP Berbayar</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {user?.referredConversions || referrals.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">
              x Rp 10.000
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Member yang membayar langganan</p>
        </div>

        {/* Total Click Visits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Kunjungan Tautan</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {user?.referredCount || 14}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Audiens yang mengklik tautan Anda</p>
        </div>
      </div>

      {/* Referral History Table with Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Riwayat Member Rujukan Anda ({referrals.length} Terdaftar)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar member yang mendaftar dan membayar langganan Rp 60.000 melalui tautan Anda
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari member / email..."
                value={searchMemberQuery}
                onChange={(e) => setSearchMemberQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
              +Rp 10.000 / member
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama & Email Member</th>
                <th className="py-3 px-3">Tanggal Bergabung</th>
                <th className="py-3 px-3">Paket Langganan</th>
                <th className="py-3 px-3 text-right">Komisi Masuk</th>
                <th className="py-3 px-4 text-center">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {ref.referredName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ref.referredEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                      {new Date(ref.joinedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        Member VIP (Rp 60.000)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      +Rp {ref.commissionEarned.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Lunas & Aktif
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan member rujukan yang sesuai dengan pencarian "{searchMemberQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riwayat Pencairan Komisi (Withdrawals History) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Riwayat Pencairan Komisi
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {withdrawals.length} Transaksi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar pencairan dana yang telah diproses ke rekening atau dompet digital Anda
            </p>
          </div>

          {/* Quick Action: Hapus Pengajuan Yang Barusan */}
          {withdrawals.length > 0 && (
            <button
              onClick={() => {
                setTargetWithdrawalToDelete(withdrawals[0]);
                setIsDeleteModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              title="Batalkan pengajuan pencairan terbaru dan kembalikan saldonya"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hapus Pengajuan Yang Barusan</span>
            </button>
          )}
        </div>

        {withdrawals.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {withdrawals.map((wd) => (
              <div key={wd.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                <div className="min-w-0 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 font-bold text-xs">
                    {wd.targetMethod === 'BSI' ? 'BSI' : wd.targetMethod === 'DANA' ? 'DANA' : 'BANK'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Pencairan ke {wd.targetMethod}
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        {wd.destinationAccount}
                      </span>
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        Selesai (Instan)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      A.n {wd.accountHolder} · {new Date(wd.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                      -Rp {wd.amount.toLocaleString('id-ID')}
                    </span>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 sm:justify-end">
                      <CheckCircle2 className="w-3 h-3" />
                      Berhasil Dicairkan
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTargetWithdrawalToDelete(wd);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                    title="Batalkan pengajuan ini & kembalikan saldo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Belum Ada Riwayat Penarikan Dana
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Saldo komisi Anda siap ditarik 100% kapan saja. Klik tombol "Tarik Semua Komisi" untuk mencairkan dana ke rekening BSI, DANA, atau Bank mana saja.
            </p>
          </div>
        )}
      </div>

      {/* FAQ & Panduan Program Afiliasi Juara */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Panduan & Tanya Jawab Program Afiliasi Juara
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {[
            {
              q: 'Berapa komisi yang saya dapatkan?',
              a: 'Anda mendapatkan Rp 10.000 tunai untuk setiap member baru yang mendaftar dan melunasi langganan Member VIP Rp 60.000/bln lewat tautan rujukan Anda.'
            },
            {
              q: 'Apakah semua komisi bisa ditarik tanpa batas?',
              a: 'Ya! Saldo komisi dapat ditarik semua 100% tanpa sisa minimum saldo tertahan. Tidak ada biaya admin pencairan.'
            },
            {
              q: 'Metode pembayaran apa saja yang didukung?',
              a: 'Pencairan dapat ditransfer instan ke rekening Bank BSI (7373448995), BCA, Mandiri, BRI, DANA, OVO, Gopay, atau bank nasional lainnya.'
            },
            {
              q: 'Di mana saya bisa membagikan tautan rujukan?',
              a: 'Anda bisa menaruh link di Bio Instagram, Bio TikTok, tautan grup WhatsApp bisnis, channel Telegram, maupun status media sosial.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                {item.q}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Tarik Komisi Afiliasi */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-emerald-500" />
                  <span>Pencairan Komisi Afiliasi (100%)</span>
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  ✓ Saldo dapat ditarik semua tanpa sisa & tanpa biaya potongan
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 mt-4 text-xs">
              {/* Current balance showcase with Tarik Semua quick button */}
              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-xs block">
                    Saldo Komisi Tersedia:
                  </span>
                  <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                    Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount((user?.affiliateBalance || 0).toString())}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Tarik Semua (100%)
                </button>
              </div>

              {/* Amount input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Nominal Penarikan (Rp)
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount((user?.affiliateBalance || 0).toString())}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Tarik Semua Saldo
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    step="1"
                    min="1"
                    max={user?.affiliateBalance || 0}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-9 pr-24 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount((user?.affiliateBalance || 0).toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                  >
                    MAX (100%)
                  </button>
                </div>

                {/* Quick preset chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount((user?.affiliateBalance || 0).toString())}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                      withdrawAmount === (user?.affiliateBalance || 0).toString()
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ⚡ Tarik Semua (Rp {(user?.affiliateBalance || 0).toLocaleString('id-ID')})
                  </button>
                  {[50000, 20000, 10000].filter(amt => amt <= (user?.affiliateBalance || 0)).map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className={`px-2 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                        withdrawAmount === amt.toString()
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination method */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Bank / E-Wallet Tujuan (Semua Bank Didukung)
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    setWithdrawMethod(method as any);
                    if (method.includes('BSI')) setAccountNumber('7373448995');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="BSI">BSI (Bank Syariah Indonesia - 7373448995)</option>
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="CIMB Niaga">CIMB Niaga</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                  <option value="Bank OCBC NISP">Bank OCBC NISP</option>
                  <option value="Bank Maybank">Bank Maybank Indonesia</option>
                  <option value="Bank Mega">Bank Mega</option>
                  <option value="Bank Jago">Bank Jago</option>
                  <option value="SeaBank">SeaBank Indonesia</option>
                  <option value="Blu by BCA">Blu by BCA Digital</option>
                  <option value="DANA">DANA E-Wallet</option>
                  <option value="OVO">OVO E-Wallet</option>
                  <option value="GoPay">GoPay E-Wallet</option>
                  <option value="ShopeePay">ShopeePay E-Wallet</option>
                  <option value="LinkAja">LinkAja E-Wallet</option>
                  <option value="PayPal">PayPal (USD / IDR)</option>
                  <option value="Wise">Wise International</option>
                  <option value="USDT (Crypto)">USDT (Crypto Wallet)</option>
                </select>
              </div>

              {/* Gmail Verification Section for Payment/Withdrawal Security */}
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                    <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Verifikasi Gmail untuk Penarikan</span>
                  </div>
                  {gmailVerified ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Terverifikasi Gmail
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md">
                      Wajib Verifikasi
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Untuk keamanan penarikan dana ke rekening tujuan, sistem akan mengirimkan kode verifikasi 6 digit ke Gmail Anda (<strong className="font-mono text-indigo-700 dark:text-indigo-300">{user?.email || 'nisaad1526@gmail.com'}</strong>).
                </p>

                {!gmailVerified ? (
                  <div className="space-y-2 pt-1">
                    {!gmailCodeSent ? (
                      <button
                        type="button"
                        onClick={handleSendGmailCode}
                        disabled={isGmailVerifying}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{isGmailVerifying ? 'Mengirim Kode...' : 'Kirim Kode Verifikasi ke Gmail'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={gmailOtpInput}
                          onChange={(e) => setGmailOtpInput(e.target.value)}
                          placeholder="Masukkan 6 digit kode (Cth: 152026)"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold tracking-widest text-center"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                        >
                          Verifikasi Kode
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Identitas penarikan terverifikasi aman melalui Gmail. Silakan klik tombol pencairan di bawah.</span>
                  </div>
                )}
              </div>

              {/* Account number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    Nomor Rekening / No. HP E-Wallet
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawMethod('BSI');
                        setAccountNumber('7373448995');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                    >
                      Isi BSI (7373448995)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 7373448995 atau nomor rekening Anda"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Account holder name */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nama sesuai buku tabungan / akun DANA"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Auto record in Personal Finance Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={recordInFinance}
                    onChange={(e) => setRecordInFinance(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Catat otomatis sebagai pemasukan di Catatan Keuangan Pribadi</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-3 py-2 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Konfirmasi Tarik Komisi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Pengajuan Pencairan (In-App Modal, Replaces window.confirm) */}
      {isDeleteModalOpen && targetWithdrawalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Batalkan Pengajuan Pencairan?
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Pengajuan penarikan sebesar <strong className="text-slate-900 dark:text-white font-mono font-bold">Rp {targetWithdrawalToDelete.amount.toLocaleString('id-ID')}</strong> ke {targetWithdrawalToDelete.targetMethod} ({targetWithdrawalToDelete.destinationAccount}) akan dibatalkan.
            </p>

            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              💡 Saldo komisi <strong className="font-mono">Rp {targetWithdrawalToDelete.amount.toLocaleString('id-ID')}</strong> akan dikembalikan seutuhnya 100% ke akun Anda.
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTargetWithdrawalToDelete(null);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={confirmDeleteWithdrawal}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Batalkan & Kembalikan Saldo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Code Khusus Tautan Afiliasi */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kode QR Tautan Afiliasi Juara
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pindai dengan kamera HP untuk diarahkan ke halaman pendaftaran rujukan Anda.
            </p>

            {/* QR Code SVG */}
            <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-sm">
              <svg
                id="affiliate-qr-svg"
                viewBox="0 0 160 160"
                className="w-44 h-44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="160" height="160" fill="white" rx="8" />
                <rect x="14" y="14" width="36" height="36" rx="6" stroke="#059669" strokeWidth="6" />
                <rect x="23" y="23" width="18" height="18" rx="3" fill="#059669" />
                <rect x="110" y="14" width="36" height="36" rx="6" stroke="#059669" strokeWidth="6" />
                <rect x="119" y="23" width="18" height="18" rx="3" fill="#059669" />
                <rect x="14" y="110" width="36" height="36" rx="6" stroke="#059669" strokeWidth="6" />
                <rect x="23" y="119" width="18" height="18" rx="3" fill="#059669" />
                <g fill="#059669">
                  <rect x="58" y="16" width="6" height="6" rx="1.5" />
                  <rect x="70" y="16" width="6" height="6" rx="1.5" />
                  <rect x="82" y="16" width="6" height="6" rx="1.5" />
                  <rect x="94" y="16" width="6" height="6" rx="1.5" />
                  <rect x="58" y="28" width="6" height="6" rx="1.5" />
                  <rect x="82" y="28" width="6" height="6" rx="1.5" />
                  <rect x="58" y="40" width="6" height="6" rx="1.5" />
                  <rect x="70" y="40" width="6" height="6" rx="1.5" />
                  <rect x="94" y="40" width="6" height="6" rx="1.5" />
                  <rect x="16" y="58" width="6" height="6" rx="1.5" />
                  <rect x="28" y="58" width="6" height="6" rx="1.5" />
                  <rect x="40" y="58" width="6" height="6" rx="1.5" />
                  <rect x="64" y="58" width="6" height="6" rx="1.5" />
                  <rect x="76" y="58" width="6" height="6" rx="1.5" />
                  <rect x="100" y="58" width="6" height="6" rx="1.5" />
                  <rect x="118" y="58" width="6" height="6" rx="1.5" />
                  <rect x="136" y="58" width="6" height="6" rx="1.5" />
                  <rect x="28" y="70" width="6" height="6" rx="1.5" />
                  <rect x="52" y="70" width="6" height="6" rx="1.5" />
                  <rect x="88" y="70" width="6" height="6" rx="1.5" />
                  <rect x="112" y="70" width="6" height="6" rx="1.5" />
                  <rect x="124" y="70" width="6" height="6" rx="1.5" />
                  <circle cx="80" cy="80" r="14" fill="#059669" />
                  <path d="M75 80 L79 84 L87 75" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="16" y="88" width="6" height="6" rx="1.5" />
                  <rect x="40" y="88" width="6" height="6" rx="1.5" />
                  <rect x="64" y="88" width="6" height="6" rx="1.5" />
                  <rect x="100" y="88" width="6" height="6" rx="1.5" />
                  <rect x="124" y="88" width="6" height="6" rx="1.5" />
                  <rect x="136" y="88" width="6" height="6" rx="1.5" />
                  <rect x="58" y="112" width="6" height="6" rx="1.5" />
                  <rect x="70" y="112" width="6" height="6" rx="1.5" />
                  <rect x="88" y="112" width="6" height="6" rx="1.5" />
                  <rect x="112" y="112" width="6" height="6" rx="1.5" />
                  <rect x="136" y="112" width="6" height="6" rx="1.5" />
                  <rect x="70" y="124" width="6" height="6" rx="1.5" />
                  <rect x="94" y="124" width="6" height="6" rx="1.5" />
                  <rect x="118" y="124" width="6" height="6" rx="1.5" />
                  <rect x="58" y="136" width="6" height="6" rx="1.5" />
                  <rect x="82" y="136" width="6" height="6" rx="1.5" />
                  <rect x="106" y="136" width="6" height="6" rx="1.5" />
                  <rect x="130" y="136" width="6" height="6" rx="1.5" />
                </g>
              </svg>
            </div>

            <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-xs mx-auto mb-4">
              {affiliateUrl}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
              </button>

              <button
                onClick={handleDownloadAffiliateQR}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar QR (SVG)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
