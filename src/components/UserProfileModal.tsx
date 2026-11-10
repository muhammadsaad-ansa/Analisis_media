/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Crown, Image as ImageIcon, CheckCircle2, X, Wallet, Mail, User as UserIcon, Store } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [brandName, setBrandName] = useState(user?.brandName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bankName, setBankName] = useState(user?.bankAccount?.bankName || 'BSI (Bank Syariah Indonesia)');
  const [accountNumber, setAccountNumber] = useState(user?.bankAccount?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(user?.bankAccount?.accountHolder || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handler for gallery file selection
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih berkas gambar yang valid (JPG, PNG, WebP).');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultString = event.target.result as string;
          setAvatarUrl(resultString);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      brandName,
      email,
      avatarUrl,
      bankAccount: {
        bankName,
        accountNumber,
        accountHolder: accountHolder || name,
      },
    });

    setSuccessMessage('Profil berhasil diperbarui!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pengaturan Profil Pengguna
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola informasi akun & foto galeri Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-left text-xs">
          
          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Profile Picture & Gallery Picker */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Foto Profil Akun</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pilih foto baru dari galeri perangkat Anda untuk memperbarui avatar.
                </p>
              </div>

              {/* Hidden file input directed to gallery */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleGallerySelect}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto sm:mx-0"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Pilih Foto dari Galeri</span>
              </button>
            </div>
          </div>

          {/* User Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nama Brand / Toko / Handle
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: @nisa.studio"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Alamat Email (Akun)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              placeholder="nama@email.com"
            />
          </div>

          {/* Bank Account Section for Affiliate & Withdrawal */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold text-slate-900 dark:text-white">Rekening Penarikan Afiliasi (BSI / DANA / BCA)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nama Bank / E-Wallet
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="BSI (Bank Syariah Indonesia)">BSI (Bank Syariah Indonesia - 7373448995)</option>
                  <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="BRI (Bank Rakyat Indonesia)">BRI (Bank Rakyat Indonesia)</option>
                  <option value="BNI (Bank Negara Indonesia)">BNI (Bank Negara Indonesia)</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="CIMB Niaga">CIMB Niaga</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                  <option value="Bank OCBC NISP">Bank OCBC NISP</option>
                  <option value="Bank Maybank Indonesia">Bank Maybank Indonesia</option>
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

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nomor Rekening / No. HP DANA
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 7373448995"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Nama Pemilik Rekening sesuai KTP
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Nama lengkap pemilik rekening"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
