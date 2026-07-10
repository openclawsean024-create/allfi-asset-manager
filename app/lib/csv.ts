import type { Account, AccountType, Currency } from './types'
import { ACCOUNT_TYPES, CURRENCIES } from './types'

export function exportAccountsCSV(accounts: Account[]): string {
  const header = 'id,type,name,balance,currency,note,createdAt\n'
  const rows = accounts.map((a) =>
    `${a.id},${a.type},${csvEscape(a.name)},${a.balance},${a.currency},${csvEscape(a.note || '')},${a.createdAt}`
  )
  return header + rows.join('\n')
}

function csvEscape(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export function parseAccountsCSV(csv: string): Account[] {
  const lines = csv.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []
  const accounts: Account[] = []
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    if (cols.length < 5) continue
    const typeRaw = cols[1] as AccountType
    if (!ACCOUNT_TYPES.includes(typeRaw)) continue
    const currRaw = cols[4] as Currency
    if (!CURRENCIES.includes(currRaw)) continue
    accounts.push({
      id: cols[0] || `imported-${Date.now()}-${i}`,
      type: typeRaw,
      name: cols[2],
      balance: parseFloat(cols[3]) || 0,
      currency: currRaw,
      note: cols[5] || '',
      createdAt: cols[6] || new Date().toISOString(),
    })
  }
  return accounts
}

function parseCsvLine(line: string): string[] {
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

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
