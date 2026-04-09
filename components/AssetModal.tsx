'use client';

import { useState, useEffect } from 'react';
import {
  AssetStatus,
  AssetType,
  STATUS_LABELS,
  BankAccount,
  StockAccount,
  CryptoAccount,
} from '@/types/accounts';

/* ─── shared helper ─────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function today() {
  return new Date().toISOString().split('T')[0];
}

/* ─── props ─────────────────────────────────────────── */
type Mode = 'add' | 'edit';
type AccountType = 'bank' | 'stock' | 'crypto';

interface Props {
  mode: Mode;
  accountType: AccountType;
  /** existing data for edit mode */
  editData?: BankAccount | StockAccount | CryptoAccount;
  onSave: (data: BankAccount | StockAccount | CryptoAccount) => void;
  onDelete?: () => void;
  onClose: () => void;
}

/* ─── Bank form ─────────────────────────────────────── */
function BankForm({ data, on }: { data?: BankAccount; on: BankAccount }) {
  return (
    <>
      <Field label="銀行名稱">
        <input value={on.institution} onChange={e => (on.institution = e.target.value)} placeholder="例：Chase Bank" required />
      </Field>
      <Field label="帳戶名稱">
        <input value={on.accountName} onChange={e => (on.accountName = e.target.value)} placeholder="例：Checking ****4821" required />
      </Field>
      <Field label="帳戶類型">
        <select value={on.accountType} onChange={e => (on.accountType = e.target.value as 'checking' | 'savings')}>
          <option value="checking">支票帳戶</option>
          <option value="savings">儲蓄帳戶</option>
        </select>
      </Field>
      <Field label="餘額">
        <input type="number" step="0.01" value={on.balance} onChange={e => (on.balance = +e.target.value)} placeholder="0.00" required />
      </Field>
      <Field label="幣別">
        <select value={on.currency} onChange={e => (on.currency = e.target.value)}>
          <option value="USD">USD</option>
          <option value="TWD">TWD</option>
          <option value="CNY">CNY</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </Field>
      <Field label="狀態">
        <select value={on.status} onChange={e => (on.status = e.target.value as AssetStatus)}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Field>
      <Field label="最後交易日期">
        <input type="date" value={on.lastTransaction.date} onChange={e => (on.lastTransaction.date = e.target.value)} />
      </Field>
      <Field label="最後交易說明">
        <input value={on.lastTransaction.description} onChange={e => (on.lastTransaction.description = e.target.value)} placeholder="例：薪水入帳" />
      </Field>
      <Field label="最後交易金額">
        <input type="number" step="0.01" value={on.lastTransaction.amount} onChange={e => (on.lastTransaction.amount = +e.target.value)} />
      </Field>
    </>
  );
}

/* ─── Stock form ────────────────────────────────────── */
function StockForm({ on }: { on: Partial<StockAccount> }) {
  return (
    <>
      <Field label="券商名稱">
        <input value={on.institution} onChange={e => (on.institution = e.target.value)} placeholder="例：TD Ameritrade" required />
      </Field>
      <Field label="帳戶名稱">
        <input value={on.accountName} onChange={e => (on.accountName = e.target.value)} placeholder="例：個人證券帳戶" required />
      </Field>
      <Field label="狀態">
        <select value={on.status} onChange={e => (on.status = e.target.value as AssetStatus)}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Field>
    </>
  );
}

/* ─── Crypto form ───────────────────────────────────── */
function CryptoForm({ on }: { on: Partial<CryptoAccount> }) {
  return (
    <>
      <Field label="交易所 / 錢包名稱">
        <input value={on.institution} onChange={e => (on.institution = e.target.value)} placeholder="例：Coinbase" required />
      </Field>
      <Field label="帳戶名稱">
        <input value={on.accountName} onChange={e => (on.accountName = e.target.value)} placeholder="例：Main Portfolio" required />
      </Field>
      <Field label="狀態">
        <select value={on.status} onChange={e => (on.status = e.target.value as AssetStatus)}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Field>
    </>
  );
}

/* ─── shared field ──────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function inputStyle() {
  return {
    width: '100%',
    padding: '8px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.15s',
  } as const;
}

/* ─── main modal ────────────────────────────────────── */
export default function AssetModal({ mode, accountType, editData, onSave, onDelete, onClose }: Props) {
  const isEdit = mode === 'edit';

  /* bank state */
  const [bank, setBank] = useState<BankAccount>(() => {
    if (isEdit && editData && 'balance' in editData) {
      const d = editData as BankAccount;
      return { ...d };
    }
    return {
      id: uid(),
      institution: '',
      accountName: '',
      accountType: 'checking',
      balance: 0,
      currency: 'USD',
      status: 'enabled',
      lastTransaction: { date: today(), description: '', amount: 0 },
      updatedAt: today(),
    };
  });

  /* stock state */
  const [stock, setStock] = useState<Partial<StockAccount>>(() => {
    if (isEdit && editData && 'holdings' in editData) {
      return { ...editData };
    }
    return { id: uid(), institution: '', accountName: '', status: 'enabled', holdings: [], totalValue: 0, totalGain: 0, totalGainPercent: 0, updatedAt: today() };
  });

  /* crypto state */
  const [cryptoAcc, setCrypto] = useState<Partial<CryptoAccount>>(() => {
    if (isEdit && editData && 'assets' in editData) {
      return { ...editData };
    }
    return { id: uid(), institution: '', accountName: '', status: 'enabled', assets: [], totalValue: 0, totalChange24h: 0, updatedAt: today() };
  });

  /* typing fix for bank mutation */
  const bankProxy = {
    get() { return bank; },
    set(changes: Partial<BankAccount>) {
      setBank(prev => ({ ...prev, ...changes }));
    },
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let payload: BankAccount | StockAccount | CryptoAccount;
    if (accountType === 'bank') {
      payload = { ...bank, updatedAt: today() };
    } else if (accountType === 'stock') {
      payload = { ...stock, updatedAt: today() } as StockAccount;
    } else {
      payload = { ...cryptoAcc, updatedAt: today() } as CryptoAccount;
    }
    onSave(payload);
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(5,10,20,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>
              {isEdit ? '編輯帳戶' : '新增帳戶'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {accountType === 'bank' ? '銀行帳戶' : accountType === 'stock' ? '股票帳戶' : '加密貨幣帳戶'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto' }}>
          {accountType === 'bank' && (
            <>
              <BankForm data={editData as BankAccount | undefined} on={bankProxy as any} />
            </>
          )}
          {accountType === 'stock' && <StockForm on={stock} />}
          {accountType === 'crypto' && <CryptoForm on={cryptoAcc} />}

          {/* actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {isEdit && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid var(--danger)',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                刪除
              </button>
            )}
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                color: '#050a14',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isEdit ? '儲存變更' : '新增帳戶'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
