// ─── Rebalance suggestions + Premium-only feature gate ──────────────────

import { describe, expect, it } from 'vitest'
import { suggestRebalance } from '../app/lib/rebalance'
import { gateFeature } from '../app/lib/paywall'
import type { Account } from '../app/lib/types'

const rates = { TWD: 1, USD: 31.5, JPY: 0.21, EUR: 34.2, BTC: 2150000, ETH: 95000 }

const accounts: Account[] = [
  { id: '1', type: 'bank', name: '台新', balance: 100000, currency: 'TWD', createdAt: '2026-07-01' },
  { id: '2', type: 'broker', name: '富邦', balance: 80000, currency: 'TWD', createdAt: '2026-07-02' },
  { id: '3', type: 'crypto', name: 'BTC', balance: 0.02, currency: 'BTC', createdAt: '2026-07-03' },
]

describe('suggestRebalance', () => {
  it('computes deltas to reach target allocation', () => {
    const targets = [
      { type: 'bank' as const, pct: 40 },
      { type: 'broker' as const, pct: 40 },
      { type: 'crypto' as const, pct: 20 },
    ]
    const r = suggestRebalance(accounts, rates, targets, '2026-07-19')
    expect(r.totalTWD).toBeGreaterThan(0)
    expect(r.suggestions.length).toBe(3)
    // bank currently ~45% (100k / 223k), target 40 → sell
    const bank = r.suggestions.find((s) => s.type === 'bank')
    expect(bank?.action).toBe('sell')
  })

  it('every report carries disclaimer (AC-010)', () => {
    const targets = [{ type: 'bank' as const, pct: 100 }]
    const r = suggestRebalance(accounts, rates, targets, '2026-07-19')
    expect(r.disclaimer).toContain('不構成投資建議')
    expect(r.dataDate).toBe('2026-07-19')
  })

  it('hold when within ±1%', () => {
    const targets = [{ type: 'bank' as const, pct: 44.5 }]
    const r = suggestRebalance(accounts, rates, targets, '2026-07-19')
    expect(r.suggestions[0].action).toBe('hold')
  })
})

describe('integration: rebalance requires premium', () => {
  it('demo user blocked', () => {
    expect(gateFeature('demo', 'rebalance-suggest').allowed).toBe(false)
  })
  it('premium user allowed', () => {
    expect(gateFeature('premium', 'rebalance-suggest').allowed).toBe(true)
  })
})