// ─── FR-006 / CSV preview (AC-006) ──────────────────────────────────────

import { describe, expect, it } from 'vitest'
import { previewAccountsCSV } from '../app/lib/csv-preview'

describe('FR-006 previewAccountsCSV', () => {
  it('parses valid rows', () => {
    const csv = 'id,type,name,balance,currency,note,createdAt\n1,bank,A,1000,TWD,,2026-07-01'
    const r = previewAccountsCSV(csv)
    expect(r.okRows.length).toBe(1)
    expect(r.issues.length).toBe(0)
    expect(r.okRows[0].name).toBe('A')
  })

  it('AC-006: reports bad rows but never overwrites silently', () => {
    const csv = [
      'id,type,name,balance,currency,note,createdAt',
      '1,bank,Good,1000,TWD,,2026-07-01',
      '2,lottery,BadType,500,TWD,,2026-07-02',
      '3,bank,,500,TWD,,2026-07-03',
      '4,bank,BadCurr,500,XXX,,2026-07-04',
      '5,bank,BadBal,notnum,TWD,,2026-07-05',
    ].join('\n')
    const r = previewAccountsCSV(csv)
    expect(r.okRows.length).toBe(1)
    expect(r.issues.length).toBe(4)
    expect(r.issues.map((i) => i.message)).toEqual([
      'unknown type: lottery',
      'name is empty',
      'unknown currency: XXX',
      'balance not numeric: notnum',
    ])
  })

  it('empty / header-only input returns no rows', () => {
    expect(previewAccountsCSV('').okRows.length).toBe(0)
    expect(previewAccountsCSV('id,type,name,balance,currency,note,createdAt').okRows.length).toBe(0)
  })
})