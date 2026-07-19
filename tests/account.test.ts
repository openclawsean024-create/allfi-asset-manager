// ─── FR-001 / Account CRUD + validation ─────────────────────────────────

import { describe, expect, it } from 'vitest'
import { validateAccount, activeAccounts, createAccount, filterByType } from '../app/lib/account'
import type { Account } from '../app/lib/types'

const sample: Account = {
  id: 'a1',
  type: 'bank',
  name: '台新銀行',
  balance: 54000,
  currency: 'TWD',
  createdAt: '2026-07-01T00:00:00.000Z',
}

describe('FR-001 validateAccount', () => {
  it('returns no errors for a valid account', () => {
    expect(validateAccount(sample)).toEqual([])
  })

  it('rejects empty id', () => {
    const errs = validateAccount({ ...sample, id: '' })
    expect(errs.some((e) => e.field === 'id')).toBe(true)
  })

  it('rejects empty name', () => {
    const errs = validateAccount({ ...sample, name: '   ' })
    expect(errs.some((e) => e.field === 'name')).toBe(true)
  })

  it('rejects unknown type', () => {
    const errs = validateAccount({ ...sample, type: 'lottery' })
    expect(errs.some((e) => e.field === 'type')).toBe(true)
  })

  it('rejects unknown currency', () => {
    const errs = validateAccount({ ...sample, currency: 'XYZ' })
    expect(errs.some((e) => e.field === 'currency')).toBe(true)
  })

  it('rejects non-finite balance', () => {
    const errs = validateAccount({ ...sample, balance: NaN })
    expect(errs.some((e) => e.field === 'balance')).toBe(true)
  })

  it('rejects bad createdAt', () => {
    const errs = validateAccount({ ...sample, createdAt: 'not-a-date' })
    expect(errs.some((e) => e.field === 'createdAt')).toBe(true)
  })

  it('rejects null input', () => {
    expect(validateAccount(null).length).toBeGreaterThan(0)
  })
})

describe('FR-001 activeAccounts + filterByType', () => {
  it('filters out archived accounts', () => {
    const accs: Account[] = [sample, { ...sample, id: 'a2', status: 'archived' } as Account & { status: string }]
    expect(activeAccounts(accs).length).toBe(1)
  })

  it('filterByType returns only matching type', () => {
    const broker: Account = { ...sample, id: 'b1', type: 'broker', name: '富邦' }
    const accs = [sample, broker]
    expect(filterByType(accs, 'broker').length).toBe(1)
    expect(filterByType(accs, 'broker')[0].id).toBe('b1')
  })
})

describe('FR-001 createAccount', () => {
  it('generates id and createdAt when missing', () => {
    const a = createAccount({ type: 'cash', name: '皮夾', balance: 1000, currency: 'TWD' })
    expect(a.id).toMatch(/^acc-/)
    expect(a.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(a.name).toBe('皮夾')
  })
})