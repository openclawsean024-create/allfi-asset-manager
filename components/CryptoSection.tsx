interface CryptoAsset {
  symbol: string
  name: string
  amount: number
  price: number
  value: number
}

interface Props { assets: CryptoAsset[] }

export default function CryptoSection({ assets }: Props) {
  const total = assets.reduce((s, a) => s + a.value, 0)
  return (
    <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: '300ms' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-yellow)' }}>₿</div>
        <h2 className="font-black text-white">加密貨幣</h2>
        <span className="ml-auto text-xs font-mono text-[var(--accent-yellow)] font-bold">${total.toLocaleString()}</span>
      </div>
      <div className="space-y-3">
        {assets.map(a => (
          <div key={a.symbol} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{a.symbol}</span>
                <span className="text-xs text-[var(--text-muted)]">{a.name}</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">{a.amount} @ ${a.price.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-white">${a.value.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">市值</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
