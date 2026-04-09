// Account type definitions for AllFi MVP

export type AssetStatus = 'enabled' | 'idle' | 'abnormal' | 'pending';
export type AssetType = 'bank' | 'stock' | 'crypto';

export const STATUS_LABELS: Record<AssetStatus, string> = {
  enabled: '啟用',
  idle: '閒置',
  abnormal: '異常',
  pending: '待處理',
};

export const STATUS_COLORS: Record<AssetStatus, string> = {
  enabled: '#34d399',
  idle: '#8a9bb5',
  abnormal: '#f87171',
  pending: '#fbbf24',
};

export interface BankAccount {
  id: string;
  institution: string;
  accountName: string;
  accountType: 'checking' | 'savings';
  balance: number;
  currency: string;
  status: AssetStatus;
  lastTransaction: {
    date: string;
    description: string;
    amount: number;
  };
  updatedAt: string;
}

export interface StockHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface StockAccount {
  id: string;
  institution: string;
  accountName: string;
  status: AssetStatus;
  holdings: StockHolding[];
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  updatedAt: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  value: number;
  change24h: number;
}

export interface CryptoAccount {
  id: string;
  institution: string;
  accountName: string;
  status: AssetStatus;
  assets: CryptoAsset[];
  totalValue: number;
  totalChange24h: number;
  updatedAt: string;
}

export interface AllAccounts {
  bankAccounts: BankAccount[];
  stockAccounts: StockAccount[];
  cryptoAccounts: CryptoAccount[];
  totalNetWorth: number;
  netWorthByType: {
    bank: number;
    stocks: number;
    crypto: number;
  };
  lastUpdated: string;
}
