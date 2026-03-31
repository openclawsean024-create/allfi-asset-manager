interface Props {
  total: number
  bankTotal: number
  stockTotal: number
  cryptoTotal: number
}

export default function NetWorthHero({ total, bankTotal, stockTotal, cryptoTotal }: Props) {
  const bankPct = (bankTotal / total * 100).toFixed(1)
  const stockPct = (stockTotal / total * 100).toFixed(1)
  const cryptoPct = (cryptoTotal / total * 100).toFixed(1)

  return (
    <div className="rounded-3xl p-8 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Net worth */}
        <div className="flex-1">
          <div className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">總淨值 (USD)</div>
          <div className="text-5xl lg:text-6xl font-black text-white font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex gap-6 mt-4">
            {[
              { label: '銀行', value: `$${bankTotal.toLocaleString()}`, pct: bankPct, color: 'var(--accent-blue)' },
              { label: '股票', value: `$${stockTotal.toLocaleString()}`, pct: stockPct, color: 'var(--accent-green)' },
              { label: '加密', value: `$${cryptoTotal.toLocaleString()}`, pct: cryptoPct, color: 'var(--accent-yellow)' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-xs text-[var(--text-muted)] mb-0.5">{stat.label}</div>
                <div className="text-sm font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)]">{stat.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart — CSS conic-gradient */}
        <div className="flex-shrink-0">
          <div
            className="w-40 h-40 rounded-full relative"
            style={{
              background: `conic-gradient(
                var(--accent-blue) 0% ${bankPct}%,
                var(--accent-green) ${bankPct}% ${(+bankPct + +stockPct).toFixed(1)}%,
                var(--accent-yellow) ${(+bankPct + +stockPct).toFixed(1)}% 100%
              )`,
            }}
          >
            <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
              <div className="text-center">
                <div className="text-xs text-[var(--text-muted)]">分配</div>
                <div className="text-lg font-black text-white">3</div>
                <div className="text-xs text-[var(--text-muted)]">資產</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-blue)' }} /><span className="text-xs text-[var(--text-muted)]">銀行</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-green)' }} /><span className="text-xs text-[var(--text-muted)]">股票</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-yellow)' }} /><span className="text-xs text-[var(--text-muted)]">加密</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
