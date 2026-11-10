import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Building2,
  Smartphone,
  Wallet
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { isPaymentModalOpen, closePaymentModal, upgradeToMember } = useAuth();
  
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'BSI' | 'BANK_LAIN'>('BSI');
  const [senderName, setSenderName] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPaymentModalOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    upgradeToMember(selectedMethod, refNumber || `REF-${Date.now()}`);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      closePaymentModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePaymentModal}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Aktivasi Keanggotaan Member
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Upgrade ke Member PulseTrack
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Biaya langganan <strong className="text-slate-900 dark:text-white font-mono">Rp 60.000 / bulan</strong>. Akses analitik tak terbatas, peta Google Maps, dan dapatkan komisi afiliasi <strong className="text-emerald-600 font-mono">Rp 10.000</strong> per rujukan!
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pembayaran Berhasil Dikonfirmasi!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Selamat! Akun Anda kini aktif sebagai Member VIP. Seluruh fitur telah terbuka.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            {/* Amount Box */}
            <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium block">
                  Total Biaya Langganan:
                </span>
                <span className="text-2xl font-black font-mono tabular-nums text-indigo-900 dark:text-indigo-100">
                  Rp 60.000
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-normal">/ 30 hari</span>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-lg shadow-2xs">
                Aktivasi Instan
              </span>
            </div>

            {/* Payment Destination Accounts */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Pilih Rekening Tujuan Transfer:
              </label>

              {/* Option 1: BSI */}
              <div 
                onClick={() => setSelectedMethod('BSI')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMethod === 'BSI'
                    ? 'border-indigo-600 bg-white dark:bg-slate-800/90 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      BSI
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        Bank Syariah Indonesia (BSI)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Kode Bank: <strong>451</strong> · A.n PulseTrack Official
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy('7373448995', 'bsi');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    {copiedAccount === 'bsi' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount === 'bsi' ? 'Tersalin' : 'Salin Rek'}</span>
                  </button>
                </div>

                <div className="mt-2 font-mono text-sm font-black text-slate-900 dark:text-slate-100 tracking-wider">
                  7373448995
                </div>
              </div>

              {/* Transfer dari Bank Lain ke BSI */}
              <div 
                onClick={() => setSelectedMethod('BANK_LAIN')}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between ${
                  selectedMethod === 'BANK_LAIN'
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Bisa Transfer dari Bank Mana Saja (BCA, Mandiri, BRI, BNI)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Kode BSI: 451</span>
              </div>
            </div>

            {/* Sender Confirmation Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Nama Pemilik Rekening / Pengirim
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Aisyah Nabila"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  No. Referensi / 4 Digit Terakhir
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="Opsional / No Ref Bank"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Konfirmasi Pembayaran & Aktifkan Member</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
