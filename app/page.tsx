'use client';

import { useEffect, useState } from 'react';
import type { AllAccounts } from '@/types/accounts';

// Seed data — rendered immediately; replaced by API data once fetched
const SEED_DATA: AllAccounts = {
  bankAccounts: [
    {
      id: 'bank-001',
      institution: 'Chase Bank',
      accountName: 'Checking ****4821',
      accountType: 'checking',
      balance: 12450.67,
      currency: 'USD',
      lastTransaction: { date: '2026-03-30', description: 'Direct Deposit - Payroll', amount: 3200.00 },
    },
    {
      id: 'bank-002',
      institution: 'Chase Bank',
      accountName: 'Savings ****9832',
      accountType: 'savings',
      balance: 28400.00,
      currency: 'USD',
      lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 },
    },
  ],
  stockAccounts: [
    {
      id: 'stock-001',
      institution: 'TD Ameritrade',
      accountName: 'Individual Brokerage',
      holdings: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50, totalGain: 1092.00, totalGainPercent: 49.09 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20, totalGain: 3163.20, totalGainPercent: 82.38 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50, totalGain: 887.50, totalGainPercent: 28.63 },
      ],
      totalValue: 14310.20,
      totalGain: 5142.70,
      totalGainPercent: 56.06,
    },
  ],
  cryptoAccounts: [
    {
      id: 'crypto-001',
      institution: 'Coinbase',
      accountName: 'Main Portfolio',
      assets: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, currentPrice: 67420.00, value: 30339.00, change24h: 2.34 },
        { symbol: 'ETH', name: 'Ethereum', amount: 3.2, currentPrice: 3520.00, value: 11264.00, change24h: -1.28 },
        { symbol: 'SOL', name: 'Solana', amount: 25, currentPrice: 142.80, value: 3570.00, change24h: 5.67 },
      ],
      totalValue: 45173.00,
      totalChange24h: 1.89,
    },
    {
      id: 'crypto-002',
      institution: 'Binance',
      accountName: 'Trading Account',
      assets: [
        { symbol: 'BNB', name: 'Binance Coin', amount: 5, currentPrice: 598.00, value: 2990.00, change24h: 0.45 },
      ],
      totalValue: 2990.00,
      totalChange24h: 0.45,
    },
  ],
  totalNetWorth: 103323.87,
  netWorthByType: { bank: 40850.67, stocks: 14310.20, crypto: 48163.00 },
  lastUpdated: new Date().toISOString(),
};

function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += (d.value / total) * 360;
    return { ...d, start, end: cumulative };
  });
  const cx = 90, cy = 90, r = 68;
  function arcPath(startDeg: number, endDeg: number) {
    const start = ((startDeg - 90) * Math.PI) / 180;
    const end = ((endDeg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }
  return (
    <div className="flex items-center gap-8">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {slices.map((s, i) => (
          <path key={i} d={arcPath(s.start, s.end)} fill={s.color} />
        ))}
        <circle cx={cx} cy={cy} r={50} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#003D33">
          {formatCurrency(total, 'USD').replace('.00', '').replace('$', ' $')}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fill="#8FA3AE" fontSize="10">Total</text>
      </svg>
      <div className="flex flex-col gap-3">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-[--color-text-secondary]">{s.label}</span>
            <span className="text-sm font-semibold ml-auto pl-4 text-[--color-text-primary]">{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'green' | 'default' | 'success' | 'danger' }) {
  const map: Record<string, string> = {
    green: 'background:#E8F9ED;color:#00B900',
    success: 'background:#D1FAE5;color:#00875A',
    danger: 'background:#FEE2E2;color:#DE3618',
    default: 'background:#F0F4F8;color:#4A6572',
  };
  const [bg, color] = map[variant].split(';');
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.03em', background: bg, color }}>
      {children}
    </span>
  );
}

function BankAccountCard({ account }: { account: AllAccounts['bankAccounts'][0] }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[--color-border] shadow-sm hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #003D33, #00594C)' }}>
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[--color-text-muted] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[--color-text-primary]">{account.accountName}</p>
          </div>
        </div>
        <Badge variant="green">{account.accountType}</Badge>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold font-serif text-[--color-text-primary]">{formatCurrency(account.balance)}</p>
        <div className="text-right">
          <p className="text-xs text-[--color-text-muted]">{account.lastTransaction.description}</p>
          <p className="text-xs text-[--color-text-muted]">{account.lastTransaction.date}</p>
        </div>
      </div>
    </div>
  );
}

function StockAccountCard({ account }: { account: AllAccounts['stockAccounts'][0] }) {
  const gainColor = account.totalGain >= 0 ? '#00875A' : '#DE3618';
  return (
    <div className="bg-white rounded-2xl p-5 border border-[--color-border] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #003D33, #00594C)' }}>
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[--color-text-muted] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[--color-text-primary]">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-serif text-[--color-text-primary]">{formatCurrency(account.totalValue)}</p>
          <span className="text-xs font-bold" style={{ color: gainColor }}>{formatPercent(account.totalGainPercent)}</span>
        </div>
      </div>
      <div className="border-t border-[--color-border] pt-3">
        {account.holdings.map((h, i) => (
          <div key={h.symbol} className={`flex items-center justify-between py-2 ${i < account.holdings.length - 1 ? 'border-b border-[--color-border]' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[--color-text-primary]">{h.symbol}</span>
              <span className="text-xs text-[--color-text-muted]">{h.shares} shares</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[--color-text-muted]">{formatCurrency(h.currentPrice)}</span>
              <span className="text-sm font-semibold">{formatCurrency(h.totalValue)}</span>
              <span className="text-xs font-bold w-16 text-right" style={{ color: h.totalGain >= 0 ? '#00875A' : '#DE3618' }}>
                {formatPercent(h.totalGainPercent)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CryptoAccountCard({ account }: { account: AllAccounts['cryptoAccounts'][0] }) {
  const changeColor = account.totalChange24h >= 0 ? '#00875A' : '#DE3618';
  return (
    <div className="bg-white rounded-2xl p-5 border border-[--color-border] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #00B900, #00D26A)' }}>
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[--color-text-muted] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[--color-text-primary]">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-serif text-[--color-text-primary]">{formatCurrency(account.totalValue)}</p>
          <span className="text-xs font-bold" style={{ color: changeColor }}>{formatPercent(account.totalChange24h)} 24h</span>
        </div>
      </div>
      <div className="border-t border-[--color-border] pt-3">
        {account.assets.map((a, i) => (
          <div key={a.symbol} className={`flex items-center justify-between py-2 ${i < account.assets.length - 1 ? 'border-b border-[--color-border]' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[--color-text-primary]">{a.symbol}</span>
              <span className="text-xs text-[--color-text-muted]">{a.amount}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[--color-text-muted]">{formatCurrency(a.currentPrice)}</span>
              <span className="text-sm font-semibold">{formatCurrency(a.value)}</span>
              <span className="text-xs font-bold w-16 text-right" style={{ color: a.change24h >= 0 ? '#00875A' : '#DE3618' }}>
                {formatPercent(a.change24h)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<AllAccounts>(SEED_DATA);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((apiData: AllAccounts) => setData(apiData))
      .catch(() => {});
  }, []);

  if (!data) return null;

  const chartData = [
    { label: 'Banking', value: data.netWorthByType.bank, color: '#003D33' },
    { label: 'Securities', value: data.netWorthByType.stocks, color: '#00594C' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#00B900' },
  ];

  return (
    <div className="min-h-screen bg-[--color-bg]">

      {/* ─── TOPBAR ─── */}
      <header style={{ background: '#00261E', color: 'white' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#00B900' }}>
              A
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-white">AllFi</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-xs text-white/40 tracking-widest uppercase">Portfolio</span>
            <div className="w-px h-5 bg-white/20" />
            <div className="text-right">
              <p className="text-[10px] text-white/40 tracking-widest uppercase">Net Worth</p>
              <p className="text-sm font-bold font-serif">{formatCurrency(data.totalNetWorth)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
              U
            </div>
          </div>
        </div>
      </header>

      {/* ─── NAV TABS ─── */}
      <div className="bg-white border-b border-[--color-border]">
        <div className="max-w-5xl mx-auto px-6 h-11 flex items-center gap-1">
          {['Overview', 'Banking', 'Securities', 'Digital Assets'].map((item, i) => (
            <button
              key={item}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${i === 0 ? 'bg-[#E8F9ED] text-[#00B900] font-bold' : 'text-[--color-text-secondary] hover:bg-gray-100'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* ─── NET WORTH CARD ─── */}
        <div className="bg-white rounded-2xl p-8 border border-[--color-border] shadow-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-[--color-text-muted] mb-3">
            Total Net Worth · {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl font-bold font-serif text-[#00261E] tracking-tight mb-6 leading-none">
                {formatCurrency(data.totalNetWorth)}
              </h1>
              <div className="flex gap-8">
                {[
                  { label: 'Banking', pct: ((data.netWorthByType.bank / data.totalNetWorth) * 100).toFixed(1), amount: formatCurrency(data.netWorthByType.bank) },
                  { label: 'Securities', pct: ((data.netWorthByType.stocks / data.totalNetWorth) * 100).toFixed(1), amount: formatCurrency(data.netWorthByType.stocks) },
                  { label: 'Digital Assets', pct: ((data.netWorthByType.crypto / data.totalNetWorth) * 100).toFixed(1), amount: formatCurrency(data.netWorthByType.crypto) },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[--color-text-muted] mb-1">{item.label}</p>
                    <p className="text-base font-bold text-[#00261E]">{item.pct}%</p>
                    <p className="text-xs text-[--color-text-muted]">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
            <DonutChart data={chartData} />
          </div>
        </div>

        {/* ─── BANKING ─── */}
        {data.bankAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#003D33]" />
              <h2 className="text-base font-bold text-[#00261E]">Banking</h2>
              <span className="text-xs text-[--color-text-muted] ml-auto">{formatCurrency(data.netWorthByType.bank)}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.bankAccounts.map(acc => <BankAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── SECURITIES ─── */}
        {data.stockAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00594C]" />
              <h2 className="text-base font-bold text-[#00261E]">Securities</h2>
              <span className="text-xs text-[--color-text-muted] ml-auto">{formatCurrency(data.netWorthByType.stocks)}</span>
            </div>
            <div className="flex flex-col gap-4">
              {data.stockAccounts.map(acc => <StockAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── DIGITAL ASSETS ─── */}
        {data.cryptoAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00B900]" />
              <h2 className="text-base font-bold text-[#00261E]">Digital Assets</h2>
              <span className="text-xs text-[--color-text-muted] ml-auto">{formatCurrency(data.netWorthByType.crypto)}</span>
            </div>
            <div className="flex flex-col gap-4">
              {data.cryptoAccounts.map(acc => <CryptoAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-[--color-border] pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-black" style={{ background: '#00261E' }}>A</div>
            <span className="font-serif text-sm font-bold text-[#00261E]">AllFi</span>
          </div>
          <p className="text-xs text-[--color-text-muted]">
            Simulated data for demonstration · Updated {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </footer>
      </main>
    </div>
  );
}
