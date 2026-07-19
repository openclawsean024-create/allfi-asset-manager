// ─── Snapshot diff — FR-007 / AC-007 ────────────────────────────────────

import type { Account } from './types'

export type SnapshotDiff =
  | { kind: 'added'; account: Account }
  | { kind: 'removed'; account: Account }
  | { kind: 'changed'; before: Account; after: Account; balanceDelta: number; currencyDelta: number }

/**
 * Compare two snapshots and return a deterministic diff list.
 * - `added`: account.id present in after but not before
 * - `removed`: account.id present in before but not after
 * - `changed`: same id, different balance/currency/type/name
 */
export function diffSnapshots(before: Account[], after: Account[]): SnapshotDiff[] {
  const beforeMap = new Map(before.map((a) => [a.id, a]))
  const afterMap = new Map(after.map((a) => [a.id, a]))
  const diffs: SnapshotDiff[] = []

  for (const [id, a] of afterMap) {
    const b = beforeMap.get(id)
    if (!b) {
      diffs.push({ kind: 'added', account: a })
      continue
    }
    const balanceDelta = Math.round((a.balance - b.balance) * 100) / 100
    const currencyDelta = a.currency === b.currency ? 0 : 1
    if (balanceDelta !== 0 || currencyDelta !== 0 || a.type !== b.type || a.name !== b.name) {
      diffs.push({ kind: 'changed', before: b, after: a, balanceDelta, currencyDelta })
    }
  }
  for (const [id, b] of beforeMap) {
    if (!afterMap.has(id)) diffs.push({ kind: 'removed', account: b })
  }
  return diffs
}

/** Create a snapshot record (timestamped, versioned). */
export function createSnapshot(accounts: Account[], note?: string): {
  id: string
  takenAt: string
  accounts: Account[]
  note?: string
  version: number
} {
  return {
    id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    takenAt: new Date().toISOString(),
    accounts: accounts.map((a) => ({ ...a })),
    note,
    version: 1,
  }
}