export type LanguageCode =
  | 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr' | 'bn' | 'gu' | 'pa'
  | 'or' | 'as' | 'ur' | 'sa' | 'ks' | 'kok' | 'ne' | 'sd' | 'mni' | 'brx'
  | 'doi' | 'mai' | 'sat';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
}

export type ViewMode =
  | 'landing'
  | 'dashboard'
  | 'income-and-expenses'
  | 'budget-planner'
  | 'savings-goals'
  | 'emergency-fund'
  | 'ai-financial-assistant'
  | 'stock-research'
  | 'senior-friendly-mode'
  | 'voice-assistant'
  | 'payment-assistant'
  | 'scam-safety-center'
  | 'trusted-contacts'
  | 'sms-safety-alerts'
  | 'notifications'
  | 'settings-and-privacy';

export type ProfileType = 'regular' | 'elderly' | 'caregiver';

export interface UserProfile {
  id: string;
  name: string;
  elderlyName?: string;
  phone: string;
  email: string;
  profileType: ProfileType;
  preferredLanguage: LanguageCode;
  bankName: string;
  accountNumberMasked: string;
  highContrast: boolean;
  theme: 'dark' | 'light' | 'high-contrast';
  seniorAssistActive: boolean;
  upiDailyCap: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'housing' | 'groceries' | 'utilities' | 'healthcare' | 'transport' | 'education' | 'discretionary' | 'shopping';
  amount: number;
  type: 'essential' | 'discretionary';
  isRecurring: boolean;
  date: string;
  includedInExpenses?: boolean;
}

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  type: 'salary' | 'pension' | 'freelance' | 'investment' | 'other';
  date: string;
  verified: boolean;
}

export interface DebtItem {
  id: string;
  title: string;
  monthlyRepayment: number;
  includedInExpenses: boolean; // Double-counting prevention flag
  outstandingBalance: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  monthlyContribution: number;
  status: 'in-progress' | 'completed' | 'paused';
  guardianLocked?: boolean;
}

export interface Transaction {
  id: string;
  recipientName: string;
  recipientVpa: string;
  date: string;
  time: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  status: 'completed' | 'flagged' | 'prevented' | 'pending';
  threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  riskReason?: string;
  source: 'UPI Direct' | 'RuPay Card' | 'Auto-debit' | 'SBI Core' | 'Protected Vault';
  verifiedBadge?: boolean;
  isSimulated?: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'Son' | 'Daughter' | 'Spouse' | 'Caregiver' | 'Guardian' | 'Other';
  verified: boolean;
  device: string;
  deviceSecurity: 'Safe' | 'Warning';
  suspiciousSms48h: number;
  dailyTransferCap: number;
  permissions: {
    viewTransactions: boolean;
    receiveAlerts: boolean;
    requireCoApproval: boolean;
  };
}

export interface StockCandidate {
  ticker: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  changePercent: number;
  peRatio: number;
  marketCap: string;
  sector: string;
  strengths: string;
  risks: string;
  suitableHorizon: string;
  lastUpdated: string;
}
