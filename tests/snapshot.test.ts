// ─── FR-007 / Snapshot diff + AC-007 ────────────────────────────────────

import { describe, expect, it } from 'vitest'
import { diffSnapshots, createSnapshot } from '../app/lib/snapshot'
import type { Account } from '../app/lib/types'

const a1: Account = { id: '1', type: 'bank', name: 'A', balance: 1000, currency: 'TWD', createdAt: '2026-07-01' }
const a2: Account = { id: '2', type: 'broker', name: 'B', balance: 5000, currency: 'TWD', createdAt: '2026-07-02' }

describe('FR-007 diffSnapshots', () => {
  it('detects added account', () => {
    const diffs = diffSnapshots([a1], [a1, a2])
    expect(diffs.length).toBe(1)
    expect(diffs[0].kind).toBe('added')
  })

  it('detects removed account', () => {
    const diffs = diffSnapshots([a1, a2], [a1])
    expect(diffs.length).toBe(1)
    expect(diffs[0].kind).toBe('removed')
  })

  it('AC-007: detects balance change', () => {
    const before = [a1]
    const after = [{ ...a1, balance: 2000 }]
    const diffs = diffSnapshots(before, after)
    expect(diffs.length).toBe(1)
    expect(diffs[0].kind).toBe('changed')
    if (diffs[0].kind === 'changed') {
      expect(diffs[0].balanceDelta).toBe(1000)
    }
  })

  it('identical snapshots return no diffs', () => {
    expect(diffSnapshots([a1, a2], [a1, a2])).toEqual([])
  })

  it('currency change tracked separately', () => {
    const after = [{ ...a1, currency: 'USD' as const }]
    const diffs = diffSnapshots([a1], after)
    expect(diffs[0].kind).toBe('changed')
    if (diffs[0].kind === 'changed') {
      expect(diffs[0].currencyDelta).toBe(1)
    }
  })
})

describe('FR-007 createSnapshot', () => {
  it('produces timestamped, versioned envelope', () => {
    const s = createSnapshot([a1, a2], 'monthly check-in')
    expect(s.id).toMatch(/^snap-/)
    expect(s.version).toBe(1)
    expect(s.accounts.length).toBe(2)
    expect(s.note).toBe('monthly check-in')
  })

  it('deep-clones accounts (mutating snapshot does not affect input)', () => {
    const original = [a1]
    const s = createSnapshot(original, 'x')
    if (s.accounts[0].id !== a1.id) throw new Error('id changed')
    s.accounts[0].balance = 99999
    expect(original[0].balance).toBe(1000)
  })
})