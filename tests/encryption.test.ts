// ─── FR-008 / Encrypted export roundtrip (AC-008) ───────────────────────

import { describe, expect, it } from 'vitest'
import { buildExport, restoreExport, xorEncrypt, xorDecrypt, payloadHash } from '../app/lib/encryption'
import type { Account } from '../app/lib/types'

const accounts: Account[] = [
  { id: 'a', type: 'bank', name: '台新', balance: 1000, currency: 'TWD', createdAt: '2026-07-01' },
]

describe('FR-008 xorEncrypt / xorDecrypt', () => {
  it('roundtrips plain text', () => {
    const plain = 'hello world'
    const enc = xorEncrypt(plain, 'pw')
    const dec = xorDecrypt(enc.salt, enc.iv, enc.ciphertext, 'pw')
    expect(dec).toBe(plain)
  })

  it('wrong password does not produce plain', () => {
    const enc = xorEncrypt('secret', 'pw1')
    const dec = xorDecrypt(enc.salt, enc.iv, enc.ciphertext, 'pw2')
    expect(dec).not.toBe('secret')
  })
})

describe('FR-008 buildExport / restoreExport', () => {
  it('AC-008: roundtrip preserves accounts', () => {
    const exp = buildExport(accounts, 'pw123', '2026-07-19')
    const back = restoreExport(exp, 'pw123')
    expect(back.accounts[0].id).toBe('a')
    expect(back.accounts[0].balance).toBe(1000)
    expect(back.takenAt).toBe('2026-07-19')
  })

  it('export envelope includes version + count', () => {
    const exp = buildExport(accounts, 'pw', '2026-07-19')
    expect(exp.version).toBe(1)
    expect(exp.accountCount).toBe(1)
    expect(exp.salt.length).toBeGreaterThan(0)
  })
})

describe('FR-008 payloadHash', () => {
  it('deterministic for same input', () => {
    expect(payloadHash('abc')).toBe(payloadHash('abc'))
  })

  it('different for different input', () => {
    expect(payloadHash('abc')).not.toBe(payloadHash('abd'))
  })
})