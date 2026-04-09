export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import type { AllAccounts } from '@/types/accounts';

export async function GET() {
  const data: AllAccounts = {
    bankAccounts: [
      {
        id: 'bank-001',
        institution: 'Chase Bank',
        accountName: 'Checking ****4821',
        accountType: 'checking',
        balance: 12450.67,
        currency: 'USD',
        status: 'enabled',
        lastTransaction: { date: '2026-03-30', description: 'Direct Deposit - Payroll', amount: 3200.00 },
        updatedAt: '2026-03-30',
      },
      {
        id: 'bank-002',
        institution: 'Chase Bank',
        accountName: 'Savings ****9832',
        accountType: 'savings',
        balance: 28400.00,
        currency: 'USD',
        status: 'enabled',
        lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 },
        updatedAt: '2026-03-28',
      },
    ],
    stockAccounts: [
      {
        id: 'stock-001',
        institution: 'TD Ameritrade',
        accountName: 'Individual Brokerage',
        status: 'enabled',
        holdings: [
          { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50, totalGain: 1092.00, totalGainPercent: 49.09 },
          { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20, totalGain: 3163.20, totalGainPercent: 82.38 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50, totalGain: 887.50, totalGainPercent: 28.63 },
        ],
        totalValue: 14310.20,
        totalGain: 5142.70,
        totalGainPercent: 56.06,
        updatedAt: '2026-03-30',
      },
    ],
    cryptoAccounts: [
      {
        id: 'crypto-001',
        institution: 'Coinbase',
        accountName: 'Main Portfolio',
        status: 'enabled',
        assets: [
          { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, currentPrice: 67420.00, value: 30339.00, change24h: 2.34 },
          { symbol: 'ETH', name: 'Ethereum', amount: 3.2, currentPrice: 3520.00, value: 11264.00, change24h: -1.28 },
          { symbol: 'SOL', name: 'Solana', amount: 25, currentPrice: 142.80, value: 3570.00, change24h: 5.67 },
        ],
        totalValue: 45173.00,
        totalChange24h: 1.89,
        updatedAt: '2026-03-30',
      },
      {
        id: 'crypto-002',
        institution: 'Binance',
        accountName: 'Trading Account',
        status: 'idle',
        assets: [
          { symbol: 'BNB', name: 'Binance Coin', amount: 5, currentPrice: 598.00, value: 2990.00, change24h: 0.45 },
        ],
        totalValue: 2990.00,
        totalChange24h: 0.45,
        updatedAt: '2026-03-25',
      },
    ],
    totalNetWorth: 103323.87,
    netWorthByType: { bank: 40850.67, stocks: 14310.20, crypto: 48163.00 },
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
