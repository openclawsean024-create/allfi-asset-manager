// ─── FR-004 / Net worth + concentration + AC-003 ───────────────────────

import { describe, expect, it } from 'vitest'
import { computeNetWorth, sumInTWD, assertNetWorthInvariant } from '../app/lib/networth'
import type { Account } from '../app/lib/types'

const rates = { TWD: 1, USD: 31.5, JPY: 0.21, EUR: 34.2, BTC: 2150000, ETH: 95000 }

const accounts: Account[] = [
  { id: '1', type: 'bank', name: '台新', balance: 54000, currency: 'TWD', createdAt: '2026-07-01' },
  { id: '2', type: 'broker', name: '富邦', balance: 285000, currency: 'TWD', createdAt: '2026-07-02' },
  { id: '3', type: 'credit', name: '國泰卡', balance: -8200, currency: 'TWD', createdAt: '2026-07-03' },
  { id: '4', type: 'crypto', name: 'BTC', balance: 0.05, currency: 'BTC', createdAt: '2026-07-04' },
]

describe('FR-004 sumInTWD', () => {
  it('sums all balances converted to TWD (positive + negative)', () => {
    const total = sumInTWD(accounts, rates)
    expect(total).toBe(54000 + 285000 - 8200 + 0.05 * 2150000)
  })
})

describe('FR-004 computeNetWorth', () => {
  it('separates assets from liabilities', () => {
    const r = computeNetWorth(accounts, rates, '2026-07-19')
    expect(r.totalAssets).toBe(54000 + 285000 + 0.05 * 2150000)
    expect(r.totalLiabilities).toBe(8200)
    expect(r.netWorth).toBe(r.totalAssets - r.totalLiabilities)
  })

  it('AC-003: net worth = assets - liabilities within 0.01 tolerance', () => {
    const r = computeNetWorth(accounts, rates, '2026-07-19')
    expect(assertNetWorthInvariant(r)).toBe(true)
  })

  it('computes concentration percentages summing to ~100', () => {
    const r = computeNetWorth(accounts, rates, '2026-07-19')
    const sum = r.concentration.reduce((acc, c) => acc + c.pct, 0)
    expect(Math.round(sum)).toBeGreaterThanOrEqual(99)
    expect(Math.round(sum)).toBeLessThanOrEqual(101)
  })

  it('liquid ratio includes bank + cash + broker', () => {
    const r = computeNetWorth(accounts, rates, '2026-07-19')
    expect(r.liquidAssets).toBe(54000 + 285000)
    expect(r.liquidRatio).toBeGreaterThan(40)
  })

  it('debt ratio is non-negative', () => {
    const r = computeNetWorth(accounts, rates, '2026-07-19')
    expect(r.debtRatio).toBeGreaterThanOrEqual(0)
  })

  it('empty portfolio returns zeros', () => {
    const r = computeNetWorth([], rates, '2026-07-19')
    expect(r.totalAssets).toBe(0)
    expect(r.netWorth).toBe(0)
  })
})