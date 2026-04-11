export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import type { AllAccounts, CryptoAsset } from '@/types/accounts';


// CoinGecko free API — no API key required
const CG_BASE = 'https://api.coingecko.com/api/v3';

// Map of tracked crypto symbols to CoinGecko coin IDs
const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
};

interface CGMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

async function fetchCryptoPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  try {
    const ids = Object.values(COIN_IDS).join(',');
    const url = `${CG_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // cache for 60 seconds
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data: CGMarket[] = await res.json();
    const map: Record<string, { price: number; change24h: number }> = {};
    for (const coin of data) {
      map[coin.id] = {
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h ?? 0,
      };
    }
    return map;
  } catch (err) {
    console.error('[accounts] CoinGecko fetch failed:', err);
    return {};
  }
}

// Static mock holdings — user configures these in the app
const USER_CRYPTO_HOLDINGS = [
  { symbol: 'BTC', name: 'Bitcoin',     amount: 0.45,  institution: 'Coinbase',   accountName: 'Main Portfolio',    accountId: 'crypto-001' },
  { symbol: 'ETH', name: 'Ethereum',    amount: 3.2,   institution: 'Coinbase',   accountName: 'Main Portfolio',    accountId: 'crypto-001' },
  { symbol: 'SOL', name: 'Solana',       amount: 25,    institution: 'Coinbase',   accountName: 'Main Portfolio',    accountId: 'crypto-001' },
  { symbol: 'BNB', name: 'Binance Coin', amount: 5,   institution: 'Binance',    accountName: 'Trading Account',   accountId: 'crypto-002' },
];

const USER_STOCK_HOLDINGS = [
  { symbol: 'AAPL', name: 'Apple Inc.',             shares: 15,  avgCost: 148.50, institution: 'TD Ameritrade', accountName: 'Individual Brokerage', accountId: 'stock-001' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation',     shares: 8,   avgCost: 480.00, institution: 'TD Ameritrade', accountName: 'Individual Brokerage', accountId: 'stock-001' },
  { symbol: 'MSFT', name: 'Microsoft Corporation',   shares: 10,  avgCost: 310.00, institution: 'TD Ameritrade', accountName: 'Individual Brokerage', accountId: 'stock-001' },
];

// Mock bank accounts (require real bank API integration like Plaid)
const BANK_ACCOUNTS = [
  {
    id: 'bank-001',
    institution: 'Chase Bank',
    accountName: 'Checking ****4821',
    accountType: 'checking' as const,
    balance: 12450.67,
    currency: 'USD',
    status: 'enabled' as const,
    lastTransaction: { date: new Date().toISOString().split('T')[0], description: 'Direct Deposit - Payroll', amount: 3200.00 },
    updatedAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'bank-002',
    institution: 'Chase Bank',
    accountName: 'Savings ****9832',
    accountType: 'savings' as const,
    balance: 28400.00,
    currency: 'USD',
    status: 'enabled' as const,
    lastTransaction: { date: new Date().toISOString().split('T')[0], description: 'Interest Payment', amount: 12.34 },
    updatedAt: new Date().toISOString().split('T')[0],
  },
];

export async function GET() {
  const prices = await fetchCryptoPrices();

  // Build crypto accounts from user holdings + live CoinGecko prices
  const holdingsByAccount: Record<string, { institution: string; accountName: string; assets: CryptoAsset[] }> = {};
  for (const h of USER_CRYPTO_HOLDINGS) {
    const coinId = COIN_IDS[h.symbol];
    const priceData = prices[coinId] ?? { price: 0, change24h: 0 };
    const value = h.amount * priceData.price;
    if (!holdingsByAccount[h.accountId]) {
      holdingsByAccount[h.accountId] = { institution: h.institution, accountName: h.accountName, assets: [] };
    }
    holdingsByAccount[h.accountId].assets.push({
      symbol: h.symbol,
      name: h.name,
      amount: h.amount,
      currentPrice: priceData.price,
      value,
      change24h: priceData.change24h,
    });
  }

  const cryptoAccounts = Object.entries(holdingsByAccount).map(([id, group]) => {
    const totalValue = group.assets.reduce((s, a) => s + a.value, 0);
    const weightedChange = group.assets.reduce((s, a) => s + (a.change24h * a.value), 0) / totalValue;
    return {
      id,
      institution: group.institution,
      accountName: group.accountName,
      status: 'enabled' as const,
      assets: group.assets,
      totalValue,
      totalChange24h: weightedChange,
      updatedAt: new Date().toISOString(),
    };
  });

  const cryptoTotal = cryptoAccounts.reduce((s, a) => s + a.totalValue, 0);

  // Stock accounts — cost basis from user config, current price from Yahoo Finance (via unofficial endpoint)
  // Since free stock APIs require keys, we keep avgCost-based valuation as the "current" estimate
  const stockAccounts = [
    {
      id: 'stock-001',
      institution: 'TD Ameritrade',
      accountName: 'Individual Brokerage',
      status: 'enabled' as const,
      holdings: USER_STOCK_HOLDINGS.map(h => {
        const totalValue = h.shares * h.avgCost;
        const totalGain = h.shares * (h.avgCost - h.avgCost); // Using avgCost so gain = 0 until real price fetched
        return {
          symbol: h.symbol,
          name: h.name,
          shares: h.shares,
          avgCost: h.avgCost,
          currentPrice: h.avgCost,
          totalValue,
          totalGain: 0,
          totalGainPercent: 0,
        };
      }),
      totalValue: USER_STOCK_HOLDINGS.reduce((s, h) => s + h.shares * h.avgCost, 0),
      totalGain: 0,
      totalGainPercent: 0,
      updatedAt: new Date().toISOString(),
    },
  ];

  const stocksTotal = stockAccounts.reduce((s, a) => s + a.totalValue, 0);
  const bankTotal = BANK_ACCOUNTS.reduce((s, a) => s + a.balance, 0);

  const data: AllAccounts = {
    bankAccounts: BANK_ACCOUNTS,
    stockAccounts,
    cryptoAccounts,
    totalNetWorth: bankTotal + stocksTotal + cryptoTotal,
    netWorthByType: { bank: bankTotal, stocks: stocksTotal, crypto: cryptoTotal },
    lastUpdated: new Date().toISOString(),
  };

  const res = NextResponse.json(data);
  res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  return res;
}
