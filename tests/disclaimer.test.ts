// ─── FR-010 / Disclaimer stamp (AC-010) ─────────────────────────────────

import { describe, expect, it } from 'vitest'
import { NON_ADVICE_TEXT, stampedAnalysis, hasDisclaimer } from '../app/lib/disclaimer'

describe('FR-010 disclaimer', () => {
  it('NON_ADVICE_TEXT constant present', () => {
    expect(NON_ADVICE_TEXT).toContain('不構成投資建議')
  })

  it('stampedAnalysis attaches disclaimer + dataDate', () => {
    const s = stampedAnalysis({ netWorth: 100 }, '2026-07-19')
    expect(s.disclaimer).toBe(NON_ADVICE_TEXT)
    expect(s.dataDate).toBe('2026-07-19')
    expect(s.netWorth).toBe(100)
  })

  it('AC-010: hasDisclaimer true for stamped payload', () => {
    expect(hasDisclaimer({ disclaimer: NON_ADVICE_TEXT })).toBe(true)
  })

  it('hasDisclaimer false for tampered payload', () => {
    expect(hasDisclaimer({ disclaimer: 'Buy AAPL now' })).toBe(false)
    expect(hasDisclaimer(null)).toBe(false)
  })
})