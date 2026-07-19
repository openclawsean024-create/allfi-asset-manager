// ─── FX (foreign exchange) helpers — FR-002 / AC-004 ────────────────────

import type { Currency } from './types'
import { DEFAULT_RATES_TO_TWD } from './types'

export interface FxSnapshot {
  rates: Record<Currency, number> // amount of TWD per 1 unit
  asOf: string // ISO date when user provided these rates
}

/** Convert amount in `from` currency to TWD using the supplied rates. */
export function toTWD(amount: number, from: Currency, rates: Record<Currency, number>): number {
  if (!Number.isFinite(amount)) return 0
  const r = rates[from]
  if (typeof r !== 'number' || r <= 0) return 0
  return Math.round(amount * r * 100) / 100
}

/** Default fresh snapshot (today). */
export function freshFx(asOf?: string): FxSnapshot {
  return { rates: { ...DEFAULT_RATES_TO_TWD }, asOf: asOf ?? new Date().toISOString() }
}

/** How many full days between asOf and reference (default now). */
export function fxAgeDays(snapshot: FxSnapshot, reference: Date = new Date()): number {
  const a = Date.parse(snapshot.asOf)
  if (isNaN(a)) return Number.POSITIVE_INFINITY
  return Math.floor((reference.getTime() - a) / 86400000)
}

/** AC-004: true when rates are older than 30 days → must not present as live. */
export function isStale(snapshot: FxSnapshot, maxAgeDays = 30, reference?: Date): boolean {
  return fxAgeDays(snapshot, reference) > maxAgeDays
}

/** Status for UI display. */
export function fxStatusLabel(snapshot: FxSnapshot, maxAgeDays = 30): 'fresh' | 'aging' | 'stale' {
  const d = fxAgeDays(snapshot)
  if (d > maxAgeDays) return 'stale'
  if (d > maxAgeDays / 2) return 'aging'
  return 'fresh'
}