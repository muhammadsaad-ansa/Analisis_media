/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { LinkManagementView } from './components/LinkManagementView';
import { VideoAnalyticsView } from './components/VideoAnalyticsView';
import { LiveClickStreamView } from './components/LiveClickStreamView';
import { LinkRedirectView } from './components/LinkRedirectView';
import { AuthModal } from './components/AuthModal';
import { CreateLinkModal } from './components/CreateLinkModal';
import { QRCodeModal } from './components/QRCodeModal';
import { PaymentModal } from './components/PaymentModal';
import { PublicLandingView } from './components/PublicLandingView';
import { MembershipView } from './components/MembershipView';
import { AffiliateView } from './components/AffiliateView';
import { FinanceView } from './components/FinanceView';
import { StockAnalysisView } from './components/StockAnalysisView';
import { MarketingAttributionView } from './components/MarketingAttributionView';
import { ProductInventoryView } from './components/ProductInventoryView';
import { ConversionBehaviorView } from './components/ConversionBehaviorView';
import { TrendingRadarView } from './components/TrendingRadarView';
import { ResetAnalyticsModal } from './components/ResetAnalyticsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SeoToolsView } from './components/SeoToolsView';
import { AdminView } from './components/AdminView';
import { FinanceProvider } from './context/FinanceContext';
import { TrafficAlertProvider } from './context/TrafficAlertContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrafficAlertModal } from './components/TrafficAlertModal';
import { EmailAlertPreviewModal } from './components/EmailAlertPreviewModal';
import { SpikeToastNotification } from './components/SpikeToastNotification';
import { TrackedLink } from './types';

function MainApp() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { activeTab, setActiveTab, isResetModalOpen, closeResetModal } = useAnalytics();

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        openLoginModal();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Dual Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pulsetrack_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pulsetrack_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [qrModalLink, setQrModalLink] = useState<TrackedLink | null>(null);

  // URL Parameter Routing for Redirect Testing (/r/:slug or ?r=:slug)
  const [redirectSlug, setRedirectSlug] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const rParam = params.get('r') || params.get('slug');
    if (rParam) return rParam;

    const path = window.location.pathname;
    if (path.startsWith('/r/')) {
      return path.replace('/r/', '');
    }
    return null;
  });

  const handleOpenTestRedirect = (slug: string) => {
    setRedirectSlug(slug);
  };

  const handleReturnToDashboard = () => {
    setRedirectSlug(null);
    setActiveTab('realtime');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        onOpenCreateLink={() => setIsCreateModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {redirectSlug ? (
          <LinkRedirectView
            slug={redirectSlug}
            onReturnToDashboard={handleReturnToDashboard}
          />
        ) : !isAuthenticated ? (
          <PublicLandingView />
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                onOpenCreateLink={() => setIsCreateModalOpen(true)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'links' && (
              <LinkManagementView
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenQrModal={(link) => setQrModalLink(link)}
                onOpenTestRedirect={handleOpenTestRedirect}
              />
            )}

            {activeTab === 'videos' && <VideoAnalyticsView />}

            {activeTab === 'trending' && <TrendingRadarView />}

            {activeTab === 'marketing' && <MarketingAttributionView />}

            {activeTab === 'inventory' && <ProductInventoryView />}

            {activeTab === 'behavior' && <ConversionBehaviorView />}

            {activeTab === 'realtime' && <LiveClickStreamView />}

            {activeTab === 'membership' && <MembershipView />}

            {activeTab === 'affiliate' && <AffiliateView />}

            {activeTab === 'seo' && <SeoToolsView />}

            {activeTab === 'finance' && <FinanceView />}

            {activeTab === 'stocks' && <StockAnalysisView />}

            {activeTab === 'admin' && <AdminView />}
          </>
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-6 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              PulseTrack Analytics
            </span>
            <span>·</span>
            <span>Pemantau Trafik Media Sosial & Video Real-Time</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Mode Member: Rp 60rb/bln</span>
            <span>·</span>
            <span>Komisi Afiliasi: Rp 10rb/member</span>
            <span>·</span>
            <span>Privasi Anonymized IP</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal />
      <PaymentModal />
      <TrafficAlertModal />
      <EmailAlertPreviewModal />
      <SpikeToastNotification />
      <ResetAnalyticsModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
      />
      {isCreateModalOpen && (
        <CreateLinkModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      <QRCodeModal
        link={qrModalLink}
        onClose={() => setQrModalLink(null)}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <TrafficAlertProvider>
          <FinanceProvider>
            <LanguageProvider>
              <MainApp />
            </LanguageProvider>
          </FinanceProvider>
        </TrafficAlertProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}
