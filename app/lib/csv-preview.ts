// ─── CSV preview validation — FR-006 / AC-006 ───────────────────────────

import type { Account, AccountType, Currency } from './types'
import { ACCOUNT_TYPES, CURRENCIES } from './types'
import { parseAccountsCSV } from './csv'

export interface CsvRowIssue {
  rowIndex: number
  raw: string
  message: string
}

export interface CsvPreview {
  okRows: Account[]
  issues: CsvRowIssue[]
}

/**
 * Preview CSV import: never silently overwrite. Returns parsed accounts + per-row issues.
 * - Skips rows with unknown account type or currency (does NOT throw)
 * - Reports rows with empty name or non-numeric balance
 */
export function previewAccountsCSV(csv: string): CsvPreview {
  const lines = csv.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return { okRows: [], issues: [{ rowIndex: 0, raw: '', message: 'no data rows' }] }
  const issues: CsvRowIssue[] = []
  const okRows: Account[] = []
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i]
    const cols = parseCsvLineSafe(raw)
    if (cols.length < 5) {
      issues.push({ rowIndex: i, raw, message: 'column count < 5' })
      continue
    }
    const [id, type, name, balance, currency] = cols
    if (!name || name.trim().length === 0) {
      issues.push({ rowIndex: i, raw, message: 'name is empty' })
      continue
    }
    if (!ACCOUNT_TYPES.includes(type as AccountType)) {
      issues.push({ rowIndex: i, raw, message: `unknown type: ${type}` })
      continue
    }
    if (!CURRENCIES.includes(currency as Currency)) {
      issues.push({ rowIndex: i, raw, message: `unknown currency: ${currency}` })
      continue
    }
    const bal = Number(balance)
    if (!Number.isFinite(bal)) {
      issues.push({ rowIndex: i, raw, message: `balance not numeric: ${balance}` })
      continue
    }
    okRows.push({
      id: id || `imported-${Date.now()}-${i}`,
      type: type as AccountType,
      name,
      balance: bal,
      currency: currency as Currency,
      note: cols[5] ?? '',
      createdAt: cols[6] || new Date().toISOString(),
    })
  }
  return { okRows, issues }
}

function parseCsvLineSafe(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"' && !inQuotes) inQuotes = true
    else if (ch === '"' && inQuotes) inQuotes = false
    else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

// Re-export parseAccountsCSV so downstream callers can still use it (kept for back-compat).
export { parseAccountsCSV }