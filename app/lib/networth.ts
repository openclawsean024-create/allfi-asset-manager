// ─── Net worth / concentration / debt ratio — FR-004 / AC-003 ──────────

import type { Account, AccountType, Currency } from './types'
import { ACCOUNT_TYPE_META } from './types'
import { toTWD } from './fx'

export interface NetWorthBreakdown {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  liquidAssets: number
  liquidRatio: number
  debtRatio: number
  concentration: Array<{ type: AccountType; pct: number; total: number }>
  dataDate: string
}

const LIQUID_TYPES: AccountType[] = ['bank', 'cash', 'broker']

/** Sum balances in TWD across accounts. */
export function sumInTWD(accounts: Account[], rates: Record<Currency, number>): number {
  return Math.round(
    accounts.reduce((acc, a) => acc + toTWD(a.balance, a.currency, rates), 0) * 100,
  ) / 100
}

/** Compute full net worth breakdown. */
export function computeNetWorth(
  accounts: Account[],
  rates: Record<Currency, number>,
  dataDate: string,
): NetWorthBreakdown {
  const assets = accounts.filter((a) => !ACCOUNT_TYPE_META[a.type].isLiability)
  const liabs = accounts.filter((a) => ACCOUNT_TYPE_META[a.type].isLiability)
  const liquid = assets.filter((a) => LIQUID_TYPES.includes(a.type))

  // totalLiabilities stored as a positive number (the debt magnitude) so
  // downstream math is explicit and easy to reason about.
  const totalAssets = sumInTWD(assets, rates)
  const totalLiabilities = Math.abs(sumInTWD(liabs, rates))
  const liquidAssets = sumInTWD(liquid, rates)
  const netWorth = Math.round((totalAssets - totalLiabilities) * 100) / 100

  const denom = totalAssets || 1
  const concentration = Object.keys(ACCOUNT_TYPE_META)
    .map((t) => t as AccountType)
    .map((t) => {
      const total = sumInTWD(assets.filter((a) => a.type === t), rates)
      return { type: t, total, pct: Math.round((total / denom) * 10000) / 100 }
    })
    .filter((row) => row.total > 0)

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    liquidRatio: Math.round((liquidAssets / denom) * 10000) / 100,
    debtRatio: Math.round((Math.abs(totalLiabilities) / (denom || 1)) * 10000) / 100,
    concentration,
    dataDate,
  }
}

/** AC-003: ensure net worth = assets − liabilities with decimal precision. */
export function assertNetWorthInvariant(breakdown: NetWorthBreakdown, tolerance = 0.01): boolean {
  return Math.abs(breakdown.netWorth - (breakdown.totalAssets - breakdown.totalLiabilities)) <= tolerance
}