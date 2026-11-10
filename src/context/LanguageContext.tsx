/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  id: {
    dashboard: 'Ringkasan',
    links: 'Tautan Medsos',
    videos: 'Analitik Vidio',
    trending: 'Tren Populer',
    marketing: 'Pemasaran',
    inventory: 'Produk & Stok',
    behavior: 'Perilaku & Konversi',
    realtime: 'Siapa yang Klik',
    finance: 'Uang Pribadi',
    stocks: 'Analis Saham',
    membership: 'Mode Member',
    affiliate: 'Afiliasi Juara',
    seo: 'SEO & OpenGraph',
    admin: 'Panel Admin',
    createLink: '+ Tambah Tautan',
    totalClicks: 'Total Klik Masuk',
    uniqueVisitors: 'Pengunjung Unik',
    topPlatform: 'Platform Medsos Teratas',
    affiliateBalance: 'Komisi Dapat Ditarik',
    liveRadar: 'Live Traffic Radar Aktif',
    withdrawNow: 'Tarik Saldo Sekarang',
    saveChanges: 'Simpan Perubahan',
    cancel: 'Batal',
  },
  en: {
    dashboard: 'Overview',
    links: 'Social Links',
    videos: 'Video Analytics',
    trending: 'Trending Radar',
    marketing: 'Marketing',
    inventory: 'Product & Stock',
    behavior: 'Conversion Funnel',
    realtime: 'Live Click Stream',
    finance: 'Personal Finance',
    stocks: 'Stock Analysis',
    membership: 'VIP Membership',
    affiliate: 'Affiliate Champions',
    seo: 'SEO & OpenGraph',
    admin: 'Admin Panel',
    createLink: '+ Add Link',
    totalClicks: 'Total Inbound Clicks',
    uniqueVisitors: 'Unique Visitors',
    topPlatform: 'Top Social Platform',
    affiliateBalance: 'Withdrawable Commission',
    liveRadar: 'Live Traffic Radar Active',
    withdrawNow: 'Withdraw Balance Now',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
  },
  zh: {
    dashboard: '概览',
    links: '社交链接',
    videos: '视频分析',
    trending: '热门趋势',
    marketing: '营销归因',
    inventory: '产品与库存',
    behavior: '转化漏斗',
    realtime: '实时点击流',
    finance: '个人财务',
    stocks: '股票分析',
    membership: 'VIP会员',
    affiliate: '联盟佣金',
    seo: 'SEO与开放图谱',
    admin: '管理面板',
    createLink: '+ 添加链接',
    totalClicks: '总点击量',
    uniqueVisitors: '独立访客',
    topPlatform: '热门社交平台',
    affiliateBalance: '可提现佣金',
    liveRadar: '实时流量雷达激活',
    withdrawNow: '立即提现',
    saveChanges: '保存更改',
    cancel: '取消',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['id'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
