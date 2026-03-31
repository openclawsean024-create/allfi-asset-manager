interface Holding {
  symbol: string
  name: string
  shares: number
  price: number
  value: number
  gainLoss: number
  gainLossPct: number
}

interface Props { holdings: Holding[] }

export default function StockSection({ holdings }: Props) {
  const total = holdings.reduce((s, h) => s + h.value, 0)
  return (
    <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-green)' }}>📈</div>
        <h2 className="font-black text-white">股票投資</h2>
        <span className="ml-auto text-xs font-mono text-[var(--accent-green)] font-bold">${total.toLocaleString()}</span>
      </div>
      <div className="space-y-3">
        {holdings.map(h => (
          <div key={h.symbol} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{h.symbol}</span>
                <span className="text-xs text-[var(--text-muted)]">{h.name}</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">{h.shares} shares @ ${h.price}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-white">${h.value.toLocaleString()}</div>
              <div className="text-xs font-mono" style={{ color: h.gainLoss >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {h.gainLoss >= 0 ? '+' : ''}{h.gainLossPct.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
