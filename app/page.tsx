'use client';

import { useEffect, useState } from 'react';
import type { AllAccounts } from '@/types/accounts';

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
  const cx = 90, cy = 90, r = 70;
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
    <div className="flex items-center gap-10">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {slices.map((s, i) => (
          <path key={i} d={arcPath(s.start, s.end)} fill={s.color} />
        ))}
        <circle cx={cx} cy={cy} r={52} fill="white" />
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="700" fill="#0a1628">
          {formatCurrency(total, 'USD').replace('.00', '').replace('$', ' $')}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize="11">Total</text>
      </svg>
      <div className="flex flex-col gap-3">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
            <span className="text-sm font-semibold ml-auto pl-8">{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankAccountRow({ account }: { account: AllAccounts['bankAccounts'][0] }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
        {account.institution[0]}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{account.institution}</p>
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
  );
}

function StockAccountRow({ account }: { account: AllAccounts['stockAccounts'][0] }) {
  const gainColor = account.totalGain >= 0 ? 'var(--success)' : 'var(--danger)';
  const gainBg = account.totalGain >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>
            {account.institution[0]}
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{account.institution}</p>
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
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13 }}>{h.symbol}</span>
                </td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{h.shares}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(h.currentPrice)}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{formatCurrency(h.totalValue)}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: hgColor }}>{formatPercent(h.totalGainPercent)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CryptoAccountRow({ account }: { account: AllAccounts['cryptoAccounts'][0] }) {
  const changeColor = account.totalChange24h >= 0 ? 'var(--success)' : 'var(--danger)';
  const changeBg = account.totalChange24h >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>
            {account.institution[0]}
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{account.institution}</p>
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
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13 }}>{a.symbol}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{a.name}</span>
                </td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{a.amount}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatCurrency(a.currentPrice)}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{formatCurrency(a.value)}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: agColor }}>{formatPercent(a.change24h)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<AllAccounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--navy)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--danger)', fontSize: 15 }}>Unable to load accounts: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { label: 'Banking', value: data.netWorthByType.bank, color: '#0a1628' },
    { label: 'Securities', value: data.netWorthByType.stocks, color: '#2d4a7a' },
    { label: 'Digital Assets', value: data.netWorthByType.crypto, color: '#b8960c' },
  ];

  const totalNetWorth = data.totalNetWorth;
  const bankPct = ((data.netWorthByType.bank / totalNetWorth) * 100).toFixed(1);
  const stockPct = ((data.netWorthByType.stocks / totalNetWorth) * 100).toFixed(1);
  const cryptoPct = ((data.netWorthByType.crypto / totalNetWorth) * 100).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ─── TOPBAR ─── */}
      <div style={{ background: 'var(--navy)', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: 'var(--navy)' }}>
              A
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>AllFi</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: '0.1em', marginLeft: 4 }}>PRIVATE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Portfolio Overview</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Net Worth</p>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>{formatCurrency(data.totalNetWorth)}</p>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
              U
            </div>
          </div>
        </div>
      </div>

      {/* ─── SUBNAV ─── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 44, display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Overview', 'Banking', 'Securities', 'Digital Assets', 'Insights'].map((item, i) => (
            <button key={item} style={{
              padding: '4px 14px', borderRadius: 6, fontSize: 13, fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? 'var(--navy)' : 'var(--text-secondary)',
              background: i === 0 ? 'var(--gold-pale)' : 'transparent',
              border: 'none', cursor: 'pointer', letterSpacing: '0.01em'
            }}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>

        {/* ─── HERO CARD ─── */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 48px', boxShadow: 'var(--shadow-md)', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Total Net Worth · As of {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--navy)', lineHeight: 1.1, marginBottom: 24 }}>
              {formatCurrency(data.totalNetWorth)}
            </h1>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Banking', value: bankPct + '%', amount: formatCurrency(data.netWorthByType.bank) },
                { label: 'Securities', value: stockPct + '%', amount: formatCurrency(data.netWorthByType.stocks) },
                { label: 'Digital Assets', value: cryptoPct + '%', amount: formatCurrency(data.netWorthByType.crypto) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{item.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
          <DonutChart data={chartData} />
        </div>

        {/* ─── BANKING ─── */}
        {data.bankAccounts.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy)' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>Banking</h2>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.bank)} total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.bankAccounts.map(acc => <BankAccountRow key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── SECURITIES ─── */}
        {data.stockAccounts.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy-light)' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>Securities</h2>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.stocks)} total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.stockAccounts.map(acc => <StockAccountRow key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── DIGITAL ASSETS ─── */}
        {data.cryptoAccounts.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>Digital Assets</h2>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatCurrency(data.netWorthByType.crypto)} total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.cryptoAccounts.map(acc => <CryptoAccountRow key={acc.id} account={acc} />)}
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'var(--gold-light)' }}>A</div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>AllFi</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Data shown is simulated for demonstration purposes only · Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </footer>
      </main>
    </div>
  );
}
