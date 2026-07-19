// ─── FR-009 / Paywall gate ──────────────────────────────────────────────

import { describe, expect, it } from 'vitest'
import { gateFeature, countAvailable, FEATURES } from '../app/lib/paywall'

describe('FR-009 gateFeature', () => {
  it('demo user blocked from premium feature', () => {
    const r = gateFeature('demo', 'pdf-export')
    expect(r.allowed).toBe(false)
    expect(r.upsell).toBeTruthy()
  })

  it('premium user can access all', () => {
    for (const f of FEATURES.filter((x) => x.premiumOnly)) {
      expect(gateFeature('premium', f.id).allowed).toBe(true)
    }
  })

  it('demo can access free features', () => {
    expect(gateFeature('demo', 'crud').allowed).toBe(true)
    expect(gateFeature('demo', 'csv-import').allowed).toBe(true)
  })

  it('unknown feature returns denial', () => {
    expect(gateFeature('premium', 'no-such').allowed).toBe(false)
  })
})

describe('FR-009 countAvailable', () => {
  it('premium > demo', () => {
    expect(countAvailable('premium')).toBeGreaterThan(countAvailable('demo'))
  })
})