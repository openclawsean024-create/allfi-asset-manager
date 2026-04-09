"use client";

import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, ComposedChart
} from 'recharts';
import type { AllAccounts } from '@/types/accounts';

function Starfield() { return <div id="starfield" />; }
function Topbar() {
  return <div className="topbar"><div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#050a14' }}>A</div><span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700 }}>AllFi</span></div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analytics</span></div></div>;
}

// Generate mock historical data
function generateHistory(days: number) {
  const data = [];
  let value = 95000;
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const change = (Math.random() - 0.44) * 2000;
    value = Math.max(50000, value + change);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().slice(0, 10),
      portfolio: Math.round(value),
      btc: Math.round(value * 0.85 + Math.sin(i * 0.3) * 3000),
      eth: Math.round(value * 0.78 + Math.cos(i * 0.4) * 2500),
      spx: Math.round(value * 0.6 + i * 15),
    });
  }
  return data;
}

const HISTORY_1M = generateHistory(30);
const HISTORY_3M = generateHistory(90);
const HISTORY_1Y = generateHistory(365);
const HISTORY_ALL = generateHistory(730);

type Range = '1M' | '3M' | '1Y' | 'ALL';
type Tab = 'pnl' | 'fees' | 'attribution' | 'benchmark';

const MOCK_ACCOUNTS: AllAccounts = {
  bankAccounts: [
    { id: 'bank-001', institution: 'Chase Bank', accountName: 'Checking ****4821', accountType: 'checking', balance: 12450.67, currency: 'USD', status: 'enabled', lastTransaction: { date: '2026-03-30', description: 'Direct Deposit', amount: 3200 }, updatedAt: '2026-03-30' },
    { id: 'bank-002', institution: 'Chase Bank', accountName: 'Savings ****9832', accountType: 'savings', balance: 28400, currency: 'USD', status: 'enabled', lastTransaction: { date: '2026-03-28', description: 'Interest Payment', amount: 12.34 }, updatedAt: '2026-03-28' },
  ],
  stockAccounts: [
    { id: 'stock-001', institution: 'TD Ameritrade', accountName: 'Individual Brokerage', status: 'enabled', holdings: [
      { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 148.50, currentPrice: 221.30, totalValue: 3319.50, totalGain: 1092.00, totalGainPercent: 49.09 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 8, avgCost: 480.00, currentPrice: 875.40, totalValue: 7003.20, totalGain: 3163.20, totalGainPercent: 82.38 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 10, avgCost: 310.00, currentPrice: 398.75, totalValue: 3987.50, totalGain: 887.50, totalGainPercent: 28.63 },
    ], totalValue: 14310.20, totalGain: 5142.70, totalGainPercent: 56.06, updatedAt: '2026-03-30' },
  ],
  cryptoAccounts: [
    { id: 'crypto-001', institution: 'Coinbase', accountName: 'Main Portfolio', status: 'enabled', assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.45, currentPrice: 67420, value: 30339, change24h: 2.34 },
      { symbol: 'ETH', name: 'Ethereum', amount: 3.2, currentPrice: 3520, value: 11264, change24h: -1.28 },
      { symbol: 'SOL', name: 'Solana', amount: 25, currentPrice: 142.80, value: 3570, change24h: 5.67 },
    ], totalValue: 45173, totalChange24h: 1.89, updatedAt: '2026-03-30' },
    { id: 'crypto-002', institution: 'Binance', accountName: 'Trading Account', status: 'idle', assets: [
      { symbol: 'BNB', name: 'Binance Coin', amount: 5, currentPrice: 598, value: 2990, change24h: 0.45 },
    ], totalValue: 2990, totalChange24h: 0.45, updatedAt: '2026-03-25' },
  ],
  totalNetWorth: 103323.87,
  netWorthByType: { bank: 40850.67, stocks: 14310.20, crypto: 48163.00 },
  lastUpdated: new Date().toISOString(),
};

// Daily P&L data
function generatePnL(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Math.round((Math.random() - 0.45) * 5000),
      cumulative: 0,
    };
  }).map((items, idx, arr) => {
    const cumulative = arr.slice(0, idx + 1).reduce((s, x) => s + x.pnl, 0);
    return { ...items, cumulative };
  });
}

const PNL_DATA = {
  '1M': generatePnL(30),
  '3M': generatePnL(90),
  '1Y': generatePnL(365),
  'ALL': generatePnL(730),
};

// Fee data
const FEE_DATA = [
  { name: 'Binance', trading: 124.50, withdrawal: 32.10, deposit: 0 },
  { name: 'Coinbase', trading: 89.30, withdrawal: 15.00, deposit: 0 },
  { name: 'TD Ameritrade', trading: 0, withdrawal: 0, deposit: 0 },
  { name: 'Gas Fees (ETH)', trading: 0, withdrawal: 67.40, deposit: 0 },
  { name: 'Gas Fees (BSC)', trading: 0, withdrawal: 4.20, deposit: 0 },
];

const ATTRIBUTION_DATA = [
  { name: 'BTC', value: 38, color: '#F7931A' },
  { name: 'ETH', value: 24, color: '#627EEA' },
  { name: 'NVDA', value: 18, color: '#4CAF50' },
  { name: 'AAPL', value: 8, color: '#555555' },
  { name: 'SOL', value: 6, color: '#14F195' },
  { name: 'BNB', value: 4, color: '#F3BA2F' },
  { name: 'Others', value: 2, color: '#8a9bb5' },
];

const BENCHMARK_DATA = HISTORY_1Y;

const cardStyle: React.CSSProperties = { padding: '2px', marginBottom: 20 };
const innerStyle: React.CSSProperties = { padding: '24px 28px' };
const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
  background: active ? 'var(--gold-dim)' : 'transparent',
  color: active ? 'var(--gold)' : 'var(--text-secondary)',
  cursor: 'pointer', fontSize: 13, fontWeight: 600,
});
const rangeBtn = (active: boolean): React.CSSProperties => ({
  padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
  background: active ? 'var(--gold-dim)' : 'transparent',
  color: active ? 'var(--gold)' : 'var(--text-muted)',
  cursor: 'pointer', fontSize: 12, fontWeight: 600,
});

const chartColors = {
  portfolio: '#d4af37',
  btc: '#F7931A',
  eth: '#627EEA',
  spx: '#34d399',
  pnlUp: '#34d399',
  pnlDown: '#f87171',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || p.fill }}>{p.name}: {typeof p.value === 'number' ? (p.name.includes('%') ? `${p.value.toFixed(2)}%` : `$${p.value.toLocaleString()}`) : p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('pnl');
  const [range, setRange] = useState<Range>('1M');
  const [feeRange, setFeeRange] = useState<Range>('1M');

  const historyData = useMemo(() => {
    const map: Record<Range, typeof HISTORY_1M> = { '1M': HISTORY_1M, '3M': HISTORY_3M, '1Y': HISTORY_1Y, 'ALL': HISTORY_ALL };
    return map[range];
  }, [range]);

  const pnlData = useMemo(() => {
    const map: Record<Range, ReturnType<typeof generatePnL>> = { '1M': PNL_DATA['1M'], '3M': PNL_DATA['3M'], '1Y': PNL_DATA['1Y'], 'ALL': PNL_DATA['ALL'] };
    return map[range];
  }, [range]);

  const totalPnL = useMemo(() => pnlData.reduce((s, d) => s + d.pnl, 0), [pnlData]);
  const bestDay = useMemo(() => Math.max(...pnlData.map(d => d.pnl)), [pnlData]);
  const worstDay = useMemo(() => Math.min(...pnlData.map(d => d.pnl)), [pnlData]);

  const totalFees = useMemo(() => FEE_DATA.reduce((s, f) => s + f.trading + f.withdrawal, 0), []);

  const rangeLabels: Record<Range, string> = { '1M': '一個月', '3M': '三個月', '1Y': '一年', 'ALL': '全部' };
  const rangeValues: Range[] = ['1M', '3M', '1Y', 'ALL'];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pnl', label: '每日盈虧' },
    { key: 'fees', label: '費用分析' },
    { key: 'attribution', label: '歸因分析' },
    { key: 'benchmark', label: '基準對比' },
  ];

  return (
    <>
      <Starfield />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Topbar />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>

          {/* Tab Nav */}
          <div className="gold-card" style={cardStyle}>
            <div className="gold-card-inner" style={{ padding: '16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={tabBtn(tab === t.key)}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* P&L Tab */}
          {tab === 'pnl' && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {rangeValues.map(r => (
                  <button key={r} onClick={() => setRange(r)} style={rangeBtn(range === r)}>{r}</button>
                ))}
              </div>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
                {[
                  { label: '期間總盈虧', value: `$${Math.abs(totalPnL).toLocaleString()}`, sub: totalPnL >= 0 ? '正收益' : '負收益', up: totalPnL >= 0 },
                  { label: '最佳單日', value: `$${bestDay.toLocaleString()}`, sub: '單日最高', up: true },
                  { label: '最差單日', value: `$${Math.abs(worstDay).toLocaleString()}`, sub: '單日最大回調', up: false },
                  { label: '勝率', value: `${((pnlData.filter(d => d.pnl > 0).length / pnlData.length) * 100).toFixed(0)}%`, sub: '盈利天數/總天數', up: true },
                ].map((s, i) => (
                  <div key={i} className="gold-card" style={{ padding: '2px' }}>
                    <div className="gold-card-inner" style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Cumulative P&L Chart */}
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--text-secondary)' }}>累計盈虧（{rangeLabels[range]}）</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={pnlData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.portfolio} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartColors.portfolio} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="cumulative" stroke={chartColors.portfolio} fill="url(#pnlGrad)" strokeWidth={2} name="累計盈虧" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Daily P&L Bar Chart */}
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--text-secondary)' }}>每日盈虧（{rangeLabels[range]}）</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pnlData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="pnl" name="盈虧" radius={[3, 3, 0, 0]}>
                        {pnlData.map((entry, index) => (
                          <rect key={index} fill={entry.pnl >= 0 ? chartColors.pnlUp : chartColors.pnlDown} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Fees Tab */}
          {tab === 'fees' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>費用總覽</h3>
                    <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--danger)' }}>${totalFees.toFixed(2)}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={FEE_DATA} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${v}`} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} width={90} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                      <Bar dataKey="trading" name="交易費用" fill="#d4af37" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="withdrawal" name="提款/Gas費" fill="#f87171" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>費用明細</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 0' }}>平台</th>
                        <th style={{ textAlign: 'right', padding: '8px 0' }}>交易費用</th>
                        <th style={{ textAlign: 'right', padding: '8px 0' }}>提款/Gas</th>
                        <th style={{ textAlign: 'right', padding: '8px 0' }}>合計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FEE_DATA.map(f => (
                        <tr key={f.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>{f.name}</td>
                          <td style={{ textAlign: 'right', color: 'var(--gold)' }}>${f.trading.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', color: 'var(--danger)' }}>${f.withdrawal.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>${(f.trading + f.withdrawal).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 700 }}>
                        <td style={{ padding: '12px 0' }}>合計</td>
                        <td style={{ textAlign: 'right', color: 'var(--gold)' }}>${FEE_DATA.reduce((s, f) => s + f.trading, 0).toFixed(2)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--danger)' }}>${FEE_DATA.reduce((s, f) => s + f.withdrawal, 0).toFixed(2)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--danger)' }}>${totalFees.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Attribution Tab */}
          {tab === 'attribution' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 20px' }}>收益歸因分析</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {ATTRIBUTION_DATA.map(a => (
                      <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                          {a.name.slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>貢獻 {a.value}%</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: a.color }}>{a.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--text-secondary)' }}>收益貢獻比例</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={ATTRIBUTION_DATA} layout="vertical" margin={{ top: 0, right: 60, bottom: 0, left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `${v}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} tickLine={false} width={60} />
                      <Tooltip formatter={(v: any) => [`${v}%`, '貢獻']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-muted)' }} />
                      <Bar dataKey="value" name="貢獻%" radius={[0, 6, 6, 0]}>
                        {ATTRIBUTION_DATA.map((entry) => (
                          <rect key={entry.name} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Benchmark Tab */}
          {tab === 'benchmark' && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {rangeValues.map(r => (
                  <button key={r} onClick={() => setRange(r)} style={rangeBtn(range === r)}>{r}</button>
                ))}
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--text-secondary)' }}>基準對比（歸一化，起點 = 100）</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={historyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} width={40} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                      <Line type="monotone" dataKey="portfolio" stroke={chartColors.portfolio} strokeWidth={2} dot={false} name="AllFi 組合" />
                      <Line type="monotone" dataKey="btc" stroke={chartColors.btc} strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="BTC" />
                      <Line type="monotone" dataKey="eth" stroke={chartColors.eth} strokeWidth={1.5} dot={false} name="ETH" />
                      <Line type="monotone" dataKey="spx" stroke={chartColors.spx} strokeWidth={1.5} dot={false} name="S&P 500" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>期間表現對比</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                    {[
                      { label: 'AllFi 組合', color: chartColors.portfolio, ret: '+18.4%' },
                      { label: 'BTC', color: chartColors.btc, ret: '+12.1%' },
                      { label: 'ETH', color: chartColors.eth, ret: '+8.7%' },
                      { label: 'S&P 500', color: chartColors.spx, ret: '+5.2%' },
                    ].map(b => (
                      <div key={b.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, borderLeft: `3px solid ${b.color}` }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{b.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: b.color }}>{b.ret}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}
