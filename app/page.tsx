'use client';

import { useEffect, useState, useRef } from 'react';
import type { AllAccounts } from '@/types/accounts';

const SEED_DATA: AllAccounts = {
  bankAccounts: [
    { id: 'bank-001', institution: 'Chase Bank', accountName: 'Checking ****4821', accountType: 'checking', balance: 12450.67, currency: 'USD', lastTransaction: { date: '2026-03-30', description: 'Direct Deposit - Payroll', amount: 3200.00 } },
    { id: 'bank-002', institution: 'Chase Bank', accountName: 'Savings ****9832', accountType: 'savings', balance: 28400.00, currency: 'USD', lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 } },
  ],
  stockAccounts: [
    {
      id: 'stock-001', institution: 'TD Ameritrade', accountName: 'Individual Brokerage',
      holdings: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50, totalGain: 1092.00, totalGainPercent: 49.09 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20, totalGain: 3163.20, totalGainPercent: 82.38 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50, totalGain: 887.50, totalGainPercent: 28.63 },
      ],
      totalValue: 14310.20, totalGain: 5142.70, totalGainPercent: 56.06,
    },
  ],
  cryptoAccounts: [
    { id: 'crypto-001', institution: 'Coinbase', accountName: 'Main Portfolio', assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, currentPrice: 67420.00, value: 30339.00, change24h: 2.34 },
      { symbol: 'ETH', name: 'Ethereum', amount: 3.2, currentPrice: 3520.00, value: 11264.00, change24h: -1.28 },
      { symbol: 'SOL', name: 'Solana', amount: 25, currentPrice: 142.80, value: 3570.00, change24h: 5.67 },
    ], totalValue: 45173.00, totalChange24h: 1.89 },
    { id: 'crypto-002', institution: 'Binance', accountName: 'Trading Account', assets: [
      { symbol: 'BNB', name: 'Binance Coin', amount: 5, currentPrice: 598.00, value: 2990.00, change24h: 0.45 },
    ], totalValue: 2990.00, totalChange24h: 0.45 },
  ],
  totalNetWorth: 103323.87,
  netWorthByType: { bank: 40850.67, stocks: 14310.20, crypto: 48163.00 },
  lastUpdated: new Date().toISOString(),
};

function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
}
function formatPercent(value: number) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef<number>(0);
  useEffect(() => {
    const step = (ts: number) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function ArcChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  let cumulative = 0;
  const slices = data.map(d => {
    const start = cumulative;
    cumulative += (d.value / total) * 360;
    return { ...d, start, end: cumulative };
  });
  const cx = 100, cy = 100, outerR = 82, innerR = 58;
  function describeArc(startDeg: number, endDeg: number, r: number) {
    const s = ((startDeg - 90) * Math.PI) / 180;
    const e = ((endDeg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }
  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="20" />
        {slices.map((s, i) => (
          <path key={i} d={`${describeArc(s.start, s.end, outerR)} L ${cx} ${cy} Z`} fill={s.color} opacity="0.9" filter="url(#glow)" />
        ))}
        <circle cx={cx} cy={cy} r={innerR} fill="#030810" />
        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" fill="#E2C98A" fontSize="14" fontWeight="700" fontFamily="'Cormorant Garamond',Georgia,serif">$103K</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" letterSpacing="2">TOTAL AUM</text>
      </svg>
      <div className="mt-4 w-full space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <span className="text-[11px] text-white/50 tracking-wider">{s.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-white/70">{formatCurrency(s.value)}</span>
              <span className="text-[10px] font-bold text-white/40 w-10 text-right">{((s.value / total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 80, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const color = positive ? '#4ADE80' : '#F87171';
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"><polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] text-white/30 uppercase tracking-widest">{label}</span>
        <span className="text-[11px] font-semibold text-white/80">{formatCurrency(value)}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(value / max) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

const RECENT_TRANSACTIONS = [
  { date: '2026-03-30', description: 'Direct Deposit — Payroll', amount: 3200.00 },
  { date: '2026-03-30', description: 'NVDA — Bought 2 shares', amount: -1750.80 },
  { date: '2026-03-28', description: 'Interest Payment — Savings', amount: 12.34 },
  { date: '2026-03-27', description: 'SOL — Bought 5.2 SOL', amount: -742.56 },
  { date: '2026-03-26', description: 'AAPL — Dividend', amount: 18.90 },
  { date: '2026-03-25', description: 'ETH — Sold 0.3 ETH', amount: 1056.00 },
];

const TICKER_DATA = [
  { symbol: 'AAPL', price: 221.30, change: 1.24 }, { symbol: 'NVDA', price: 875.40, change: 4.12 },
  { symbol: 'MSFT', price: 398.75, change: -0.83 }, { symbol: 'BTC', price: 67420, change: 2.34 },
  { symbol: 'ETH', price: 3520, change: -1.28 }, { symbol: 'SOL', price: 142.80, change: 5.67 },
  { symbol: 'SPY', price: 521.40, change: 0.34 }, { symbol: 'QQQ', price: 448.90, change: 0.88 },
];

function Navbar({ networth }: { networth: number }) {
  return (
    <nav style={{ background: 'linear-gradient(180deg,#030810 0%,rgba(3,8,16,0.95) 100%)', borderBottom: '1px solid rgba(226,201,138,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#E2C98A,#9E8B6E)', borderRadius: '4px' }}>
              <span className="text-[13px] font-black" style={{ color: '#030810', fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: 'italic' }}>A</span>
            </div>
            <div className="absolute -inset-0.5 rounded" style={{ background: 'linear-gradient(135deg,#E2C98A,#9E8B6E)', opacity: 0.3, filter: 'blur(6px)', zIndex: -1 }} />
          </div>
          <div>
            <span className="text-white font-bold tracking-[0.18em] text-sm" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>ALLFI</span>
            <span className="block text-[8px] tracking-[0.22em] text-white/25 uppercase">Asset Intelligence</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Overview', 'Holdings', 'Analytics', 'Transactions', 'Settings'].map(link => (
            <span key={link} className={`text-[11px] tracking-widest uppercase cursor-pointer transition-colors ${link === 'Overview' ? 'text-[#E2C98A]' : 'text-white/40 hover:text-white/70'}`}>{link}</span>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:block text-right">
            <p className="text-[8px] tracking-[0.2em] uppercase text-white/25">Total Net Worth</p>
            <p className="text-sm font-bold text-white" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '-0.01em' }}>{formatCurrency(networth)}</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#030810] cursor-pointer" style={{ background: 'linear-gradient(135deg,#E2C98A,#9E8B6E)' }}>U</div>
        </div>
      </div>
    </nav>
  );
}

function TickerStrip() {
  return (
    <div className="overflow-hidden" style={{ background: 'rgba(3,8,16,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex animate-ticker">
        {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2 flex-shrink-0">
            <span className="text-[10px] font-bold tracking-widest text-white/60">{t.symbol}</span>
            <span className="text-[10px] text-white/80">{formatCurrency(t.price)}</span>
            <span className={`text-[10px] font-bold ${t.change >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>{formatPercent(t.change)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ networth }: { networth: number }) {
  const animated = useCountUp(networth, 2000);
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <section className="relative overflow-hidden px-6 py-16" style={{ background: 'linear-gradient(160deg,#030810 0%,#060F1F 50%,#030810 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(226,201,138,0.06) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#E2C98A] mb-4 opacity-80">Private Wealth Overview</p>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-3 leading-none" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '-0.02em', textShadow: '0 2px 40px rgba(226,201,138,0.15)' }}>
              {formatCurrency(animated)}
            </h1>
            <p className="text-white/30 text-sm mt-2">As of {dateStr}</p>
            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span className="text-[10px] text-white/40 tracking-wider">Markets Open</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-[10px] text-white/25 tracking-wider">Live Data Feed</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 lg:gap-10">
            {[
              { label: 'Banking', value: 40850.67, color: '#60A5FA', sub: '+0.00%' },
              { label: 'Securities', value: 14310.20, color: '#A78BFA', sub: '+56.06%' },
              { label: 'Digital Assets', value: 48163.00, color: '#E2C98A', sub: '+1.89%' },
            ].map(stat => (
              <div key={stat.label} className="text-center lg:text-right">
                <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '-0.01em' }}>{formatCurrency(stat.value)}</p>
                <p className="text-[10px] mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<AllAccounts>(SEED_DATA);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then((apiData: AllAccounts) => setData(apiData))
      .catch(() => {});
  }, []);

  const chartData = [
    { label: 'Banking', value: data.netWorthByType.bank, color: '#3B82F6' },
    { label: 'Securities', value: data.netWorthByType.stocks, color: '#8B5CF6' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#E2C98A' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#030810', fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 40s linear infinite; }
        @keyframes pulse-glow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .animate-glow { animation: pulse-glow 3s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease forwards; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <Navbar networth={data.totalNetWorth} />
      <TickerStrip />
      <HeroSection networth={data.totalNetWorth} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Allocation Chart */}
            <div className="rounded-2xl p-6 animate-fade-in" style={{ background: 'linear-gradient(160deg,#0A1628 0%,#0D1F35 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.05em' }}>Asset Allocation</h2>
                  <p className="text-[10px] text-white/25 mt-0.5 tracking-wider">Portfolio Distribution</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-glow" />
                  <span className="text-[9px] text-white/30 tracking-widest uppercase">Real-time</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ArcChart data={chartData} />
                <div className="flex-1 w-full space-y-4">
                  <MiniBar label="Banking" value={data.netWorthByType.bank} max={data.totalNetWorth} color="#3B82F6" />
                  <MiniBar label="Securities" value={data.netWorthByType.stocks} max={data.totalNetWorth} color="#8B5CF6" />
                  <MiniBar label="Digital Assets" value={data.netWorthByType.crypto} max={data.totalNetWorth} color="#E2C98A" />
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ background: 'linear-gradient(160deg,#0A1628 0%,#0D1F35 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h2 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.05em' }}>Holdings</h2>
                  <p className="text-[10px] text-white/25 mt-0.5">Securities &amp; Digital Assets</p>
                </div>
                <span className="text-[9px] tracking-widest uppercase text-white/20">All Positions</span>
              </div>
              <div className="grid grid-cols-12 px-6 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
                {['Asset', 'Price', '24h', 'Holdings', 'Value', 'Gain'].map((h, i) => (
                  <span key={h} className="text-[9px] tracking-[0.15em] uppercase text-white/20" style={{ gridColumn: `span ${i === 0 ? 4 : 2}` }}>{h}</span>
                ))}
              </div>
              {data.stockAccounts[0]?.holdings.map(h => {
                const sparkData = Array.from({ length: 7 }, () => h.currentPrice * (0.95 + Math.random() * 0.1));
                const isPos = h.totalGain >= 0;
                return (
                  <div key={h.symbol} className="grid grid-cols-12 items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div className="col-span-4 flex flex-col">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em' }}>{h.symbol}</span>
                      <span className="text-[10px] text-white/30 mt-0.5">{h.name}</span>
                    </div>
                    <div className="col-span-2 text-sm text-white/70" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{formatCurrency(h.currentPrice)}</div>
                    <div className="col-span-2"><Sparkline data={sparkData} positive={isPos} /></div>
                    <div className="col-span-2 text-sm text-white/60">{h.shares} shares</div>
                    <div className="col-span-2 flex flex-col items-end">
                      <span className="text-sm font-bold text-white">{formatCurrency(h.totalValue)}</span>
                      <span className={`text-[10px] font-bold ${isPos ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>{formatPercent(h.totalGainPercent)}</span>
                    </div>
                  </div>
                );
              })}
              {data.cryptoAccounts[0]?.assets.map(a => {
                const isPos = a.change24h >= 0;
                return (
                  <div key={a.symbol} className="grid grid-cols-12 items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div className="col-span-4 flex flex-col">
                      <span className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em', color: '#E2C98A' }}>{a.symbol}</span>
                      <span className="text-[10px] text-white/30 mt-0.5">{a.name}</span>
                    </div>
                    <div className="col-span-2 text-sm text-white/70" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{formatCurrency(a.currentPrice)}</div>
                    <div className="col-span-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPos ? 'text-[#4ADE80] bg-[#4ADE80]/10' : 'text-[#F87171] bg-[#F87171]/10'}`}>{formatPercent(a.change24h)}</span>
                    </div>
                    <div className="col-span-2 text-sm text-white/60">{a.amount}</div>
                    <div className="col-span-2 flex flex-col items-end">
                      <span className="text-sm font-bold text-white">{formatCurrency(a.value)}</span>
                      <span className="text-[10px] text-white/30">@ market</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Net Worth Summary */}
            <div className="rounded-2xl p-5 animate-fade-in" style={{ background: 'linear-gradient(160deg,#0A1628 0%,#0D1F35 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-bold text-white/80 mb-4" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.05em' }}>Net Worth</h2>
              <div className="space-y-3">
                {[
                  { label: 'Banking', value: data.netWorthByType.bank, color: '#3B82F6' },
                  { label: 'Securities', value: data.netWorthByType.stocks, color: '#8B5CF6' },
                  { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#E2C98A' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                      <span className="text-[11px] text-white/50">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-white/80">{formatCurrency(item.value)}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/30 uppercase tracking-wider">Total</span>
                    <span className="text-base font-bold text-white" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{formatCurrency(data.totalNetWorth)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ background: 'linear-gradient(160deg,#0A1628 0%,#0D1F35 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.05em' }}>Recent Activity</h2>
                <span className="text-[9px] tracking-widest uppercase text-white/20">Last 6</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {RECENT_TRANSACTIONS.map((tx, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] text-white/70 truncate">{tx.description}</span>
                      <span className="text-[9px] text-white/25 mt-0.5">{tx.date}</span>
                    </div>
                    <span className={`text-[12px] font-semibold flex-shrink-0 ml-3 ${tx.amount >= 0 ? 'text-[#4ADE80]' : 'text-white/60'}`} style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div className="rounded-2xl p-5 animate-fade-in" style={{ background: 'linear-gradient(160deg,rgba(226,201,138,0.08) 0%,rgba(226,201,138,0.03) 100%)', border: '1px solid rgba(226,201,138,0.12)' }}>
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#E2C98A]/60 mb-3">Portfolio Performance</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-[#E2C98A]" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '-0.02em', textShadow: '0 0 30px rgba(226,201,138,0.3)' }}>
                  +12.48%
                </span>
                <span className="text-[11px] text-white/30 mb-1">All-time return</span>
              </div>
              <div className="mt-4 space-y-1.5">
                {['AAPL +49.09%', 'NVDA +82.38%', 'MSFT +28.63%'].map((item, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-white/30">{item.split(' ')[0]}</span>
                    <span className="text-[#4ADE80]/70">{item.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#E2C98A,#9E8B6E)' }}>
              <span className="text-[9px] font-black" style={{ color: '#030810', fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: 'italic' }}>A</span>
            </div>
            <span className="text-sm font-bold tracking-widest text-white/40" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>ALLFI</span>
          </div>
          <p className="text-xs text-white/20">Simulated data for demonstration purposes only · {new Date().toLocaleString()}</p>
        </footer>
      </main>
    </div>
  );
}
