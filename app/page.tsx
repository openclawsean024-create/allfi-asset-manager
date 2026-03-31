'use client';

import { useEffect, useState, useRef } from 'react';
import type { AllAccounts } from '@/types/accounts';

/* ─── Seed Data — instant render, replaced by API data ─── */
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
        { symbol: 'AAPL',  name: 'Apple Inc.',           shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50,  totalGain: 1092.00, totalGainPercent: 49.09 },
        { symbol: 'NVDA',  name: 'NVIDIA Corporation',   shares:  8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20,  totalGain: 3163.20, totalGainPercent: 82.38 },
        { symbol: 'MSFT',  name: 'Microsoft Corporation',shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50,  totalGain:  887.50, totalGainPercent: 28.63 },
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
        { symbol: 'BTC', name: 'Bitcoin',  amount: 0.45, currentPrice: 67420.00, value: 30339.00, change24h:  2.34 },
        { symbol: 'ETH', name: 'Ethereum', amount: 3.2,  currentPrice:  3520.00, value: 11264.00, change24h: -1.28 },
        { symbol: 'SOL', name: 'Solana',   amount: 25,   currentPrice:   142.80, value:  3570.00, change24h:  5.67 },
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

/* ─── Formatters ─── */
function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
}
function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    start.current = null;
    const step = (ts: number) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

/* ─── DonutChart ─── */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  let cum = 0;
  const slices = data.map(d => {
    const s = cum;
    cum += (d.value / total) * 360;
    return { ...d, start: s, end: cum };
  });
  const cx = 80, cy = 80, r = 62;
  const arc = (s: number, e: number) => {
    const xs = cx + r * Math.cos((s - 90) * Math.PI / 180);
    const ys = cy + r * Math.sin((s - 90) * Math.PI / 180);
    const xe = cx + r * Math.cos((e - 90) * Math.PI / 180);
    const ye = cy + r * Math.sin((e - 90) * Math.PI / 180);
    const lg = e - s > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${xs} ${ys} A ${r} ${r} 0 ${lg} 1 ${xe} ${ye} Z`;
  };
  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => <path key={i} d={arc(s.start, s.end)} fill={s.color} />)}
        <circle cx={cx} cy={cy} r={44} fill="white" />
        <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
          {formatCurrency(total, 'USD').replace('.00', '').replace('$', '$')}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fill="#9E9E9E" fontSize="10">Total</text>
      </svg>
      <div className="flex flex-col gap-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-[#6B6B6B]">{s.label}</span>
            <span className="text-sm font-semibold ml-auto pl-4 text-[#1A1A1A]">{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Badge ─── */
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'default' }) {
  const styles: Record<string, string> = {
    primary:  'background:#E8F9ED;color:#00B900',
    success:  'background:#E8F5E9;color:#00C853',
    danger:   'background:#FFEBEE;color:#FF3D00',
    secondary:'background:#E6F0FA;color:#0066CC',
    default:  'background:#F4F4F4;color:#6B6B6B',
  };
  const [bg, color] = styles[variant].split(';');
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, letterSpacing: '0.03em', background: bg, color }}>
      {children}
    </span>
  );
}

/* ─── Bank Account Card ─── */
function BankAccountCard({ account }: { account: AllAccounts['bankAccounts'][0] }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-250">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#0066CC] to-[#0052A3]">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[#9E9E9E] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{account.accountName}</p>
          </div>
        </div>
        <Badge variant="primary">{account.accountType}</Badge>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
          {formatCurrency(account.balance)}
        </p>
        <div className="text-right">
          <p className="text-xs text-[#9E9E9E]">{account.lastTransaction.description}</p>
          <p className="text-xs text-[#9E9E9E]">{account.lastTransaction.date}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Stock Account Card ─── */
function StockAccountCard({ account }: { account: AllAccounts['stockAccounts'][0] }) {
  const gainColor = account.totalGain >= 0 ? '#00C853' : '#FF3D00';
  return (
    <div className="bg-white rounded-2xl px-5 py-5 border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-250">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#0066CC] to-[#0052A3]">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[#9E9E9E] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
            {formatCurrency(account.totalValue)}
          </p>
          <span className="text-xs font-bold" style={{ color: gainColor }}>{formatPercent(account.totalGainPercent)}</span>
        </div>
      </div>
      <div className="border-t border-[#EEEEEE] pt-4">
        {account.holdings.map((h, i) => (
          <div key={h.symbol} className={`flex items-center justify-between py-2.5 ${i < account.holdings.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#1A1A1A]">{h.symbol}</span>
              <span className="text-xs text-[#9E9E9E]">{h.shares} shares</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#9E9E9E]">{formatCurrency(h.currentPrice)}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{formatCurrency(h.totalValue)}</span>
              <span className="font-bold w-14 text-right" style={{ color: h.totalGain >= 0 ? '#00C853' : '#FF3D00' }}>
                {formatPercent(h.totalGainPercent)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Crypto Account Card ─── */
function CryptoAccountCard({ account }: { account: AllAccounts['cryptoAccounts'][0] }) {
  const changeColor = account.totalChange24h >= 0 ? '#00C853' : '#FF3D00';
  return (
    <div className="bg-white rounded-2xl px-5 py-5 border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-250">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#00B900] to-[#008800]">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-[#9E9E9E] font-medium">{account.institution}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
            {formatCurrency(account.totalValue)}
          </p>
          <span className="text-xs font-bold" style={{ color: changeColor }}>{formatPercent(account.totalChange24h)} 24h</span>
        </div>
      </div>
      <div className="border-t border-[#EEEEEE] pt-4">
        {account.assets.map((a, i) => (
          <div key={a.symbol} className={`flex items-center justify-between py-2.5 ${i < account.assets.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#1A1A1A]">{a.symbol}</span>
              <span className="text-xs text-[#9E9E9E]">{a.amount}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#9E9E9E]">{formatCurrency(a.currentPrice)}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{formatCurrency(a.value)}</span>
              <span className="font-bold w-14 text-right" style={{ color: a.change24h >= 0 ? '#00C853' : '#FF3D00' }}>
                {formatPercent(a.change24h)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [data, setData] = useState<AllAccounts>(SEED_DATA);
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);
  const countRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then((apiData: AllAccounts) => {
        setData(apiData);
        // Trigger count-up animation after data loads
        if (countRef.current) clearTimeout(countRef.current);
        setAnimatedNetWorth(0);
        setTimeout(() => {
          const target = apiData.totalNetWorth;
          let start: number | null = null;
          const dur = 1200;
          const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setAnimatedNetWorth(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }, 50);
      })
      .catch(() => {});
  }, []);

  const chartData = [
    { label: 'Banking',        value: data.netWorthByType.bank,   color: '#0066CC' },
    { label: 'Securities',     value: data.netWorthByType.stocks, color: '#0052A3' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#00B900' },
  ];

  const bankPct   = ((data.netWorthByType.bank   / data.totalNetWorth) * 100).toFixed(1);
  const stockPct = ((data.netWorthByType.stocks / data.totalNetWorth) * 100).toFixed(1);
  const cryptoPct = ((data.netWorthByType.crypto / data.totalNetWorth) * 100).toFixed(1);

  return (
    <div className="min-h-screen" style={{ background: '#E8F5E9' }}>

      {/* ─── TOPBAR ─── */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white" style={{ background: '#00B900' }}>
              A
            </div>
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 18, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
              AllFi
            </span>
            <span className="text-[10px] text-[#9E9E9E] font-medium tracking-widest uppercase ml-1">Asset Manager</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-xs text-[#9E9E9E] tracking-widest uppercase hidden sm:block">Portfolio Overview</span>
            <div className="w-px h-4 bg-[#E0E0E0]" />
            <div className="text-right">
              <p className="text-[10px] text-[#9E9E9E] tracking-widest uppercase">Total Net Worth</p>
              <p className="text-sm font-bold" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#1A1A1A' }}>
                {formatCurrency(animatedNetWorth || data.totalNetWorth)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#00B900' }}>
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">

        {/* ─── NET WORTH HERO ─── */}
        <section className="pt-10 pb-8 text-center animate-fade-up">
          <p className="text-xs font-bold tracking-widest uppercase text-[#9E9E9E] mb-4">
            Total Net Worth &middot; As of {fmtDate(data.lastUpdated)}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#1A1A1A] tracking-tight leading-none mb-6 animate-count-up"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 700 }}
          >
            {formatCurrency(animatedNetWorth || data.totalNetWorth)}
          </h1>

          {/* Asset type breakdown */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: 'Banking',        pct: bankPct,   amount: data.netWorthByType.bank,   color: '#0066CC' },
              { label: 'Securities',      pct: stockPct,  amount: data.netWorthByType.stocks, color: '#0052A3' },
              { label: 'Digital Assets',  pct: cryptoPct, amount: data.netWorthByType.crypto, color: '#00B900' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-[#9E9E9E] mb-1">{item.label}</p>
                <p className="text-base font-bold" style={{ color: item.color }}>{item.pct}%</p>
                <p className="text-sm text-[#6B6B6B]">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── DONUT + DISTRIBUTION ─── */}
        <section className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-2xl p-8 mb-6 border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.08)] animate-fade-up">
          <div className="flex-shrink-0">
            <DonutChart data={chartData} />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-5" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Asset Distribution
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Banking',       value: data.netWorthByType.bank,   color: '#0066CC', pct: Number(bankPct) },
                { label: 'Securities',     value: data.netWorthByType.stocks, color: '#0052A3', pct: Number(stockPct) },
                { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#00B900', pct: Number(cryptoPct) },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#1A1A1A]">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F4F4F4]">
                    <div
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BANKING ─── */}
        {data.bankAccounts.length > 0 && (
          <section className="mb-8 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: '#0066CC' }} />
              <h2 className="text-lg font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>Banking</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.bankAccounts.map(acc => <BankAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── SECURITIES ─── */}
        {data.stockAccounts.length > 0 && (
          <section className="mb-8 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: '#0052A3' }} />
              <h2 className="text-lg font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>Securities</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data.stockAccounts.map(acc => <StockAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── DIGITAL ASSETS ─── */}
        {data.cryptoAccounts.length > 0 && (
          <section className="mb-8 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: '#00B900' }} />
              <h2 className="text-lg font-bold text-[#1A1A1A]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>Digital Assets</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.cryptoAccounts.map(acc => <CryptoAccountCard key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-[#E0E0E0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#9E9E9E]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white" style={{ background: '#00B900' }}>A</div>
            <span className="text-sm font-semibold text-[#6B6B6B]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>AllFi</span>
          </div>
          <p className="text-xs text-center sm:text-right">
            Data shown is simulated for demonstration purposes only &middot; Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </footer>

      </main>
    </div>
  );
}
