'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Edit2, Sun, Moon, Download, Upload, Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { ACCOUNT_TYPES, ACCOUNT_TYPE_META, CURRENCIES, CURRENCY_SYMBOL, DEFAULT_RATES_TO_TWD, STORAGE_KEY, type Account, type AccountType, type Currency } from '@/app/lib/types'
import { exportAccountsCSV, parseAccountsCSV, downloadCSV } from '@/app/lib/csv'

const DEMO_ACCOUNTS: Account[] = [
  { id: 'd1', type: 'bank', name: '台新銀行', balance: 54000, currency: 'TWD', note: '薪轉戶', createdAt: '2026-07-01' },
  { id: 'd2', type: 'bank', name: '中國信託', balance: 123000, currency: 'TWD', createdAt: '2026-07-02' },
  { id: 'd3', type: 'broker', name: '富邦證券', balance: 285000, currency: 'TWD', note: '0050 + 00878', createdAt: '2026-07-03' },
  { id: 'd4', type: 'cash', name: '皮夾零錢', balance: 1800, currency: 'TWD', createdAt: '2026-07-04' },
  { id: 'd5', type: 'credit', name: '國泰信用卡', balance: -8200, currency: 'TWD', note: '本月帳單', createdAt: '2026-07-05' },
  { id: 'd6', type: 'crypto', name: 'Binance BTC', balance: 0.045, currency: 'BTC', note: '冷錢包 70%', createdAt: '2026-07-06' },
]

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [hydrated, setHydrated] = useState(false)
  const [rates, setRates] = useState(DEFAULT_RATES_TO_TWD)

  // Hydrate
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { accounts: Account[]; theme: 'dark' | 'light'; rates: typeof DEFAULT_RATES_TO_TWD }
        setAccounts(parsed.accounts || DEMO_ACCOUNTS)
        setTheme(parsed.theme || 'dark')
        if (parsed.rates) setRates(parsed.rates)
      } catch {
        setAccounts(DEMO_ACCOUNTS)
      }
    } else {
      setAccounts(DEMO_ACCOUNTS)
    }
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, theme, rates }))
  }, [accounts, theme, rates, hydrated])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light', theme === 'light')
    }
  }, [theme])

  const convertToTWD = (a: Account): number => a.balance * (rates[a.currency] || 1)
  const totalTWD = useMemo(() => accounts.reduce((s, a) => s + convertToTWD(a), 0), [accounts, rates])
  const totalAssets = useMemo(() => accounts.filter((a) => !ACCOUNT_TYPE_META[a.type].isLiability).reduce((s, a) => s + convertToTWD(a), 0), [accounts, rates])
  const totalLiabilities = useMemo(() => accounts.filter((a) => ACCOUNT_TYPE_META[a.type].isLiability).reduce((s, a) => s + convertToTWD(a), 0), [accounts, rates])
  const liabilityRatio = totalAssets > 0 ? Math.abs(totalLiabilities) / totalAssets : 0
  const byType = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of accounts) {
      const v = Math.abs(convertToTWD(a))
      map[a.type] = (map[a.type] || 0) + v
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [accounts, rates])

  const handleSave = (acc: Account) => {
    setAccounts((prev) => {
      const exists = prev.find((a) => a.id === acc.id)
      if (exists) return prev.map((a) => (a.id === acc.id ? acc : a))
      return [...prev, acc]
    })
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('確定刪除？')) return
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const handleExport = () => {
    const csv = exportAccountsCSV(accounts)
    downloadCSV(csv, `allfi-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseAccountsCSV(text)
      if (parsed.length > 0) {
        if (confirm(`匯入 ${parsed.length} 筆帳戶？將覆蓋現有資料。`)) {
          setAccounts(parsed)
        }
      } else {
        alert('CSV 解析失敗')
      }
    }
    reader.readAsText(file)
  }

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center opacity-60 text-sm">載入中…</div>
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 sticky top-0 backdrop-blur-md bg-bg/70 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-black">AllFi 資產管家</h1>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">v2.0 · Pure Frontend · Zero Account</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-surface">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={handleExport} className="p-2 rounded-lg hover:bg-surface" title="匯出 CSV">
              <Download size={16} />
            </button>
            <label className="p-2 rounded-lg hover:bg-surface cursor-pointer" title="匯入 CSV">
              <Upload size={16} />
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6 space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <section className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card label="總資產" value={totalAssets} color="text-emerald-400" />
          <Card label="負債" value={totalLiabilities} color="text-red-400" />
          <Card label="淨值" value={totalTWD} color="text-amber-400" />
          <Card label="負債率" value={liabilityRatio * 100} color="text-blue-400" suffix="%" />
        </section>

        {/* Distribution */}
        <section className="bg-surface rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-black uppercase tracking-wider opacity-60 mb-3">類別分布</h2>
          {byType.length === 0 ? (
            <div className="text-center py-8 opacity-50 text-sm">無資料。新增第一個帳戶開始</div>
          ) : (
            <div className="space-y-2">
              {byType.map(([type, val]) => {
                const meta = ACCOUNT_TYPE_META[type as AccountType]
                const pct = totalAssets > 0 ? (val / totalAssets) * 100 : 0
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{meta.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{meta.label}</span>
                        <span className="opacity-70 tabular-nums">NT$ {Math.round(val).toLocaleString()} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-accent-2" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Accounts List */}
        <section className="bg-surface rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider opacity-60">帳戶 ({accounts.length})</h2>
            <button onClick={() => { setEditing(null); setShowForm(true) }} className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-bold flex items-center gap-1">
              <Plus size={14} /> 新增
            </button>
          </div>
          {accounts.length === 0 ? (
            <div className="text-center py-12 opacity-50 text-sm">還沒有帳戶。點「新增」開始 ✨</div>
          ) : (
            <div className="space-y-2">
              {accounts.map((a) => {
                const meta = ACCOUNT_TYPE_META[a.type]
                const isLiability = meta.isLiability
                return (
                  <div key={a.id} className="bg-surface-2 rounded-lg p-3 flex items-center gap-3 border border-white/5">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{a.name}</div>
                      {a.note && <div className="text-xs opacity-50 truncate">{a.note}</div>}
                    </div>
                    <div className={`text-base font-black tabular-nums ${isLiability ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isLiability ? '-' : ''}{CURRENCY_SYMBOL[a.currency]}{a.balance.toLocaleString()}
                      <span className="text-xs opacity-50 ml-1">{a.currency}</span>
                    </div>
                    <button onClick={() => { setEditing(a); setShowForm(true) }} className="p-1.5 rounded hover:bg-surface">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded hover:bg-red-500/10 text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* FX Rates */}
        <section className="bg-surface rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-black uppercase tracking-wider opacity-60 mb-3">💱 匯率設定 (換算為 TWD)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CURRENCIES.filter((c) => c !== 'TWD').map((c) => (
              <div key={c}>
                <div className="text-xs opacity-50 mb-1">1 {c} =</div>
                <div className="flex items-center gap-1 bg-surface-2 rounded-lg p-2">
                  <input
                    type="number"
                    value={rates[c]}
                    onChange={(e) => setRates((r) => ({ ...r, [c]: parseFloat(e.target.value) || 0 }))}
                    className="bg-transparent w-full outline-none text-sm"
                  />
                  <span className="text-xs opacity-50">NT$</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] opacity-50 mt-3">最後更新：2026-07 · 自訂匯率立即生效</p>
        </section>
      </main>

      {showForm && (
        <AccountForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}

function Card({ label, value, color, suffix = '' }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-white/5">
      <div className="text-xs font-black uppercase tracking-wider opacity-50 mb-2">{label}</div>
      <div className={`text-3xl font-light tabular-nums leading-none ${color}`}>
        {suffix ? value.toFixed(1) : Math.round(value).toLocaleString()}{suffix}
      </div>
    </div>
  )
}

function AccountForm({ initial, onSave, onClose }: { initial: Account | null; onSave: (a: Account) => void; onClose: () => void }) {
  const [type, setType] = useState<AccountType>(initial?.type || 'bank')
  const [name, setName] = useState(initial?.name || '')
  const [balance, setBalance] = useState(initial?.balance ?? 0)
  const [currency, setCurrency] = useState<Currency>(initial?.currency || 'TWD')
  const [note, setNote] = useState(initial?.note || '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      id: initial?.id || `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type, name: name.trim(), balance, currency, note,
      createdAt: initial?.createdAt || new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5">
      <form onSubmit={submit} className="bg-surface rounded-2xl p-6 w-full max-w-md border border-white/10 space-y-4">
        <h3 className="text-lg font-bold">{initial ? '編輯' : '新增'}帳戶</h3>
        <div>
          <label className="text-xs font-bold opacity-60 block mb-1">類型</label>
          <div className="grid grid-cols-3 gap-2">
            {ACCOUNT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-2 py-2.5 rounded-lg flex items-center gap-2 text-xs transition ${
                  type === t ? 'bg-accent text-white' : 'bg-surface-2'
                }`}
              >
                <span>{ACCOUNT_TYPE_META[t].emoji}</span>
                <span className="font-bold">{ACCOUNT_TYPE_META[t].label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold opacity-60 block mb-1">帳戶名稱</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：台新銀行 富邦"
            className="w-full px-3 py-2 bg-surface-2 rounded-lg border border-white/5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold opacity-60 block mb-1">餘額</label>
            <input
              type="number"
              step="0.0001"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-surface-2 rounded-lg border border-white/5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold opacity-60 block mb-1">幣別</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full px-3 py-2 bg-surface-2 rounded-lg border border-white/5 text-sm"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold opacity-60 block mb-1">備註</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="選填"
            className="w-full px-3 py-2 bg-surface-2 rounded-lg border border-white/5 text-sm"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-surface-2 py-2.5 rounded-lg font-bold">取消</button>
          <button type="submit" disabled={!name.trim()} className="flex-1 bg-accent text-white py-2.5 rounded-lg font-bold">儲存</button>
        </div>
      </form>
    </div>
  )
}
