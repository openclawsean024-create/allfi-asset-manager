'use client';

import { useEffect, useRef, useState } from 'react';
import type { AllAccounts, BankAccount, StockAccount, CryptoAccount, AssetStatus, AssetType } from '@/types/accounts';
import { STATUS_LABELS } from '@/types/accounts';
import FilterBar from '@/components/FilterBar';
import AssetModal from '@/components/AssetModal';

const STORAGE_KEY = 'allfi_assets_v1';
const PRIVACY_KEY = 'allfi_privacy_mode';
const CURRENCY_KEY = 'allfi_currency';
const FX = { USDC: 1, BTC: 68000, ETH: 3500, CNY: 7.25 } as const;
type Currency = keyof typeof FX;

const SEED_DATA: AllAccounts = {
  bankAccounts: [
    { id: 'bank-001', institution: 'Chase Bank', accountName: 'Checking ****4821', accountType: 'checking', balance: 12450.67, currency: 'USD', status: 'enabled', lastTransaction: { date: '2026-03-30', description: 'Direct Deposit - Payroll', amount: 3200 }, updatedAt: '2026-03-30' },
    { id: 'bank-002', institution: 'Chase Bank', accountName: 'Savings ****9832', accountType: 'savings', balance: 28400, currency: 'USD', status: 'enabled', lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 }, updatedAt: '2026-03-28' },
  ],
  stockAccounts: [
    { id: 'stock-001', institution: 'TD Ameritrade', accountName: 'Individual Brokerage', status: 'enabled', holdings: [], totalValue: 14310.2, totalGain: 5142.7, totalGainPercent: 56.06, updatedAt: '2026-03-30' },
  ],
  cryptoAccounts: [
    { id: 'crypto-001', institution: 'Coinbase', accountName: 'Main Portfolio', status: 'enabled', assets: [], totalValue: 45173, totalChange24h: 1.89, updatedAt: '2026-03-30' },
  ],
  totalNetWorth: 103323.87,
  netWorthByType: { bank: 40850.67, stocks: 14310.2, crypto: 48163 },
  lastUpdated: new Date().toISOString(),
};

function loadData() { try { return typeof window === 'undefined' ? SEED_DATA : (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || SEED_DATA); } catch { return SEED_DATA; } }
function saveData(data: AllAccounts) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
function recalc(data: AllAccounts): AllAccounts { const bank = data.bankAccounts.reduce((s, a) => s + a.balance, 0); const stocks = data.stockAccounts.reduce((s, a) => s + a.totalValue, 0); const crypto = data.cryptoAccounts.reduce((s, a) => s + a.totalValue, 0); return { ...data, totalNetWorth: bank + stocks + crypto, netWorthByType: { bank, stocks, crypto }, lastUpdated: new Date().toISOString() }; }
function convert(value: number, currency: Currency) { if (currency === 'BTC') return value / FX.BTC; if (currency === 'ETH') return value / FX.ETH; if (currency === 'CNY') return value * FX.CNY; return value; }
function formatCurrency(value: number, currency: Currency) { if (currency === 'BTC') return `${value.toFixed(4)} BTC`; if (currency === 'ETH') return `${value.toFixed(3)} ETH`; if (currency === 'CNY') return `¥${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`; return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`; }
function Starfield() { const ref = useRef<HTMLCanvasElement>(null); useEffect(() => { const c = ref.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return; const draw = () => { c.width = innerWidth; c.height = innerHeight; ctx.clearRect(0, 0, c.width, c.height); for (let i = 0; i < 80; i++) { ctx.fillStyle = i % 7 ? 'rgba(200,215,255,0.6)' : 'rgba(212,175,55,0.6)'; ctx.beginPath(); ctx.arc(Math.random() * c.width, Math.random() * c.height, Math.random() * 1.2 + 0.2, 0, Math.PI * 2); ctx.fill(); } }; draw(); addEventListener('resize', draw); return () => removeEventListener('resize', draw); }, []); return <canvas ref={ref} id="starfield" />; }
function StatusBadge({ status }: { status: AssetStatus }) { const colors: Record<AssetStatus, string> = { enabled: '#34d399', idle: '#8a9bb5', abnormal: '#f87171', pending: '#fbbf24' }; return <span style={{ fontSize: 10, fontWeight: 700, color: colors[status], textTransform: 'uppercase' }}>{STATUS_LABELS[status]}</span>; }
function Row({ title, sub, value, status, privacy }: { title: string; sub: string; value: string; status: AssetStatus; privacy: boolean }) { return <div className="gold-card" style={{ padding: 2, marginBottom: 14 }}><div className="gold-card-inner" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', gap: 16 }}><div><div style={{ fontWeight: 700 }}>{title}</div><div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{sub}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: 18, fontWeight: 700 }}>{privacy ? '***' : value}</div><StatusBadge status={status} /></div></div></div>; }

export default function DashboardPage() {
  const [data, setData] = useState<AllAccounts>(SEED_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [privacy, setPrivacy] = useState(false);
  const [filterType, setFilterType] = useState<'all' | AssetType>('all');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'balance' | 'updatedAt'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { const loaded = loadData(); setData(loaded); setHydrated(true); setCurrency((localStorage.getItem(CURRENCY_KEY) as Currency) || 'USDC'); setPrivacy(localStorage.getItem(PRIVACY_KEY) === 'true'); const onKey = (e: KeyboardEvent) => { if (e.ctrlKey && e.key.toLowerCase() === 'h') { e.preventDefault(); setPrivacy(v => { const next = !v; localStorage.setItem(PRIVACY_KEY, String(next)); return next; }); } }; addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey); }, []);
  useEffect(() => { if (hydrated) saveData(data); }, [data, hydrated]);

  const entries = [
    ...data.bankAccounts.map(a => ({ type: 'bank' as const, id: a.id, name: a.accountName, value: a.balance, status: a.status, updatedAt: a.updatedAt, label: a.institution })),
    ...data.stockAccounts.map(a => ({ type: 'stock' as const, id: a.id, name: a.accountName, value: a.totalValue, status: a.status, updatedAt: a.updatedAt, label: a.institution })),
    ...data.cryptoAccounts.map(a => ({ type: 'crypto' as const, id: a.id, name: a.accountName, value: a.totalValue, status: a.status, updatedAt: a.updatedAt, label: a.institution })),
  ].filter(e => (filterType === 'all' || e.type === filterType) && (filterStatus === 'all' || e.status === filterStatus));

  const sorted = [...entries].sort((a, b) => {
    if (sortKey === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    if (sortKey === 'balance') return sortDir === 'asc' ? a.value - b.value : b.value - a.value;
    return sortDir === 'asc' ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt);
  });

  if (!hydrated) return <><Starfield /><div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }} /></>;

  return <><Starfield /><div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}><div className="topbar"><div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>AllFi</div><div style={{ display: 'flex', gap: 8 }}><select value={currency} onChange={e => { setCurrency(e.target.value as Currency); localStorage.setItem(CURRENCY_KEY, e.target.value); }}>{['USDC', 'BTC', 'ETH', 'CNY'].map(c => <option key={c}>{c}</option>)}</select><button onClick={() => { setPrivacy(v => { const next = !v; localStorage.setItem(PRIVACY_KEY, String(next)); return next; }); }}>{privacy ? '🙈' : '👁️'}</button></div></div></div><main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 80px' }}><div className="gold-card" style={{ padding: 2, marginBottom: 20 }}><div className="gold-card-inner" style={{ padding: 24 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}><div><div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Total Net Worth</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 700, color: 'var(--gold)' }}>{privacy ? '***' : formatCurrency(convert(data.totalNetWorth, currency), currency)}</div></div><div style={{ display: 'flex', gap: 16 }}><div>Banking {((data.netWorthByType.bank / data.totalNetWorth) * 100).toFixed(1)}%</div><div>Securities {((data.netWorthByType.stocks / data.totalNetWorth) * 100).toFixed(1)}%</div><div>Digital Assets {((data.netWorthByType.crypto / data.totalNetWorth) * 100).toFixed(1)}%</div></div></div></div></div><div className="gold-card" style={{ padding: 2, marginBottom: 20 }}><div className="gold-card-inner" style={{ padding: 24 }}><h2 style={{ marginBottom: 12 }}>資產趨勢</h2><div style={{ height: 180, border: '1px solid var(--border)', borderRadius: 12, background: 'linear-gradient(180deg, rgba(212,175,55,0.08), transparent)' }} /></div></div><FilterBar filterType={filterType} filterStatus={filterStatus} sortKey={sortKey} sortDir={sortDir} onFilterType={setFilterType} onFilterStatus={setFilterStatus} onSortKey={setSortKey} onSortDir={setSortDir} totalCount={data.bankAccounts.length + data.stockAccounts.length + data.cryptoAccounts.length} filteredCount={entries.length} />{sorted.map(item => <Row key={item.id} title={item.name} sub={`${item.label} · ${item.updatedAt}`} value={formatCurrency(convert(item.value, currency), currency)} status={item.status} privacy={privacy} />)}<footer style={{ marginTop: 48, color: 'var(--text-muted)' }}>資料存於本機瀏覽器</footer></main>{modalOpen && <AssetModal mode="add" accountType="bank" onSave={() => setModalOpen(false)} onClose={() => setModalOpen(false)} />}</div></>;
}
