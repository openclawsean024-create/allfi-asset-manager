// ─── FR-002 / FX conversion + stale detection (AC-004) ─────────────────

import { describe, expect, it } from 'vitest'
import { toTWD, freshFx, fxAgeDays, isStale, fxStatusLabel } from '../app/lib/fx'

const rates = { TWD: 1, USD: 31.5, JPY: 0.21, EUR: 34.2, BTC: 2150000, ETH: 95000 }

describe('FR-002 toTWD', () => {
  it('TWD→TWD is identity', () => {
    expect(toTWD(1234.56, 'TWD', rates)).toBeCloseTo(1234.56, 2)
  })

  it('USD→TWD multiplies by rate', () => {
    expect(toTWD(100, 'USD', rates)).toBe(3150)
  })

  it('JPY→TWD multiplies by tiny rate', () => {
    expect(toTWD(1000, 'JPY', rates)).toBe(210)
  })

  it('BTC→TWD returns millions', () => {
    expect(toTWD(0.5, 'BTC', rates)).toBe(1075000)
  })

  it('handles non-finite amount as 0', () => {
    expect(toTWD(NaN, 'TWD', rates)).toBe(0)
    expect(toTWD(Infinity, 'TWD', rates)).toBe(0)
  })

  it('handles missing rate as 0', () => {
    expect(toTWD(100, 'TWD' as 'TWD', { TWD: 0 })).toBe(0)
  })
})

describe('AC-004 isStale / fxAgeDays', () => {
  it('fresh snapshot is not stale', () => {
    const snap = freshFx()
    expect(isStale(snap, 30, new Date())).toBe(false)
  })

  it('35-day-old snapshot is stale', () => {
    const old = new Date(Date.now() - 35 * 86400000).toISOString()
    const snap = freshFx(old)
    expect(isStale(snap, 30)).toBe(true)
  })

  it('15-day-old snapshot is aging', () => {
    const mid = new Date(Date.now() - 20 * 86400000).toISOString()
    expect(fxStatusLabel(freshFx(mid))).toBe('aging')
  })

  it('5-day-old snapshot is fresh', () => {
    const recent = new Date(Date.now() - 5 * 86400000).toISOString()
    expect(fxStatusLabel(freshFx(recent))).toBe('fresh')
  })

  it('invalid asOf returns Infinity age', () => {
    expect(fxAgeDays({ rates, asOf: 'invalid' })).toBe(Number.POSITIVE_INFINITY)
    expect(isStale({ rates, asOf: 'invalid' })).toBe(true)
  })
})