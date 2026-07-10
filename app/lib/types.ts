// ─── Types ───────────────────────────────────────────────────────────────

export type AccountType = 'bank' | 'broker' | 'cash' | 'credit' | 'crypto' | 'other'
export type Currency = 'TWD' | 'USD' | 'JPY' | 'EUR' | 'BTC' | 'ETH'

export const ACCOUNT_TYPES: AccountType[] = ['bank', 'broker', 'cash', 'credit', 'crypto', 'other']
export const CURRENCIES: Currency[] = ['TWD', 'USD', 'JPY', 'EUR', 'BTC', 'ETH']

export const ACCOUNT_TYPE_META: Record<AccountType, { label: string; emoji: string; isLiability: boolean }> = {
  bank: { label: '銀行', emoji: '🏦', isLiability: false },
  broker: { label: '券商', emoji: '📈', isLiability: false },
  cash: { label: '現金', emoji: '💵', isLiability: false },
  credit: { label: '信用卡', emoji: '💳', isLiability: true },
  crypto: { label: '加密幣', emoji: '₿', isLiability: false },
  other: { label: '其他', emoji: '📦', isLiability: false },
}

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  TWD: 'NT$', USD: '$', JPY: '¥', EUR: '€', BTC: '₿', ETH: 'Ξ',
}

export interface Account {
  id: string
  type: AccountType
  name: string
  balance: number
  currency: Currency
  note?: string
  createdAt: string
}

// Static exchange rates vs TWD (2026-07 baseline; user can override)
export const DEFAULT_RATES_TO_TWD: Record<Currency, number> = {
  TWD: 1,
  USD: 31.5,
  JPY: 0.21,
  EUR: 34.2,
  BTC: 2150000, // 1 BTC = 2.15M TWD
  ETH: 95000,   // 1 ETH = 95K TWD
}

export const STORAGE_KEY = 'allfi-accounts-v2'
