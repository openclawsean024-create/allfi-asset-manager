// ─── FR-005 / Cash flow runway + AC-005 ─────────────────────────────────

import { describe, expect, it } from 'vitest'
import { computeRunway } from '../app/lib/cashflow'

describe('FR-005 computeRunway', () => {
  it('positive cashflow scenario', () => {
    const r = computeRunway({ availableCash: 100000, monthlyFixedOutflow: 30000, monthlyIncome: 50000 })
    expect(r.monthsCovered).toBeCloseTo(3.3, 1)
    expect(r.projectedBalance3m).toBe(100000 + 3 * (50000 - 30000))
    expect(r.positiveCashflow).toBe(true)
  })

  it('negative projection triggers warning', () => {
    const r = computeRunway({ availableCash: 10000, monthlyFixedOutflow: 20000, monthlyIncome: 5000 })
    expect(r.positiveCashflow).toBe(false)
    expect(r.warnings.length).toBeGreaterThan(0)
  })

  it('AC-005: result echoes all inputs used', () => {
    const inp = { availableCash: 50000, monthlyFixedOutflow: 15000, monthlyIncome: 30000, upcomingOneOff: 10000 }
    const r = computeRunway(inp)
    expect(r.inputs).toEqual(inp)
  })

  it('outflow 0 → monthsCovered capped at 12', () => {
    const r = computeRunway({ availableCash: 100000, monthlyFixedOutflow: 0, monthlyIncome: 30000 })
    expect(r.monthsCovered).toBe(12)
  })

  it('availableCash < 1 month outflow → warning', () => {
    const r = computeRunway({ availableCash: 5000, monthlyFixedOutflow: 30000, monthlyIncome: 50000 })
    expect(r.warnings.some((w) => w.includes('低於'))).toBe(true)
  })
})