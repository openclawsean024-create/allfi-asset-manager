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

// Simple SVG donut chart
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += (d.value / total) * 360;
    return { ...d, start, end: cumulative };
  });

  const cx = 80, cy = 80, r = 60;
  const circumference = 2 * Math.PI * r;

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
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path
            key={i}
            d={arcPath(s.start, s.end)}
            fill={s.color}
            stroke="white"
            strokeWidth="3"
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600" fill="#171717">
          {formatCurrency(total, 'USD').replace('.00', '').replace('$', ' $')}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#71717a" fontSize="10">
          Total
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-zinc-600">{s.label}</span>
            <span className="font-medium ml-auto pl-4">{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankAccountCard({ account }: { account: AllAccounts['bankAccounts'][0] }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-zinc-500">{account.institution}</p>
            <p className="text-sm font-medium">{account.accountName}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {account.accountType}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xl font-semibold">{formatCurrency(account.balance)}</p>
        <div className="text-right text-xs text-zinc-500">
          <p>Last: {account.lastTransaction.description}</p>
          <p>{account.lastTransaction.date} · {formatCurrency(account.lastTransaction.amount)}</p>
        </div>
      </div>
    </div>
  );
}

function StockAccountCard({ account }: { account: AllAccounts['stockAccounts'][0] }) {
  const gainColor = account.totalGain >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-zinc-500">{account.institution}</p>
            <p className="text-sm font-medium">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatCurrency(account.totalValue)}</p>
          <p className={`text-xs ${gainColor}`}>{formatPercent(account.totalGainPercent)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {account.holdings.map((h) => (
          <div key={h.symbol} className="flex items-center justify-between text-xs py-1 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{h.symbol}</span>
              <span className="text-zinc-500">{h.shares} shares</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">@ {formatCurrency(h.currentPrice)}</span>
              <span className="font-medium">{formatCurrency(h.totalValue)}</span>
              <span className={h.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}>{formatPercent(h.totalGainPercent)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CryptoAccountCard({ account }: { account: AllAccounts['cryptoAccounts'][0] }) {
  const changeColor = account.totalChange24h >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400">
            {account.institution[0]}
          </div>
          <div>
            <p className="text-xs text-zinc-500">{account.institution}</p>
            <p className="text-sm font-medium">{account.accountName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatCurrency(account.totalValue)}</p>
          <p className={`text-xs ${changeColor}`}>{formatPercent(account.totalChange24h)} 24h</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {account.assets.map((a) => (
          <div key={a.symbol} className="flex items-center justify-between text-xs py-1 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{a.symbol}</span>
              <span className="text-zinc-500">{a.amount}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">@ {formatCurrency(a.currentPrice)}</span>
              <span className="font-medium">{formatCurrency(a.value)}</span>
              <span className={a.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>{formatPercent(a.change24h)}</span>
            </div>
          </div>
        ))}
      </div>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-800 dark:border-zinc-700 dark:border-t-zinc-200 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-zinc-500">Loading your assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <p className="text-red-500">Failed to load accounts: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { label: 'Bank', value: data.netWorthByType.bank, color: '#3b82f6' },
    { label: 'Stocks', value: data.netWorthByType.stocks, color: '#10b981' },
    { label: 'Crypto', value: data.netWorthByType.crypto, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">AllFi</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Total Net Worth</p>
              <p className="text-sm font-semibold">{formatCurrency(data.totalNetWorth)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Hero Net Worth */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 mb-1">Total Net Worth</p>
          <p className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(data.totalNetWorth)}</p>
          <DonutChart data={chartData} />
        </section>

        {/* Bank Accounts */}
        {data.bankAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-blue-500" />
              <h2 className="text-base font-semibold">Bank Accounts</h2>
              <span className="text-xs text-zinc-500 ml-auto">
                {formatCurrency(data.netWorthByType.bank)} total
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.bankAccounts.map((acc) => (
                <BankAccountCard key={acc.id} account={acc} />
              ))}
            </div>
          </section>
        )}

        {/* Stock Accounts */}
        {data.stockAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-emerald-500" />
              <h2 className="text-base font-semibold">Stock Accounts</h2>
              <span className="text-xs text-zinc-500 ml-auto">
                {formatCurrency(data.netWorthByType.stocks)} total
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {data.stockAccounts.map((acc) => (
                <StockAccountCard key={acc.id} account={acc} />
              ))}
            </div>
          </section>
        )}

        {/* Crypto Accounts */}
        {data.cryptoAccounts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-amber-500" />
              <h2 className="text-base font-semibold">Crypto Accounts</h2>
              <span className="text-xs text-zinc-500 ml-auto">
                {formatCurrency(data.netWorthByType.crypto)} total
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {data.cryptoAccounts.map((acc) => (
                <CryptoAccountCard key={acc.id} account={acc} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-zinc-400 py-4">
          Last updated: {new Date(data.lastUpdated).toLocaleString()} · Data shown is simulated for MVP demonstration
        </footer>
      </main>
    </div>
  );
}
