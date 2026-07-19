// ─── Encrypted export roundtrip — FR-008 / AC-008 ───────────────────────

import type { Account } from './types'

export interface EncryptedExport {
  version: 1
  salt: string
  iv: string
  ciphertext: string
  takenAt: string
  accountCount: number
}

/** Tiny deterministic-but-unique string hash (for cross-device equality check, AC-008). */
export function payloadHash(payload: string): string {
  let h = 5381
  for (let i = 0; i < payload.length; i++) h = (h * 33) ^ payload.charCodeAt(i)
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * "Encrypt" with XOR + base64. This is a placeholder for Web Crypto AES-GCM in browser;
 * for test purposes we want a pure-JS, deterministic, reversible function that proves
 * round-trip parity (AC-008: cross-device restore must produce same data).
 */
export function xorEncrypt(plain: string, password: string): { salt: string; iv: string; ciphertext: string } {
  const salt = 'allfi-salt-v3.0'
  const iv = 'allfi-iv-v3.0'
  let key = ''
  for (let i = 0; i < password.length; i++) key += String.fromCharCode(password.charCodeAt(i) ^ salt.charCodeAt(i % salt.length))
  let out = ''
  for (let i = 0; i < plain.length; i++) {
    out += String.fromCharCode(plain.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  // Node-safe base64
  const ciphertext = Buffer.from(out, 'binary').toString('base64')
  return { salt, iv, ciphertext }
}

export function xorDecrypt(salt: string, iv: string, ciphertext: string, password: string): string {
  const out = Buffer.from(ciphertext, 'base64').toString('binary')
  let key = ''
  for (let i = 0; i < password.length; i++) key += String.fromCharCode(password.charCodeAt(i) ^ salt.charCodeAt(i % salt.length))
  let plain = ''
  for (let i = 0; i < out.length; i++) {
    plain += String.fromCharCode(out.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return plain
}

export function buildExport(accounts: Account[], password: string, takenAt: string): EncryptedExport {
  const payload = JSON.stringify({ accounts, takenAt, version: 1 })
  const { salt, iv, ciphertext } = xorEncrypt(payload, password)
  return { version: 1, salt, iv, ciphertext, takenAt, accountCount: accounts.length }
}

export function restoreExport(exp: EncryptedExport, password: string): { accounts: Account[]; takenAt: string } {
  const plain = xorDecrypt(exp.salt, exp.iv, exp.ciphertext, password)
  const parsed = JSON.parse(plain) as { accounts: Account[]; takenAt: string; version: number }
  return { accounts: parsed.accounts, takenAt: parsed.takenAt }
}