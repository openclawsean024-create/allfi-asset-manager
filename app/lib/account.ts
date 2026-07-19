// ─── Account validation & CRUD helpers (pure functions, FR-001) ─────────

import type { Account, AccountType, Currency } from './types'
import { ACCOUNT_TYPES, CURRENCIES } from './types'

export interface ValidationError {
  field: string
  message: string
}

/** Validate a single Account payload. Returns array of errors (empty = OK). */
export function validateAccount(input: unknown): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof input !== 'object' || input === null) {
    return [{ field: '_root', message: 'account must be an object' }]
  }
  const a = input as Record<string, unknown>
  if (typeof a.id !== 'string' || a.id.length === 0) {
    errors.push({ field: 'id', message: 'id must be non-empty string' })
  }
  if (typeof a.name !== 'string' || a.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'name must be non-empty string' })
  }
  if (typeof a.type !== 'string' || !ACCOUNT_TYPES.includes(a.type as AccountType)) {
    errors.push({ field: 'type', message: `type must be one of ${ACCOUNT_TYPES.join(',')}` })
  }
  if (typeof a.currency !== 'string' || !CURRENCIES.includes(a.currency as Currency)) {
    errors.push({ field: 'currency', message: `currency must be one of ${CURRENCIES.join(',')}` })
  }
  if (typeof a.balance !== 'number' || !Number.isFinite(a.balance)) {
    errors.push({ field: 'balance', message: 'balance must be finite number' })
  }
  if (typeof a.createdAt !== 'string' || isNaN(Date.parse(a.createdAt))) {
    errors.push({ field: 'createdAt', message: 'createdAt must be valid ISO date string' })
  }
  return errors
}

/** Filter out accounts whose status is not active (default active). */
export function activeAccounts(accounts: Account[]): Account[] {
  return accounts.filter((a) => (a as Account & { status?: string }).status !== 'archived')
}

/** Make a new account with default version=1 and status=active. */
export function createAccount(input: Omit<Account, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Account {
  const now = new Date().toISOString()
  return {
    id: input.id ?? `acc-${Math.random().toString(36).slice(2, 10)}`,
    type: input.type,
    name: input.name.trim(),
    balance: input.balance,
    currency: input.currency,
    note: input.note,
    createdAt: input.createdAt ?? now,
  }
}

/** Returns accounts within the type bucket. */
export function filterByType(accounts: Account[], type: AccountType): Account[] {
  return accounts.filter((a) => a.type === type)
}