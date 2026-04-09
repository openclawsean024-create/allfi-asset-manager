'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AllAccounts, BankAccount, StockAccount, CryptoAccount, AssetStatus, AssetType } from '@/types/accounts';
import { STATUS_LABELS } from '@/types/accounts';
import FilterBar from '@/components/FilterBar';
import AssetModal from '@/components/AssetModal';

/* ─── STORAGE KEY ───────────────────────────────────── */
const STORAGE_KEY = 'allfi_assets_v1';

/* ─── SEED DATA ─────────────────────────────────────── */
const SEED_DATA: AllAccounts = {
  bankAccounts: [
    {
      id: 'bank-001',
      institution: 'Chase Bank',
      accountName: 'Checking ****4821',
      accountType: 'checking',
      balance: 12450.67,
      currency: 'USD',
      status: 'enabled',
      lastTransaction: { date: '2026-03-30', description: 'Direct Deposit - Payroll', amount: 3200.00 },
      updatedAt: '2026-03-30',
    },
    {
      id: 'bank-002',
      institution: 'Chase Bank',
      accountName: 'Savings ****9832',
      accountType: 'savings',
      balance: 28400.00,
      currency: 'USD',
      status: 'enabled',
      lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 },
      updatedAt: '2026-03-28',
    },
  ],
  stockAccounts: [
    {
      id: 'stock-001',
      institution: 'TD Ameritrade',
      accountName: 'Individual Brokerage',
      status: 'enabled',
      holdings: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50, totalGain: 1092.00, totalGainPercent: 49.09 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20, totalGain: 3163.20, totalGainPercent: 82.38 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50, totalGain: 887.50, totalGainPercent: 28.63 },
      ],
      totalValue: 14310.20,
      totalGain: 5142.70,
      totalGainPercent: 56.06,
      updatedAt: '2026-03-30',
    },
  ],
  cryptoAccounts: [
    {
      id: 'crypto-001',
      institution: 'Coinbase',
      accountName: 'Main Portfolio',
      status: 'enabled',
      assets: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, currentPrice: 67420.00, value: 30339.00, change24h: 2.34 },
        { symbol: 'ETH', name: 'Ethereum', amount: 3.2, currentPrice: 3520.00, value: 11264.00, change24h: -1.28 },
        { symbol: 'SOL', name: 'Solana', amount: 25, currentPrice: 142.80, value: 3570.00, change24h: 5.67 },
      ],
      totalValue: 45173.00,
      totalChange24h: 1.89,
      updatedAt: '2026-03-30',
    },
    {
      id: 'crypto-002',
      institution: 'Binance',
      accountName: 'Trading Account',
      status: 'idle',
      assets: [
        { symbol: 'BNB', name: 'Binance Coin', amount: 5, currentPrice: 598.00, value: 2990.00, change24h: 0.45 },
      ],
      totalValue: 2990.00,
      totalChange24h: 0.45,
      updatedAt: '2026-03-25',
    },
  ],
  totalNetWorth: 103323.87,
  netWorthByType: { bank: 40850.67, stocks: 14310.20, crypto: 48163.00 },
  lastUpdated: new Date().toISOString(),
};

/* ─── HELPERS ───────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 10); }
function today() { return new Date().toISOString().split('T')[0]; }

function loadData(): AllAccounts {
  if (typeof window === 'undefined') return SEED_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DATA;
    return JSON.parse(raw) as AllAccounts;
  } catch { return SEED_DATA; }
}

function saveData(data: AllAccounts) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function recalc(data: AllAccounts): AllAccounts {
  const bank = data.bankAccounts.reduce((s, a) => s + a.balance, 0);
  const stocks = data.stockAccounts.reduce((s, a) => s + a.totalValue, 0);
  const crypto = data.cryptoAccounts.reduce((s, a) => s + a.totalValue, 0);
  return {
    ...data,
    totalNetWorth: bank + stocks + crypto,
    netWorthByType: { bank, stocks, crypto },
    lastUpdated: new Date().toISOString(),
  };
}

function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
}
function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/* ─── STARFIELD ─────────────────────────────────────── */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    interface Star { x: number; y: number; r: number; speed: number; opacity: number; twinkle: number; }
    const stars: Star[] = [];
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }
    function initStars() {
      if (!canvas) return;
      stars.length = 0;
      for (let i = 0; i < Math.floor((window.innerWidth * window.innerHeight) / 6000); i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.4 + 0.2, speed: Math.random() * 0.015 + 0.003, opacity: Math.random() * 0.6 + 0.2, twinkle: Math.random() * Math.PI * 2 });
      }
    }
    let raf: number, t = 0;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;
      for (const s of stars) {
        const flicker = Math.sin(t * s.speed * 100 + s.twinkle) * 0.25 + 0.75;
        const alpha = s.opacity * flicker;
        const color = s.r > 1.0 ? `rgba(240,220,140,${alpha})` : `rgba(200,215,255,${alpha})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} id="starfield" />;
}

/* ─── SCROLL REVEAL ─────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── DONUT CHART ───────────────────────────────────── */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;
  let cumulative = 0;
  const slices = data.map((d) => { const start = cumulative; cumulative += (d.value / total) * 360; return { ...d, start, end: cumulative }; });
  const cx = 90, cy = 90, r = 70;
  function arcPath(startDeg: number, endDeg: number) {
    const start = ((startDeg - 90) * Math.PI) / 180;
    const end = ((endDeg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }
  return (
    <div className="flex items-center gap-10">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {slices.map((s, i) => <path key={i} d={arcPath(s.start, s.end)} fill={s.color} />)}
        <circle cx={cx} cy={cy} r={52} fill="#050a14" />
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="700" fill="#d4af37">{formatCurrency(total, 'USD').replace('.00', '').replace('$', ' $')}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#4a6080" fontSize="11">Total</text>
      </svg>
      <div className="flex flex-col gap-3">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
            <span className="text-sm font-semibold ml-auto pl-8" style={{ color: 'var(--text-primary)' }}>{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── STATUS BADGE ─────────────────────────────────── */
const STATUS_BADGE: Record<AssetStatus, { color: string; bg: string }> = {
  enabled:  { color: '#34d399', bg: 'rgba(52,211,153,0.10)' },
  idle:     { color: '#8a9bb5', bg: 'rgba(138,155,181,0.10)' },
  abnormal: { color: '#f87171', bg: 'rgba(248,113,113,0.10)' },
  pending:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)' },
};

function StatusBadge({ status }: { status: AssetStatus }) {
  const { color, bg } = STATUS_BADGE[status];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ─── ACTION BUTTONS ────────────────────────────────── */
function ActionBtn({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setMenu(!menu)}
        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ⋮
      </button>
      {menu && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8, overflow: 'hidden', zIndex: 10, minWidth: 120, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          <button onClick={() => { onEdit(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>✏️  編輯</button>
          <button onClick={() => { onDelete(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>🗑️  刪除</button>
        </div>
      )}
    </div>
  );
}

/* ─── BANK ROW ─────────────────────────────────────── */
function BankAccountRow({ account, onEdit, onDelete }: { account: BankAccount; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050a14', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
          {account.institution[0]}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{account.institution}</p>
          <p style={{ fontSize: 15, fontWeight: 600 }}>{account.accountName}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {account.lastTransaction.date} · {account.lastTransaction.description}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.balance, account.currency)}</p>
          <StatusBadge status={account.status} />
        </div>
        <ActionBtn onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

/* ─── STOCK ROW ────────────────────────────────────── */
function StockAccountRow({ account, onEdit, onDelete }: { account: StockAccount; onEdit: () => void; onDelete: () => void }) {
  const gainColor = account.totalGain >= 0 ? 'var(--success)' : 'var(--danger)';
  const gainBg = account.totalGain >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050a14', fontWeight: 800, fontSize: 14 }}>{account.institution[0]}</div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{account.institution}</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{account.accountName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={account.status} />
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.totalValue)}</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: gainColor, background: gainBg, padding: '2px 8px', borderRadius: 999 }}>{formatPercent(account.totalGainPercent)}</span>
            </div>
          </div>
          <ActionBtn onEdit={onEdit} onDelete={onDelete} />
        </div>
        {account.holdings.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Symbol', 'Shares', 'Price', 'Total', 'Gain'].map(h => (
                  <th key={h} style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '6px 8px', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {account.holdings.map((h) => {
                const hgColor = h.totalGain >= 0 ? 'var(--success)' : 'var(--danger)';
                return (
                  <tr key={h.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 8px', textAlign: 'right' }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{h.symbol}</span></td>
                    <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{h.shares}</td>
                    <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(h.currentPrice)}</td>
                    <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(h.totalValue)}</td>
                    <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: hgColor }}>{formatPercent(h.totalGainPercent)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── CRYPTO ROW ───────────────────────────────────── */
function CryptoAccountRow({ account, onEdit, onDelete }: { account: CryptoAccount; onEdit: () => void; onDelete: () => void }) {
  const changeColor = account.totalChange24h >= 0 ? 'var(--success)' : 'var(--danger)';
  const changeBg = account.totalChange24h >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050a14', fontWeight: 800, fontSize: 14 }}>{account.institution[0]}</div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{account.institution}</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{account.accountName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={account.status} />
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.totalValue)}</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: changeColor, background: changeBg, padding: '2px 8px', borderRadius: 999 }}>{formatPercent(account.totalChange24h)} 24h</span>
            </div>
          </div>
          <ActionBtn onEdit={onEdit} onDelete={onDelete} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Asset', 'Amount', 'Price', 'Value', '24h'].map(h => (
                <th key={h} style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '6px 8px', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {account.assets.map((a) => {
              const agColor = a.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
              return (
                <tr key={a.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 8px', textAlign: 'right' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{a.symbol}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{a.name}</span>
                  </td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{a.amount}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(a.currentPrice)}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(a.value)}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: agColor }}>{formatPercent(a.change24h)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM MODAL ──────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(5,10,20,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 16, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 24, fontWeight: 500 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>取消</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>確認刪除</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD ACCOUNT BUTTON ────────────────────────────── */
function AddAccountMenu({ onSelect }: { onSelect: (type: 'bank' | 'stock' | 'crypto') => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 18px',
          borderRadius: 8,
          border: '1px solid var(--border-gold)',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,150,12,0.15))',
          color: 'var(--gold)',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.15s',
        }}
      >
        + 新增帳戶
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 10, overflow: 'hidden', zIndex: 10, minWidth: 180, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
          {([['bank','🏦 銀行帳戶'],['stock','📈 股票帳戶'],['crypto','₿ 加密貨幣']] as [string,string][]).map(([type, label]) => (
            <button key={type} onClick={() => { onSelect(type as 'bank' | 'stock' | 'crypto'); setOpen(false); }}
              style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── EMPTY STATE ──────────────────────────────────── */
function EmptyState({ type, hasFilter }: { type: string; hasFilter: boolean }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>
        {type === 'bank' ? '🏦' : type === 'stock' ? '📈' : '₿'}
      </p>
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
        {hasFilter ? '沒有符合條件的帳戶' : '尚無帳戶資料'}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        {hasFilter ? '嘗試調整篩選條件，或點擊右上角「新增帳戶」' : '點擊右上角「新增帳戶」開始管理你的資產'}
      </p>
    </div>
  );
}

/* ─── DASHBOARD ────────────────────────────────────── */
export default function Dashboard() {
  const [data, setData] = useState<AllAccounts>(() => SEED_DATA);
  const [hydrated, setHydrated] = useState(false);

  /* filter & sort state */
  const [filterType, setFilterType] = useState<'all' | AssetType>('all');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'balance' | 'updatedAt'>('updatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalType, setModalType] = useState<'bank' | 'stock' | 'crypto'>('bank');
  const [editTarget, setEditTarget] = useState<{ type: AssetType; id: string } | null>(null);

  /* delete confirm */
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: AssetType; id: string } | null>(null);

  /* hydration */
  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setHydrated(true);
  }, []);

  /* save to localStorage whenever data changes (after hydration) */
  useEffect(() => {
    if (hydrated) saveData(data);
  }, [data, hydrated]);

  useScrollReveal();

  /* ─── CRUD handlers ─── */
  const handleAdd = (type: 'bank' | 'stock' | 'crypto') => {
    setModalType(type);
    setModalMode('add');
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (type: AssetType, id: string) => {
    setModalType(type as 'bank' | 'stock' | 'crypto');
    setModalMode('edit');
    setEditTarget({ type, id });
    setModalOpen(true);
  };

  const handleDeleteConfirm = (type: AssetType, id: string) => {
    setDeleteConfirm({ type, id });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setData(prev => {
      let next: AllAccounts;
      if (type === 'bank') next = { ...prev, bankAccounts: prev.bankAccounts.filter(a => a.id !== id) };
      else if (type === 'stock') next = { ...prev, stockAccounts: prev.stockAccounts.filter(a => a.id !== id) };
      else next = { ...prev, cryptoAccounts: prev.cryptoAccounts.filter(a => a.id !== id) };
      return recalc(next);
    });
    setDeleteConfirm(null);
  };

  const handleSave = (payload: BankAccount | StockAccount | CryptoAccount) => {
    setData(prev => {
      let next: AllAccounts;
      const t = 'institution' in payload ? 'bank' : 'holdings' in payload ? 'stock' : 'crypto';
      if (t === 'bank') {
        const p = payload as BankAccount;
        const exists = prev.bankAccounts.some(a => a.id === p.id);
        next = exists
          ? { ...prev, bankAccounts: prev.bankAccounts.map(a => a.id === p.id ? p : a) }
          : { ...prev, bankAccounts: [...prev.bankAccounts, p] };
      } else if (t === 'stock') {
        const p = payload as StockAccount;
        const exists = prev.stockAccounts.some(a => a.id === p.id);
        next = exists
          ? { ...prev, stockAccounts: prev.stockAccounts.map(a => a.id === p.id ? p : a) }
          : { ...prev, stockAccounts: [...prev.stockAccounts, p] };
      } else {
        const p = payload as CryptoAccount;
        const exists = prev.cryptoAccounts.some(a => a.id === p.id);
        next = exists
          ? { ...prev, cryptoAccounts: prev.cryptoAccounts.map(a => a.id === p.id ? p : a) }
          : { ...prev, cryptoAccounts: [...prev.cryptoAccounts, p] };
      }
      return recalc(next);
    });
    setModalOpen(false);
  };

  /* ─── filter & sort ─── */
  const accountEntries: { type: AssetType; account: BankAccount | StockAccount | CryptoAccount }[] = [
    ...data.bankAccounts.map(a => ({ type: 'bank' as AssetType, account: a })),
    ...data.stockAccounts.map(a => ({ type: 'stock' as AssetType, account: a })),
    ...data.cryptoAccounts.map(a => ({ type: 'crypto' as AssetType, account: a })),
  ];

  const filtered = accountEntries.filter(e => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (filterStatus !== 'all' && (e.account as any).status !== filterStatus) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number, bv: string | number;
    if (sortKey === 'name') {
      const aacc = a.account as BankAccount | StockAccount | CryptoAccount;
      const bacc = b.account as BankAccount | StockAccount | CryptoAccount;
      av = 'institution' in aacc ? (aacc as BankAccount).institution : (aacc as StockAccount | CryptoAccount).accountName;
      bv = 'institution' in bacc ? (bacc as BankAccount).institution : (bacc as StockAccount | CryptoAccount).accountName;
      return sortDir === 'asc' ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string);
    } else if (sortKey === 'balance') {
      av = 'balance' in a.account ? (a.account as BankAccount).balance : (a.account as StockAccount | CryptoAccount).totalValue;
      bv = 'balance' in b.account ? (b.account as BankAccount).balance : (b.account as StockAccount | CryptoAccount).totalValue;
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    } else {
      av = (a.account as BankAccount | StockAccount | CryptoAccount).updatedAt;
      bv = (b.account as BankAccount | StockAccount | CryptoAccount).updatedAt;
      return sortDir === 'asc' ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string);
    }
  });

  const totalCount = accountEntries.length;
  const filteredCount = filtered.length;

  /* ─── derived chart data ─── */
  const chartData = [
    { label: 'Banking', value: data.netWorthByType.bank, color: '#1a2d4a' },
    { label: 'Securities', value: data.netWorthByType.stocks, color: '#2d4a7a' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#d4af37' },
  ];
  const totalNetWorth = data.totalNetWorth;
  const bankPct = totalNetWorth > 0 ? ((data.netWorthByType.bank / totalNetWorth) * 100).toFixed(1) : '0.0';
  const stockPct = totalNetWorth > 0 ? ((data.netWorthByType.stocks / totalNetWorth) * 100).toFixed(1) : '0.0';
  const cryptoPct = totalNetWorth > 0 ? ((data.netWorthByType.crypto / totalNetWorth) * 100).toFixed(1) : '0.0';

  /* ─── edit data for modal ─── */
  const editData = editTarget
    ? (editTarget.type === 'bank'
        ? data.bankAccounts.find(a => a.id === editTarget.id)
        : editTarget.type === 'stock'
        ? data.stockAccounts.find(a => a.id === editTarget.id)
        : data.cryptoAccounts.find(a => a.id === editTarget.id)) as BankAccount | StockAccount | CryptoAccount | undefined
    : undefined;

  const hasFilter = filterType !== 'all' || filterStatus !== 'all';

  if (!hydrated) {
    return (
      <>
        <Starfield />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, border: '2px solid var(--border-gold)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>載入中...</p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  return (
    <>
      <Starfield />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#050a14' }}>A</div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>AllFi</span>
              <span style={{ fontSize: 10, color: 'rgba(212,175,55,0.5)', fontWeight: 400, letterSpacing: '0.1em', marginLeft: 4 }}>PRIVATE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Portfolio Overview</span>
              <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Net Worth</p>
                <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--gold)' }}>{formatCurrency(data.totalNetWorth)}</p>
              </div>
              <AddAccountMenu onSelect={handleAdd} />
            </div>
          </div>
        </div>

        {/* SUBNAV */}
        <div style={{ background: 'rgba(10,22,40,0.85)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 44, display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Overview', 'Banking', 'Securities', 'Digital Assets', 'Insights'].map((item, i) => (
              <button key={item} className={`subnav-btn${i === 0 ? ' active' : ''}`}>{item}</button>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 80px' }}>

          {/* HERO CARD */}
          <div className="gold-card reveal" style={{ padding: '2px', marginBottom: 40 }}>
            <div className="gold-card-inner" style={{ padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Total Net Worth · {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h1 className="net-worth-animated" style={{ fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
                  {formatCurrency(data.totalNetWorth)}
                </h1>
                <div style={{ display: 'flex', gap: 32 }}>
                  {[
                    { label: 'Banking', value: bankPct + '%', amount: formatCurrency(data.netWorthByType.bank) },
                    { label: 'Securities', value: stockPct + '%', amount: formatCurrency(data.netWorthByType.stocks) },
                    { label: 'Digital Assets', value: cryptoPct + '%', amount: formatCurrency(data.netWorthByType.crypto) },
                  ].map((item, i) => (
                    <div key={item.label} className={`reveal reveal-delay-${i + 1}`}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{item.value}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
              <DonutChart data={chartData} />
            </div>
          </div>

          {/* FILTER BAR */}
          <FilterBar
            filterType={filterType}
            filterStatus={filterStatus}
            sortKey={sortKey}
            sortDir={sortDir}
            onFilterType={setFilterType}
            onFilterStatus={setFilterStatus}
            onSortKey={setSortKey}
            onSortDir={setSortDir}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />

          {/* ACCOUNTS */}
          {sorted.length === 0 ? (
            <EmptyState type={filterType === 'all' ? 'bank' : filterType} hasFilter={hasFilter} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sorted.map(({ type, account }) => {
                const edit = () => handleEdit(type, account.id);
                const del = () => handleDeleteConfirm(type, account.id);
                if (type === 'bank') return <BankAccountRow key={account.id} account={account as BankAccount} onEdit={edit} onDelete={del} />;
                if (type === 'stock') return <StockAccountRow key={account.id} account={account as StockAccount} onEdit={edit} onDelete={del} />;
                return <CryptoAccountRow key={account.id} account={account as CryptoAccount} onEdit={edit} onDelete={del} />;
              })}
            </div>
          )}

          {/* FOOTER */}
          <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#050a14' }}>A</div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>AllFi</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              資料存於本機瀏覽器 · Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
          </footer>
        </main>
      </div>

      {/* ASSET MODAL */}
      {modalOpen && (
        <AssetModal
          mode={modalMode}
          accountType={modalType}
          editData={editData}
          onSave={handleSave}
          onDelete={editTarget ? () => { setModalOpen(false); handleDeleteConfirm(editTarget.type, editTarget.id); } : undefined}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <ConfirmModal
          message="確定要刪除這個帳戶嗎？此操作無法復原。"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
