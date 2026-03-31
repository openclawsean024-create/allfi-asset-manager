// Account type definitions for AllFi MVP

export interface BankAccount {
  id: string;
  institution: string;
  accountName: string;
  accountType: 'checking' | 'savings';
  balance: number;
  currency: string;
  lastTransaction: {
    date: string;
    description: string;
    amount: number;
  };
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
  holdings: StockHolding[];
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
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
  assets: CryptoAsset[];
  totalValue: number;
  totalChange24h: number;
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
