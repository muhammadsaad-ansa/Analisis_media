import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MemberPlan, AffiliateReferral, WithdrawalRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, brandName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  upgradeToMember: (paymentMethod: string, referenceNo: string) => void;
  // Affiliate system
  referrals: AffiliateReferral[];
  withdrawals: WithdrawalRequest[];
  simulateNewAffiliateReferral: (name?: string) => AffiliateReferral;
  requestWithdrawal: (amount: number, method: 'BSI' | 'DANA' | 'BCA' | 'Mandiri' | 'BRI' | 'Bank Lain', account: string, holder: string) => { success: boolean; error?: string };
  deleteWithdrawal: (id: string) => { success: boolean; refundedAmount?: number; error?: string };
  deleteLatestWithdrawal: () => { success: boolean; refundedAmount?: number; error?: string };
  addCommission: (amount?: number) => void;
  // Modal controls
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export const ADMIN_EMAIL = 'nisaad1526@gmail.com';
export const ADMIN_PASSWORD = 'Ansa152026';

export const PERSONAL_ADMIN_USER: User = {
  id: 'usr-admin-nisaad',
  name: 'Nisa Ad',
  email: 'nisaad1526@gmail.com',
  brandName: 'Nisa Studio Official (@nisastudio)',
  avatarUrl: DEFAULT_AVATAR,
  createdAt: '2026-08-01T00:00:00Z',
  plan: 'member',
  role: 'admin',
  isAdmin: true,
  memberExpiresAt: '2099-12-31T23:59:59Z', // Lifetime Super Admin Gratis Seumur Hidup
  affiliateCode: 'ref-nisa',
  affiliateBalance: 150000,
  totalAffiliateEarnings: 150000,
  referredCount: 15,
  referredConversions: 15,
  bankAccount: {
    bankName: 'BSI (Bank Syariah Indonesia)',
    accountNumber: '7373448995',
    accountHolder: 'Nisa Ad',
  },
};

const INITIAL_REFERRALS: AffiliateReferral[] = [
  {
    id: 'ref-01',
    referredName: 'Clarissa Maharani',
    referredEmail: 'clarissa.beauty@gmail.com',
    joinedAt: '2026-10-28T14:20:00Z',
    plan: 'member',
    commissionEarned: 10000,
    status: 'active',
  },
  {
    id: 'ref-02',
    referredName: 'Rizky Fadilah',
    referredEmail: 'rizky.store@outlook.com',
    joinedAt: '2026-10-27T09:15:00Z',
    plan: 'member',
    commissionEarned: 10000,
    status: 'active',
  },
  {
    id: 'ref-03',
    referredName: 'Dinda Permata',
    referredEmail: 'dindamakeup.id@gmail.com',
    joinedAt: '2026-10-25T19:40:00Z',
    plan: 'member',
    commissionEarned: 10000,
    status: 'active',
  },
  {
    id: 'ref-04',
    referredName: 'Fajar Nugraha',
    referredEmail: 'fajarnugraha@gmail.com',
    joinedAt: '2026-10-22T11:05:00Z',
    plan: 'member',
    commissionEarned: 10000,
    status: 'active',
  },
  {
    id: 'ref-05',
    referredName: 'Toko Hijab Surabaya',
    referredEmail: 'admin@hijabsurabaya.com',
    joinedAt: '2026-10-18T16:30:00Z',
    plan: 'member',
    commissionEarned: 10000,
    status: 'active',
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-01',
    amount: 50000,
    targetMethod: 'BSI',
    destinationAccount: '7373448995',
    accountHolder: 'Nisa Ad',
    createdAt: '2026-10-30T10:00:00Z',
    status: 'completed',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Hapus akun demo jika tersimpan di sesi sebelumnya
        if (parsed.id === 'usr-demo-01' || (typeof parsed.id === 'string' && parsed.id.includes('demo'))) {
          localStorage.removeItem('pulsetrack_user');
          return PERSONAL_ADMIN_USER;
        }
        // Jika akun editormyselfizz@gemai.com
        if (parsed.email?.toLowerCase() === 'editormyselfizz@gemai.com') {
          return {
            ...parsed,
            plan: 'member',
            role: 'member',
            isAdmin: false,
          };
        }
        // Jika akun nisaad1526@gmail.com atau admin, pastikan status Super Admin Gratis tetap aktif
        if (parsed.email?.toLowerCase() === 'nisaad1526@gmail.com' || parsed.role === 'admin' || parsed.isAdmin) {
          return {
            ...PERSONAL_ADMIN_USER,
            ...parsed,
            role: 'admin',
            isAdmin: true,
            plan: 'member',
            memberExpiresAt: '2099-12-31T23:59:59Z',
            bankAccount: parsed.bankAccount || PERSONAL_ADMIN_USER.bankAccount,
          };
        }
        return {
          ...parsed,
          plan: parsed.plan || 'member',
          bankAccount: parsed.bankAccount || {
            bankName: 'BSI (Bank Syariah Indonesia)',
            accountNumber: '7373448995',
            accountHolder: parsed.name || 'Member PulseTrack',
          },
        };
      }
      // Akun Admin Pribadi Nisa Ad aktif secara default tanpa bayar sepeser pun
      return PERSONAL_ADMIN_USER;
    } catch {
      return PERSONAL_ADMIN_USER;
    }
  });

  const [referrals, setReferrals] = useState<AffiliateReferral[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_referrals');
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_withdrawals');
      if (saved) {
        const parsed: WithdrawalRequest[] = JSON.parse(saved);
        // Clean out any submissions created in recent test sessions so user's recent submission is removed
        const cleaned = parsed.filter((w) => w.id === 'wd-01');
        return cleaned.length > 0 ? cleaned : INITIAL_WITHDRAWALS;
      }
      return INITIAL_WITHDRAWALS;
    } catch {
      return INITIAL_WITHDRAWALS;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pulsetrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pulsetrack_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pulsetrack_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('pulsetrack_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, error: 'Silakan isi email dan kata sandi.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Kata sandi minimal 6 karakter.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Deteksi Akun Rahasia Gratis Editor
    if (normalizedEmail === 'editormyselfizz@gemai.com') {
      if (cleanPass !== 'myself152026') {
        return { success: false, error: 'Kata sandi salah untuk akun editor.' };
      }
      const editorUser: User = {
        id: 'usr-secret-editor',
        name: 'Editor Myself',
        email: 'editormyselfizz@gemai.com',
        brandName: 'Editor Studio Official',
        avatarUrl: DEFAULT_AVATAR,
        createdAt: new Date().toISOString(),
        plan: 'member',
        role: 'member',
        isAdmin: false, // Tidak bisa akses panel admin
        memberExpiresAt: '2099-12-31T23:59:59Z',
        affiliateCode: 'ref-editor',
        affiliateBalance: 100000,
        totalAffiliateEarnings: 100000,
        referredCount: 10,
        referredConversions: 10,
        bankAccount: {
          bankName: 'BSI (Bank Syariah Indonesia)',
          accountNumber: '7373448995',
          accountHolder: 'Editor Myself',
        },
      };
      setUser(editorUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Deteksi akun Super Admin Pribadi Nisa Ad
    const isAdminEmail = 
      normalizedEmail === ADMIN_EMAIL.toLowerCase() ||
      normalizedEmail === 'nisaad1526' ||
      normalizedEmail === 'nisaad' ||
      normalizedEmail === 'nisa' ||
      normalizedEmail.startsWith('nisaad1526') ||
      normalizedEmail.startsWith('nisaad');

    if (isAdminEmail) {
      // Izinkan Ansa152026 (case-insensitive) atau myself152026 atau admin123
      const isCorrectPassword = 
        cleanPass === ADMIN_PASSWORD ||
        cleanPass.toLowerCase() === ADMIN_PASSWORD.toLowerCase() ||
        cleanPass === 'myself152026' ||
        cleanPass.toLowerCase() === 'myself152026' ||
        cleanPass === 'admin123';

      if (!isCorrectPassword) {
        return { 
          success: false, 
          error: 'Kata sandi salah! Kata sandi akun admin adalah: Ansa152026 (perhatikan huruf besar/kecil).' 
        };
      }

      setUser(PERSONAL_ADMIN_USER);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    const registeredUsers = JSON.parse(localStorage.getItem('pulsetrack_registered_users') || '[]');
    const existing = registeredUsers.find((u: any) => u.email.toLowerCase() === normalizedEmail);

    let loggedUser: User;
    if (existing) {
      if (existing.pass && existing.pass !== pass) {
        return { success: false, error: 'Kata sandi tidak cocok. Silakan periksa kembali.' };
      }
      loggedUser = {
        ...existing,
        avatarUrl: existing.avatarUrl || DEFAULT_AVATAR,
      };
    } else {
      const cleanName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      loggedUser = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: normalizedEmail,
        brandName: `${cleanName} Studio`,
        avatarUrl: DEFAULT_AVATAR,
        createdAt: new Date().toISOString(),
        plan: 'member',
        affiliateCode: `ref-${email.split('@')[0].slice(0, 10)}`,
        affiliateBalance: 0,
        totalAffiliateEarnings: 0,
        referredCount: 0,
        referredConversions: 0,
        bankAccount: {
          bankName: 'BSI (Bank Syariah Indonesia)',
          accountNumber: '7373448995',
          accountHolder: cleanName,
        },
      };
    }

    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string, brandName: string) => {
    if (!name || !email || !pass || !brandName) {
      return { success: false, error: 'Harap lengkapi seluruh formulir pendaftaran.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Format email tidak valid.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Kata sandi harus minimal 6 karakter.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase() || normalizedEmail.includes('nisaad')) {
      return {
        success: false,
        error: 'Email ini dilindungi khusus sebagai Akun Super Admin Utama dan tidak dapat didaftarkan orang lain.'
      };
    }

    const cleanCode = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: normalizedEmail,
      brandName,
      avatarUrl: DEFAULT_AVATAR,
      createdAt: new Date().toISOString(),
      plan: 'member',
      memberExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      affiliateCode: `ref-${cleanCode || 'member'}`,
      affiliateBalance: 0,
      totalAffiliateEarnings: 0,
      referredCount: 0,
      referredConversions: 0,
      bankAccount: {
        bankName: 'BSI (Bank Syariah Indonesia)',
        accountNumber: '7373448995',
        accountHolder: name,
      },
    };

    const registeredUsers = JSON.parse(localStorage.getItem('pulsetrack_registered_users') || '[]');
    registeredUsers.push({ ...newUser, pass });
    localStorage.setItem('pulsetrack_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser: User = {
        ...prev,
        ...updated,
        bankAccount: updated.bankAccount ? { ...prev.bankAccount, ...updated.bankAccount } : prev.bankAccount,
      };
      return updatedUser;
    });
  };

  const upgradeToMember = (paymentMethod: string, referenceNo: string) => {
    if (!user) return;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setUser({
      ...user,
      plan: 'member',
      memberExpiresAt: expires,
    });
    setIsPaymentModalOpen(false);
  };

  // Simulate a new referral member payment (adds Rp 20.000 commission)
  const simulateNewAffiliateReferral = (customName?: string): AffiliateReferral => {
    const sampleNames = ['Rina Anggraini', 'Kevin Pratama', 'Siti Rahmawati', 'Dimas Prasetyo', 'Nabila Putri'];
    const chosenName = customName || sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const cleanMail = chosenName.toLowerCase().replace(/\s+/g, '.') + '@gmail.com';

    const newRef: AffiliateReferral = {
      id: `ref-${Date.now()}`,
      referredName: chosenName,
      referredEmail: cleanMail,
      joinedAt: new Date().toISOString(),
      plan: 'member',
      commissionEarned: 10000, // Komisi Rp 10.000 per pembayaran member
      status: 'active',
    };

    setReferrals((prev) => [newRef, ...prev]);

    // Update user balance: +Rp 10.000
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              affiliateBalance: prev.affiliateBalance + 10000,
              totalAffiliateEarnings: prev.totalAffiliateEarnings + 10000,
              referredCount: prev.referredCount + 1,
              referredConversions: prev.referredConversions + 1,
            }
          : prev
      );
    }

    return newRef;
  };

  const requestWithdrawal = (
    amount: number,
    method: 'BSI' | 'DANA' | 'BCA' | 'Mandiri' | 'BRI' | 'Bank Lain',
    account: string,
    holder: string
  ) => {
    if (!user) return { success: false, error: 'Silakan masuk akun terlebih dahulu.' };
    if (amount <= 0) return { success: false, error: 'Nominal penarikan tidak valid.' };
    if (amount > user.affiliateBalance) {
      return { success: false, error: `Saldo komisi Anda (Rp ${user.affiliateBalance.toLocaleString('id-ID')}) tidak mencukupi.` };
    }
    if (!account || !holder) {
      return { success: false, error: 'Harap lengkapi nomor rekening dan nama pemilik rekening.' };
    }

    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      amount,
      targetMethod: method,
      destinationAccount: account,
      accountHolder: holder,
      createdAt: new Date().toISOString(),
      status: 'completed', // Instant simulation payout
    };

    setWithdrawals((prev) => [newWd, ...prev]);

    // Deduct balance
    setUser((prev) =>
      prev
        ? {
            ...prev,
            affiliateBalance: prev.affiliateBalance - amount,
          }
        : prev
    );

    return { success: true };
  };

  const deleteWithdrawal = (id: string) => {
    const target = withdrawals.find((w) => w.id === id);
    if (!target) return { success: false, error: 'Pengajuan tidak ditemukan.' };

    // Remove from withdrawals
    setWithdrawals((prev) => prev.filter((w) => w.id !== id));

    // Refund amount back to user's affiliate balance
    setUser((prev) =>
      prev
        ? {
            ...prev,
            affiliateBalance: (prev.affiliateBalance || 0) + target.amount,
          }
        : prev
    );

    return { success: true, refundedAmount: target.amount };
  };

  const deleteLatestWithdrawal = () => {
    if (withdrawals.length === 0) return { success: false, error: 'Tidak ada riwayat pengajuan penarikan.' };
    const latest = withdrawals[0];
    return deleteWithdrawal(latest.id);
  };

  const addCommission = (amount: number = 10000) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            affiliateBalance: (prev.affiliateBalance || 0) + amount,
            totalAffiliateEarnings: (prev.totalAffiliateEarnings || 0) + amount,
            referredConversions: (prev.referredConversions || 0) + 1,
          }
        : prev
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isMember: !!user,
        isAdmin: !!(user?.isAdmin || user?.role === 'admin' || user?.email?.toLowerCase() === 'nisaad1526@gmail.com'),
        login,
        register,
        logout,
        updateProfile,
        upgradeToMember,
        referrals,
        withdrawals,
        simulateNewAffiliateReferral,
        requestWithdrawal,
        deleteWithdrawal,
        deleteLatestWithdrawal,
        addCommission,
        isAuthModalOpen,
        authModalMode,
        openLoginModal: () => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        },
        openRegisterModal: () => {
          setAuthModalMode('register');
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        setAuthModalMode,
        isPaymentModalOpen,
        openPaymentModal: () => setIsPaymentModalOpen(true),
        closePaymentModal: () => setIsPaymentModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
