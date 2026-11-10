export type SocialPlatform = 
  | 'Instagram'
  | 'TikTok'
  | 'X (Twitter)'
  | 'WhatsApp'
  | 'Facebook'
  | 'YouTube'
  | 'LinkedIn'
  | 'Threads'
  | 'Direct';

export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';

export type MemberPlan = 'free' | 'member';
export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  brandName: string;
  avatarUrl?: string;
  createdAt: string;
  plan: MemberPlan;
  role?: UserRole;
  isAdmin?: boolean;
  memberExpiresAt?: string;
  affiliateCode: string;
  affiliateBalance: number;
  totalAffiliateEarnings: number;
  referredCount: number;
  referredConversions: number;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface TrackedLink {
  id: string;
  slug: string;
  title: string;
  destinationUrl: string;
  platform: SocialPlatform;
  placement: string;
  utmCampaign: string;
  utmMedium?: string;
  createdAt: string;
  totalClicks: number;
  uniqueClicks: number;
  isActive: boolean;
  linkedVideoId?: string;
  tags?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}

export interface VideoAnalyticsItem {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts' | 'Facebook Reels' | 'X Video';
  videoUrl: string;
  creatorName: string;
  creatorHandle: string;
  thumbnailGradient: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  linkClicks: number;
  clickThroughRate: number;
  peakClickTimestamp: string;
  durationSeconds: number;
  dropOffRate: number;
  trackedLinkId: string;
  publishedAt: string;
  clickSpikes: { second: number; clicks: number }[];
}

export interface ClickEvent {
  id: string;
  linkId: string;
  linkSlug: string;
  linkTitle: string;
  timestamp: string;
  platform: SocialPlatform;
  device: DeviceType;
  os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux';
  browser: string;
  country: string;
  countryCode: string;
  city: string;
  ipSnippet: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  destinationUrl: string;
  videoSourceId?: string;
  videoTitle?: string;
}

export interface AffiliateReferral {
  id: string;
  referredName: string;
  referredEmail: string;
  joinedAt: string;
  plan: MemberPlan;
  commissionEarned: number; // Rp 10.000 per member payment
  status: 'active' | 'pending' | 'withdrawn';
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  targetMethod: string;
  destinationAccount: string;
  accountHolder: string;
  createdAt: string;
  status: 'completed' | 'processing';
}

export type TimeRangeFilter = 'today' | '7d' | '30d' | 'all';
export type ActiveTab = 
  | 'overview' 
  | 'links' 
  | 'videos' 
  | 'trending' 
  | 'marketing' 
  | 'inventory' 
  | 'behavior' 
  | 'realtime' 
  | 'finance' 
  | 'stocks' 
  | 'simulator' 
  | 'membership' 
  | 'affiliate' 
  | 'seo'
  | 'admin';

// ================= STOCK ANALYSIS TYPES =================
export type StockCurrency = 'IDR' | 'USD';
export type StockSector = 'Perbankan' | 'Teknologi' | 'Consumer Goods' | 'Energi & Tambang' | 'Telekomunikasi' | 'Konglomerasi' | 'Global Tech';

export interface OrderBookLevel {
  price: number;
  lots: number;
  orders: number;
}

export interface StockOrderBook {
  bids: OrderBookLevel[];
  offers: OrderBookLevel[];
  totalBidLots: number;
  totalOfferLots: number;
  bidPowerPercent: number; // percentage (0-100)
}

export interface BrokerTransaction {
  code: string;
  name: string;
  type: 'Asing' | 'Domestik';
  lots: number;
  avgPrice: number;
  value: number; // in Millions IDR or Thousands USD
}

export interface StockBandarmology {
  phase: 'Akumulasi Masif' | 'Akumulasi Normal' | 'Netral / Konsolidasi' | 'Distribusi Normal' | 'Distribusi Masif';
  phaseScore: number; // 0 - 100
  whaleParticipationPercent: number; // Big player presence %
  topBuyers: BrokerTransaction[];
  topSellers: BrokerTransaction[];
  buyerConcentration: number; // % top 3 buyers of total
  sellerConcentration: number;
  netForeignToday: number; // in IDR Billions or USD Millions
  netForeign5D: number;
  netForeign20D: number;
  foreignOwnershipPercent: number;
  foreignFlowHistory: { date: string; netForeign: number; price: number }[];
}

export interface FinancialYearData {
  year: number;
  period: string; // e.g., 'FY 2024', 'FY 2023'
  revenue: number; // in Triliun IDR or Billion USD
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  eps: number;
  operatingCashFlow: number;
  totalAssets: number;
  totalDebt: number;
  totalEquity: number;
}

export interface StockFinancialRatios {
  // Profitabilitas
  roe: number;
  roa: number;
  gpm: number;
  opm: number;
  npm: number;
  // Solvabilitas & Likuiditas
  der: number; // Debt to Equity
  currentRatio: number;
  quickRatio: number;
  interestCoverage: number;
  // Valuasi & Per Saham
  peRatio: number;
  pbvRatio: number;
  evEbitda: number;
  pegRatio: number;
  priceToSales: number;
  bvps: number; // Book Value Per Share
  // Scores
  piotroskiFScore: number; // 0-9
  piotroskiAssessment: string;
  altmanZScore: number;
  altmanZone: 'Aman (Safe Zone)' | 'Abu-Abu (Grey Zone)' | 'Waspada (Distress Zone)';
  // Sektor Pembanding
  sectorPeAverage: number;
  sectorPbvAverage: number;
  sectorRoeAverage: number;
}

export interface StockValuationModels {
  grahamNumber: number;
  dcfFairValue: number;
  peBandMean: number;
  peBandHigh: number;
  peBandLow: number;
  pbvBandMean: number;
  averageFairValue: number;
  marginOfSafetyPercent: number;
  status: 'Undervalued (Diskon Murah)' | 'Fair Value (Wajar)' | 'Overvalued (Kemahalan)';
  assumptions: {
    growthRate: number; // %
    discountRate: number; // %
    terminalRate: number; // %
  };
}

export interface StockDividendItem {
  year: number;
  exDate: string;
  paymentDate: string;
  dps: number; // Dividen per lembar
  yieldPercent: number;
  payoutRatio: number; // % of net profit
}

export interface StockCorporateAction {
  title: string;
  type: 'RUPS' | 'Dividen' | 'Stock Split' | 'Right Issue' | 'Paparan Publik';
  date: string;
  notes: string;
  status: 'Akan Datang' | 'Selesai';
}

export interface StockTechnicalSignal {
  indicator: string;
  value: string;
  signal: 'Sangat Beli' | 'Beli' | 'Netral' | 'Jual' | 'Sangat Jual';
  description: string;
}

export interface StockPivotPoints {
  classical: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
  fibonacci: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface StockNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'Positif' | 'Netral' | 'Waspada';
  snippet: string;
  category: string;
}

export interface StockTradePlan {
  entryZone: [number, number];
  target1: number;
  target2: number;
  stopLoss: number;
  riskRewardRatio: string;
  strategyName: string;
  thesis: string;
}

export interface StockProfile {
  ticker: string;
  name: string;
  exchange: 'IDX' | 'NASDAQ' | 'NYSE';
  sector: StockSector;
  currency: StockCurrency;
  currentPrice: number;
  changePrice: number;
  changePercent: number;
  previousClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  volume24h: number;
  marketCap: number; // in IDR (Triliun) or USD (Billion)
  peRatio: number;
  pbvRatio: number;
  dividendYield: number; // percentage
  roe: number; // percentage
  week52High: number;
  week52Low: number;
  consensusTarget: number;
  analystRating: 'Sangat Beli' | 'Beli' | 'Netral' | 'Jual';
  analystScore: number; // 1 to 5 (e.g. 4.6)
  supportLevels: [number, number];
  resistanceLevels: [number, number];
  description: string;
  summaryReason: string;
  lotSize: number; // 100 for IDX, 1 for US
  // Extended analysis features
  orderBook?: StockOrderBook;
  bandarmology?: StockBandarmology;
  financialHistory?: FinancialYearData[];
  detailedRatios?: StockFinancialRatios;
  valuation?: StockValuationModels;
  dividends?: StockDividendItem[];
  dividendStreakYears?: number;
  corporateActions?: StockCorporateAction[];
  technicalSignals?: StockTechnicalSignal[];
  pivotPoints?: StockPivotPoints;
  news?: StockNewsItem[];
  tradePlan?: StockTradePlan;
}

export interface StockDataPoint {
  date: string;
  displayDate: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  upperBand?: number;
  lowerBand?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
}

export type StockTimeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
export type ChartDisplayMode = 'area' | 'line' | 'candle';

// ================= PERSONAL FINANCE TYPES =================
export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 
  | 'Gaji / Upah'
  | 'Komisi Afiliasi'
  | 'Penjualan Online'
  | 'Endorsement / Konten'
  | 'Investasi & Bunga'
  | 'Bonus'
  | 'Pemasukan Lainnya';

export type ExpenseCategory = 
  | 'Kebutuhan Pokok'
  | 'Makanan & Minuman'
  | 'Iklan & Operasional Bisnis'
  | 'Transportasi'
  | 'Tagihan & Langganan'
  | 'Belanja Pribadi'
  | 'Hiburan & Liburan'
  | 'Kesehatan'
  | 'Pengeluaran Lainnya';

export type FinancePaymentMethod = 
  | 'Tunai / Cash'
  | 'DANA'
  | 'BSI'
  | 'BCA'
  | 'Mandiri'
  | 'BRI'
  | 'OVO'
  | 'GoPay'
  | 'Rekening Lain';

export interface PersonalTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD or ISO
  paymentMethod: FinancePaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

// ================= TRAFFIC SPIKE & NOTIFICATION ALERT TYPES =================
export type SpikeWindowMinutes = 1 | 5 | 15 | 30 | 60;

export interface TrafficAlertRule {
  id: string;
  name: string;
  linkId: string; // 'all' for all tracked links or specific link id
  linkTitle?: string;
  thresholdClicks: number; // e.g. 20 clicks
  timeWindowMinutes: SpikeWindowMinutes; // 1, 5, 15, 30, or 60 minutes
  enableBrowserPush: boolean;
  enableEmail: boolean;
  recipientEmail: string;
  cooldownMinutes: number; // minimum minutes between duplicate alerts for the same link
  isActive: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
}

export interface SpikeIncident {
  id: string;
  ruleId: string;
  ruleName: string;
  linkId: string;
  linkTitle: string;
  linkSlug: string;
  clickCount: number;
  thresholdClicks: number;
  timeWindowMinutes: number;
  triggeredAt: string;
  channelsNotified: ('browser' | 'email')[];
  recipientEmail?: string;
  isRead: boolean;
  surgeVelocity?: string;
}

export interface EmailAlertData {
  recipient: string;
  subject: string;
  linkTitle: string;
  linkSlug: string;
  destinationUrl: string;
  clickCount: number;
  timeWindowMinutes: number;
  thresholdClicks: number;
  triggeredAt: string;
  ruleName: string;
  topPlatform?: string;
  topLocation?: string;
}

// ================= 1. MARKETING ATTRIBUTION TYPES =================
export type AttributionModelType = 
  | 'first_touch' 
  | 'last_touch' 
  | 'linear' 
  | 'time_decay' 
  | 'position_based';

export interface AttributionMetricGroup {
  conversions: number;
  revenue: number; // in IDR
  roas: number;
  cac: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: SocialPlatform | 'Meta Ads' | 'TikTok Ads' | 'Google Search' | 'Affiliate Collab';
  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  spend: number; // in IDR
  impressions: number;
  clicks: number;
  cpc: number;
  attribution: {
    first_touch: AttributionMetricGroup;
    last_touch: AttributionMetricGroup;
    linear: AttributionMetricGroup;
    time_decay: AttributionMetricGroup;
    position_based: AttributionMetricGroup;
  };
  status: 'active' | 'paused' | 'completed';
  recommendation: 'Scale Up 🚀' | 'Optimal ✅' | 'High CAC ⚠️' | 'Fatigued 🛑';
  targetAudience: string;
}

export interface TouchpointJourney {
  id: string;
  path: string[];
  conversionsCount: number;
  totalRevenue: number;
  avgDaysToConvert: number;
  percentageOfTotal: number;
}

// ================= 2. PRODUCT & INVENTORY TYPES =================
export type AbcClassification = 'A' | 'B' | 'C';
export type StockStatus = 'critical' | 'optimal' | 'overstock' | 'out_of_stock';

export interface ProductInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number; // IDR Selling Price
  cogs: number; // IDR HPP (Modal Pokok)
  currentStock: number; // Physical units
  safetyStock: number; // Minimum buffer
  dailyBurnRate: number; // Avg units sold/day
  daysOfInventory: number; // Estimated days remaining
  leadTimeDays: number; // Supplier arrival time in days
  reorderPoint: number; // Calculated ROP
  abcClass: AbcClassification;
  status: StockStatus;
  totalUnitsSold: number;
  totalRevenue: number;
  grossMarginPercent: number;
  topReferralLinkTitle?: string;
  topReferralSlug?: string;
}

export interface StockRestockOrder {
  id: string;
  sku: string;
  productName: string;
  orderQuantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  estimatedArrival: string;
  status: 'ordered' | 'in_transit' | 'received';
  createdAt: string;
}

// ================= 3. CONVERSION & BEHAVIOR TYPES =================
export interface FunnelStage {
  id: string;
  name: string;
  stageNumber: number;
  description: string;
  visitorCount: number;
  conversionRateFromPrevious: number; // % from prior stage
  overallConversionRate: number; // % from initial clicks
  dropOffCount: number;
  dropOffRate: number; // % dropped
  avgTimeOnStageSeconds: number;
  benchmarkRate: number;
}

export interface BehaviorCohortWeek {
  cohortDate: string; // e.g., 'Minggu 1', 'Minggu 2'
  totalVisitors: number;
  initialPurchasers: number;
  retentionRates: number[]; // [100%, 38%, 26%, 19%, 14%]
}

export interface DeviceConversionMetric {
  device: 'Mobile iOS' | 'Mobile Android' | 'Desktop Windows' | 'Desktop Mac' | 'Tablet';
  sessions: number;
  cartAdditions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  avgOrderValue: number;
}

// ================= 4. TRENDING RADAR TYPES =================
export type TrendingCommercialType = 'all' | 'affiliate' | 'non_affiliate';

export interface TrendingProductItem {
  id: string;
  name: string;
  category: string;
  brandName: string;
  price: number; // IDR Selling Price
  originalPrice: number;
  type: 'affiliate' | 'non_affiliate';
  commissionRate: number; // % (e.g. 15%)
  commissionAmount: number; // IDR per sale (e.g. 22350)
  grossMarginPercent: number; // for non-affiliate brand (e.g. 70%)
  viralScore: number; // 0 - 100
  growth24h: number; // % e.g. +340%
  unitsSold24h: number;
  totalRevenue24h: number;
  trendingRank: number;
  topPlatform: 'TikTok Shop' | 'Shopee Affiliate' | 'Instagram Shop' | 'Tokopedia' | 'Direct Store';
  hookStrategy: string;
  affiliateLinkSample: string;
  badges: string[];
}

export interface TrendingVideoItem {
  id: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  creatorFollowers: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  type: 'affiliate' | 'non_affiliate';
  associatedProductName: string;
  videoUrl: string;
  thumbnailGradient: string;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  linkClicks: number;
  ctr: number;
  viralVelocity: string;
  soundViral: string;
  hookText: string;
  estimatedEarnings: number; // IDR (komisi atau omzet)
  trackedSlug?: string;
  publishedHoursAgo: number;
}



