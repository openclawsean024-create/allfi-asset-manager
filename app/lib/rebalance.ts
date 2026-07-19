// ─── Rebalance suggestions (P0 premium feature) — FR-009 + AC-010 ────────

import type { Account, AccountType, Currency } from './types'
import { ACCOUNT_TYPE_META } from './types'
import { toTWD } from './fx'
import { NON_ADVICE_TEXT } from './disclaimer'

export interface AllocationTarget {
  type: AccountType
  pct: number // 0-100
}

export interface RebalanceSuggestion {
  type: AccountType
  currentPct: number
  targetPct: number
  deltaTWD: number
  action: 'buy' | 'sell' | 'hold'
  reason: string
}

export interface RebalanceReport {
  totalTWD: number
  suggestions: RebalanceSuggestion[]
  disclaimer: string
  dataDate: string
}

/**
 * Pure-function rebalance advisor. Returns suggestions list with deltaTWD per type.
 * - Buy when currentPct < targetPct - 1
 * - Sell when currentPct > targetPct + 1
 * - Hold otherwise
 */
export function suggestRebalance(
  accounts: Account[],
  rates: Record<Currency, number>,
  targets: AllocationTarget[],
  dataDate: string,
): RebalanceReport {
  const assets = accounts.filter((a) => !ACCOUNT_TYPE_META[a.type].isLiability)
  const total = assets.reduce((acc, a) => acc + toTWD(a.balance, a.currency, rates), 0)
  const currentByType = new Map<AccountType, number>()
  for (const a of assets) {
    const v = toTWD(a.balance, a.currency, rates)
    currentByType.set(a.type, (currentByType.get(a.type) ?? 0) + v)
  }
  const suggestions: RebalanceSuggestion[] = targets.map((t) => {
    const current = currentByType.get(t.type) ?? 0
    const currentPct = total === 0 ? 0 : Math.round((current / total) * 10000) / 100
    const targetValue = (t.pct / 100) * total
    const deltaTWD = Math.round((targetValue - current) * 100) / 100
    let action: RebalanceSuggestion['action'] = 'hold'
    let reason = `${t.type} 已在目標 ±1% 內，無需動作`
    if (currentPct < t.pct - 1) {
      action = 'buy'
      reason = `${t.type} 占比偏低（${currentPct}% vs 目標 ${t.pct}%），建議增持 NT$${Math.abs(deltaTWD).toLocaleString()}`
    } else if (currentPct > t.pct + 1) {
      action = 'sell'
      reason = `${t.type} 占比偏高（${currentPct}% vs 目標 ${t.pct}%），建議減持 NT$${Math.abs(deltaTWD).toLocaleString()}`
    }
    return { type: t.type, currentPct, targetPct: t.pct, deltaTWD, action, reason }
  })
  return { totalTWD: Math.round(total * 100) / 100, suggestions, disclaimer: NON_ADVICE_TEXT, dataDate }
}