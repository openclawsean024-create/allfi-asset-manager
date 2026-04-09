"use client";

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { LineChart as LucideLineChart, BarChart3, PieChart as LucidePieChart, Download, Calendar } from 'lucide-react';

function Starfield() { return <div id="starfield" />; }
function Topbar() {
  return <div className="topbar"><div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#050a14' }}>A</div><span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700 }}>AllFi</span></div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reports</span></div></div>;
}

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Mock data generators
function genDailyReport() {
  return {
    date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }),
    totalNetWorth: 103323.87,
    change: 1247.50,
    changePercent: 1.22,
    summary: {
      bank: { value: 40850.67, change: 12.34, changePercent: 0.03 },
      stocks: { value: 14310.20, change: 234.80, changePercent: 1.67 },
      crypto: { value: 48163.00, change: 1000.36, changePercent: 2.12 },
    },
    topMovers: [
      { name: 'BTC', change: 2.34, value: 30339 },
      { name: 'SOL', change: 5.67, value: 3570 },
      { name: 'NVDA', change: 3.21, value: 7003.20 },
      { name: 'ETH', change: -1.28, value: 11264 },
    ],
    transactions: 8,
    fees: 12.40,
  };
}

function genWeeklyReport() {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      portfolio: 98000 + Math.round(Math.random() * 8000),
      pnl: Math.round((Math.random() - 0.4) * 3000),
    });
  }
  return {
    startDate: new Date(Date.now() - 6 * 86400000).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' }),
    endDate: new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' }),
    totalChange: 3240.20,
    totalChangePercent: 3.24,
    avgDailyPnL: 462.89,
    bestDay: 1847.30,
    worstDay: -634.50,
    winRate: 71.4,
    totalFees: 87.40,
    portfolioHistory: data,
    allocation: [
      { name: 'Bank', value: 39.5 },
      { name: 'Stocks', value: 13.9 },
      { name: 'Crypto', value: 46.6 },
    ],
  };
}

function genMonthlyReport() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: 92000 + Math.round(Math.random() * 12000),
      high: 0,
      low: 0,
    });
  }
  return {
    month: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' }),
    startValue: 92150.40,
    endValue: 103323.87,
    totalChange: 11173.47,
    changePercent: 12.12,
    bestDay: new Date(Date.now() - 5 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bestDayPnL: 2847.30,
    worstDay: new Date(Date.now() - 12 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    worstDayPnL: -1234.50,
    totalFees: 324.80,
    byAsset: [
      { name: 'BTC', start: 26800, end: 30339, change: 3339, changePercent: 12.46 },
      { name: 'ETH', start: 10240, end: 11264, change: 1024, changePercent: 10.00 },
      { name: 'NVDA', start: 6200, end: 7003.20, change: 803.20, changePercent: 12.96 },
    ],
    portfolioHistory: data,
    allocation: [
      { name: 'BTC', value: 29.4 },
      { name: 'ETH', value: 10.9 },
      { name: 'SOL', value: 3.5 },
      { name: 'NVDA', value: 6.8 },
      { name: 'AAPL', value: 3.2 },
      { name: 'Bank', value: 39.5 },
      { name: 'Others', value: 6.7 },
    ],
  };
}

function genYearlyReport() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map((month, i) => ({
    month,
    portfolio: 60000 + i * 4000 + Math.round(Math.random() * 3000),
    btc: 45000 + i * 3000 + Math.round(Math.random() * 2000),
    spx: 55000 + i * 2500,
  }));
  return {
    year: new Date().getFullYear(),
    startValue: 60200,
    endValue: 103323.87,
    totalReturn: 43023.87,
    returnPercent: 71.47,
    annualized: 71.47,
    bestMonth: 'November',
    bestMonthReturn: 14.8,
    worstMonth: 'February',
    worstMonthReturn: -8.3,
    totalFees: 1892.40,
    dividendIncome: 456.30,
    realizedGains: 3420.80,
    portfolioHistory: data,
    allocation: [
      { name: 'Bank', value: 39.5 },
      { name: 'Crypto', value: 46.6 },
      { name: 'Stocks', value: 13.9 },
    ],
    sectorAllocation: [
      { name: 'Tech', value: 28 },
      { name: 'Crypto', value: 46 },
      { name: 'Finance', value: 15 },
      { name: 'Other', value: 11 },
    ],
  };
}

const COLORS = ['#d4af37', '#627EEA', '#14F195', '#F7931A', '#4CAF50', '#8a9bb5', '#f87171'];

const cardStyle: React.CSSProperties = { padding: '2px', marginBottom: 20 };
const innerStyle: React.CSSProperties = { padding: '24px 28px' };
const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '10px 18px', borderRadius: 8, border: '1px solid var(--border)',
  background: active ? 'var(--gold-dim)' : 'transparent',
  color: active ? 'var(--gold)' : 'var(--text-secondary)',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
});

function ExportBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Download size={14} />{label}
    </button>
  );
}

function exportReport(reportType: ReportType) {
  const now = new Date().toISOString().slice(0, 10);
  const content = `AllFi ${reportType.toUpperCase()} Report — Generated ${now}\n\nThis is a mock report for demonstration.\nIn production, this would export a PDF or structured data export.`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `allfi-${reportType}-report-${now}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>('monthly');
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const daily = genDailyReport();
  const weekly = genWeeklyReport();
  const monthly = genMonthlyReport();
  const yearly = genYearlyReport();

  const pieColors = ['#d4af37', '#627EEA', '#14F195', '#F7931A', '#4CAF50', '#f87171', '#8a9bb5'];

  const reportTabs: { key: ReportType; label: string; icon: React.ReactNode }[] = [
    { key: 'daily', label: '日報', icon: <Calendar size={13} /> },
    { key: 'weekly', label: '週報', icon: <BarChart3 size={13} /> },
    { key: 'monthly', label: '月報', icon: <LucideLineChart size={13} /> },
    { key: 'yearly', label: '年報', icon: <LucidePieChart size={13} /> },
  ];

  return (
    <>
      <Starfield />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Topbar />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>

          {/* Tab Nav */}
          <div className="gold-card" style={cardStyle}>
            <div className="gold-card-inner" style={{ padding: '16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {reportTabs.map(t => (
                  <button key={t.key} onClick={() => setType(t.key)} style={tabBtn(type === t.key)}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>
              <ExportBtn label="匯出報告" onClick={() => exportReport(type)} />
            </div>
          </div>

          {/* Daily Report */}
          {type === 'daily' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>📅 {daily.date}</p>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, margin: 0 }}>今日總覽</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>總淨值</div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>${daily.totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                      <div style={{ color: daily.change >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: 14 }}>
                        {daily.change >= 0 ? '+' : ''}{daily.change.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({daily.changePercent >= 0 ? '+' : ''}{daily.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
                {[
                  { label: '銀行存款', value: `$${daily.summary.bank.value.toLocaleString()}`, change: `+$${daily.summary.bank.change}`, up: true },
                  { label: '股票組合', value: `$${daily.summary.stocks.value.toLocaleString()}`, change: `+$${daily.summary.stocks.change}`, up: true },
                  { label: '加密資產', value: `$${daily.summary.crypto.value.toLocaleString()}`, change: `+$${daily.summary.crypto.change}`, up: true },
                  { label: '交易筆數', value: `${daily.transactions} 筆`, change: '', up: true },
                  { label: '費用支出', value: `$${daily.fees.toFixed(2)}`, change: '', up: false },
                ].map((s, i) => (
                  <div key={i} className="gold-card" style={{ padding: '2px' }}>
                    <div className="gold-card-inner" style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                      {s.change && <div style={{ fontSize: 12, color: s.up ? 'var(--success)' : 'var(--danger)', marginTop: 4 }}>{s.change}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>熱門資產變動</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 0' }}>資產</th>
                          <th style={{ textAlign: 'right', padding: '8px 0' }}>價值 (USD)</th>
                          <th style={{ textAlign: 'right', padding: '8px 0' }}>24h 變動</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daily.topMovers.map(m => (
                          <tr key={m.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '10px 0', fontWeight: 600 }}>{m.name}</td>
                            <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>${m.value.toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: m.change >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                              {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Weekly Report */}
          {type === 'weekly' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>📅 {weekly.startDate} — {weekly.endDate}</p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 20px' }}>本週報告</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                    {[
                      { label: '本週收益', value: `$${Math.abs(weekly.totalChange).toLocaleString()}`, sub: weekly.totalChange >= 0 ? '正收益' : '虧損', up: weekly.totalChange >= 0 },
                      { label: '日均收益', value: `$${weekly.avgDailyPnL.toFixed(2)}`, sub: '平均每日', up: weekly.avgDailyPnL >= 0 },
                      { label: '最佳單日', value: `$${weekly.bestDay.toLocaleString()}`, sub: '最高單日', up: true },
                      { label: '最差單日', value: `$${Math.abs(weekly.worstDay).toFixed(2)}`, sub: '最大回調', up: false },
                      { label: '勝率', value: `${weekly.winRate}%`, sub: '盈利天數/總天數', up: true },
                      { label: '費用', value: `$${weekly.totalFees.toFixed(2)}`, sub: '本週累計', up: false },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>每日期望值 vs 盈虧</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={weekly.portfolioHistory} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(v: any, name: any) => [name === 'pnl' ? (v >= 0 ? `+$${v}` : `-$${Math.abs(v)}`) : `$${v}`, name === 'pnl' ? '盈虧' : '組合價值']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      <Bar dataKey="portfolio" name="組合價值" fill="#627EEA" opacity={0.6} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="pnl" name="盈虧" radius={[3, 3, 0, 0]}>
                        {weekly.portfolioHistory.map((entry, index) => (
                          <rect key={index} fill={entry.pnl >= 0 ? '#34d399' : '#f87171'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={{ ...innerStyle, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <h3 style={{ margin: '0 0 16px' }}>資產配置</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={weekly.allocation} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                          {weekly.allocation.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v}%`, '配置']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <h3 style={{ margin: '0 0 16px' }}>配置明細</h3>
                    {weekly.allocation.map((a, i) => (
                      <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: pieColors[i % pieColors.length], flexShrink: 0 }} />
                        <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 13 }}>{a.name}</span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Monthly Report */}
          {type === 'monthly' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>📅 {monthly.month}</p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 20px' }}>本月報告</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                    {[
                      { label: '月初淨值', value: `$${monthly.startValue.toLocaleString()}`, up: true },
                      { label: '月底淨值', value: `$${monthly.endValue.toLocaleString()}`, up: true },
                      { label: '本月收益', value: `$${monthly.totalChange.toLocaleString()}`, sub: `+${monthly.changePercent}%`, up: true },
                      { label: '最佳單日', value: `$${monthly.bestDayPnL.toLocaleString()}`, sub: monthly.bestDay, up: true },
                      { label: '最大回調', value: `-$${Math.abs(monthly.worstDayPnL).toFixed(2)}`, sub: monthly.worstDay, up: false },
                      { label: '費用支出', value: `$${monthly.totalFees.toFixed(2)}`, up: false },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.value}</div>
                        {s.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>淨值走勢（本月）</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthly.portfolioHistory} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '組合價值']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      <Area type="monotone" dataKey="value" stroke="#d4af37" fill="url(#monthGrad)" strokeWidth={2} name="組合價值" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div className="gold-card" style={cardStyle}>
                  <div className="gold-card-inner" style={innerStyle}>
                    <h3 style={{ margin: '0 0 16px' }}>主要資產表現</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ textAlign: 'left', padding: '8px 0' }}>資產</th>
                            <th style={{ textAlign: 'right', padding: '8px 0' }}>月初</th>
                            <th style={{ textAlign: 'right', padding: '8px 0' }}>月底</th>
                            <th style={{ textAlign: 'right', padding: '8px 0' }}>變動</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthly.byAsset.map(a => (
                            <tr key={a.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td style={{ padding: '10px 0', fontWeight: 600 }}>{a.name}</td>
                              <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>${a.start.toLocaleString()}</td>
                              <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>${a.end.toLocaleString()}</td>
                              <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>+${a.change.toLocaleString()} ({a.changePercent}%)</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="gold-card" style={cardStyle}>
                  <div className="gold-card-inner" style={innerStyle}>
                    <h3 style={{ margin: '0 0 16px' }}>資產配置</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={monthly.allocation} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                          {monthly.allocation.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v}%`, '配置']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Yearly Report */}
          {type === 'yearly' && (
            <>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>📅 {yearly.year} 年度報告</p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 20px' }}>{yearly.year} 年報</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                    {[
                      { label: '年初淨值', value: `$${yearly.startValue.toLocaleString()}`, up: true },
                      { label: '年末淨值', value: `$${yearly.endValue.toLocaleString()}`, up: true },
                      { label: '總收益', value: `$${yearly.totalReturn.toLocaleString()}`, sub: `+${yearly.returnPercent}%`, up: true },
                      { label: '年化報酬', value: `${yearly.annualized}%`, sub: '年化', up: true },
                      { label: '最佳月份', value: yearly.bestMonth, sub: `+${yearly.bestMonthReturn}%`, up: true },
                      { label: '最差月份', value: yearly.worstMonth, sub: `${yearly.worstMonthReturn}%`, up: false },
                      { label: '總費用', value: `$${yearly.totalFees.toLocaleString()}`, up: false },
                      { label: '股息/收入', value: `$${yearly.dividendIncome.toFixed(2)}`, up: true },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.value}</div>
                        {s.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gold-card" style={cardStyle}>
                <div className="gold-card-inner" style={innerStyle}>
                  <h3 style={{ margin: '0 0 16px' }}>年度組合 vs 基準（BTC / S&P 500）</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearly.portfolioHistory} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                      <Line type="monotone" dataKey="portfolio" stroke="#d4af37" strokeWidth={2.5} dot={false} name="AllFi 組合" />
                      <Line type="monotone" dataKey="btc" stroke="#F7931A" strokeWidth={1.5} dot={false} strokeDasharray="5 3" name="BTC" />
                      <Line type="monotone" dataKey="spx" stroke="#34d399" strokeWidth={1.5} dot={false} name="S&P 500" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div className="gold-card" style={cardStyle}>
                  <div className="gold-card-inner" style={innerStyle}>
                    <h3 style={{ margin: '0 0 16px' }}>年末資產配置</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={yearly.allocation} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                          {yearly.allocation.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v}%`, '配置']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="gold-card" style={cardStyle}>
                  <div className="gold-card-inner" style={innerStyle}>
                    <h3 style={{ margin: '0 0 16px' }}>產業配置</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={yearly.sectorAllocation} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} tickFormatter={v => `${v}%`} />
                        <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} />
                        <Tooltip formatter={(v: any) => [`${v}%`, '配置']} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 8 }} />
                        <Bar dataKey="value" name="%" radius={[0, 6, 6, 0]}>
                          {yearly.sectorAllocation.map((_, i) => <rect key={i} fill={pieColors[i % pieColors.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
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
