'use client';

import { useEffect, useRef, useState } from 'react';
import type { AllAccounts } from '@/types/accounts';

/* ─── SEED DATA ───────────────────────────────────── */
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

/* ─── HELPERS ──────────────────────────────────────── */
function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
}
function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/* ─── STARFIELD CANVAS ─────────────────────────────── */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Star {
      x: number; y: number; r: number; speed: number;
      opacity: number; twinkle: number;
    }

    const stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.2,
          speed: Math.random() * 0.015 + 0.003,
          opacity: Math.random() * 0.6 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    let raf: number;
    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;
      for (const s of stars) {
        const flicker = Math.sin(t * s.speed * 100 + s.twinkle) * 0.25 + 0.75;
        const alpha = s.opacity * flicker;
        const color = s.r > 1.0 ? `rgba(240,220,140,${alpha})` : `rgba(200,215,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} id="starfield" />;
}

/* ─── SCROLL REVEAL HOOK ───────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── DONUT CHART ──────────────────────────────────── */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += (d.value / total) * 360;
    return { ...d, start, end: cumulative };
  });
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
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="700" fill="#d4af37">
          {formatCurrency(total, 'USD').replace('.00', '').replace('$', ' $')}
        </text>
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

/* ─── BANK ROW ─────────────────────────────────────── */
function BankAccountRow({ account }: { account: AllAccounts['bankAccounts'][0] }) {
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #b8960c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#050a14', fontWeight: 800, fontSize: 16, flexShrink: 0,
        }}>
          {account.institution[0]}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{account.institution}</p>
          <p style={{ fontSize: 15, fontWeight: 600 }}>{account.accountName}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {account.lastTransaction.date} · {account.lastTransaction.description}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.balance)}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{account.accountType}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── STOCK ROW ─────────────────────────────────────── */
function StockAccountRow({ account }: { account: AllAccounts['stockAccounts'][0] }) {
  const gainColor = account.totalGain >= 0 ? 'var(--success)' : 'var(--danger)';
  const gainBg = account.totalGain >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#050a14', fontWeight: 800, fontSize: 14,
            }}>
              {account.institution[0]}
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{account.institution}</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{account.accountName}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.totalValue)}</p>
            <span style={{ fontSize: 12, fontWeight: 600, color: gainColor, background: gainBg, padding: '2px 8px', borderRadius: 999 }}>
              {formatPercent(account.totalGainPercent)}
            </span>
          </div>
        </div>
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
                  <td style={{ padding: '8px 8px', textAlign: 'right' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{h.symbol}</span>
                  </td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{h.shares}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(h.currentPrice)}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(h.totalValue)}</td>
                  <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: hgColor }}>{formatPercent(h.totalGainPercent)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── CRYPTO ROW ───────────────────────────────────── */
function CryptoAccountRow({ account }: { account: AllAccounts['cryptoAccounts'][0] }) {
  const changeColor = account.totalChange24h >= 0 ? 'var(--success)' : 'var(--danger)';
  const changeBg = account.totalChange24h >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div className="gold-card" style={{ padding: '2px' }}>
      <div className="gold-card-inner" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#050a14', fontWeight: 800, fontSize: 14,
            }}>
              {account.institution[0]}
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{account.institution}</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{account.accountName}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(account.totalValue)}</p>
            <span style={{ fontSize: 12, fontWeight: 600, color: changeColor, background: changeBg, padding: '2px 8px', borderRadius: 999 }}>
              {formatPercent(account.totalChange24h)} 24h
            </span>
          </div>
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

/* ─── DASHBOARD ────────────────────────────────────── */
export default function Dashboard() {
  const [data] = useState<AllAccounts>(SEED_DATA);
  useScrollReveal();

  const chartData = [
    { label: 'Banking', value: data.netWorthByType.bank, color: '#1a2d4a' },
    { label: 'Securities', value: data.netWorthByType.stocks, color: '#2d4a7a' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#d4af37' },
  ];
  const totalNetWorth = data.totalNetWorth;
  const bankPct = ((data.netWorthByType.bank / totalNetWorth) * 100).toFixed(1);
  const stockPct = ((data.netWorthByType.stocks / totalNetWorth) * 100).toFixed(1);
  const cryptoPct = ((data.netWorthByType.crypto / totalNetWorth) * 100).toFixed(1);

  return (
    <>
      <Starfield />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ─── TOPBAR ─── */}
        <div className="topbar">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 13, color: '#050a14',
              }}>A</div>
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
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--gold-dim)',
                border: '1px solid var(--border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: 'var(--gold)',
              }}>U</div>
            </div>
          </div>
        </div>

        {/* ─── SUBNAV ─── */}
        <div style={{
          background: 'rgba(10,22,40,0.85)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 44, display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Overview', 'Banking', 'Securities', 'Digital Assets', 'Insights'].map((item, i) => (
              <button key={item} className={`subnav-btn${i === 0 ? ' active' : ''}`}>{item}</button>
            ))}
          </div>
        </div>

        {/* ─── MAIN ─── */}
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 80px' }}>

          {/* ─── HERO CARD ─── */}
          <div className="gold-card reveal" style={{ padding: '2px', marginBottom: 40 }}>
            <div className="gold-card-inner" style={{
              padding: '40px 48px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40,
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Total Net Worth · {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h1 className="net-worth-animated" style={{
                  fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 700,
                  letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24,
                }}>
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

          {/* ─── BANKING ─── */}
          {data.bankAccounts.length > 0 && (
            <section style={{ marginBottom: 48 }} className="reveal">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="section-dot" />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Banking</h2>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.bank)} total</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.bankAccounts.map((acc, i) => (
                  <div key={acc.id} className={`reveal reveal-delay-${i + 1}`}>
                    <BankAccountRow account={acc} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── SECURITIES ─── */}
          {data.stockAccounts.length > 0 && (
            <section style={{ marginBottom: 48 }} className="reveal">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="section-dot" style={{ background: '#2d4a7a', boxShadow: '0 0 8px #2d4a7a' }} />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Securities</h2>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.stocks)} total</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.stockAccounts.map((acc, i) => (
                  <div key={acc.id} className={`reveal reveal-delay-${i + 1}`}>
                    <StockAccountRow account={acc} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── DIGITAL ASSETS ─── */}
          {data.cryptoAccounts.length > 0 && (
            <section style={{ marginBottom: 48 }} className="reveal">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="section-dot" />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Digital Assets</h2>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.crypto)} total</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.cryptoAccounts.map((acc, i) => (
                  <div key={acc.id} className={`reveal reveal-delay-${i + 1}`}>
                    <CryptoAccountRow account={acc} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── FOOTER ─── */}
          <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 900, color: '#050a14',
              }}>A</div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>AllFi</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Data shown is simulated for demonstration purposes only · Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
