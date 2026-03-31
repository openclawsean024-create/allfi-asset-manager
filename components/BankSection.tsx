interface BankAccount {
  id: string
  name: string
  institution: string
  balance: number
  lastUpdated: string
}

interface Props { accounts: BankAccount[] }

export default function BankSection({ accounts }: Props) {
  const total = accounts.reduce((s, a) => s + a.balance, 0)
  return (
    <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)' }}>🏦</div>
        <h2 className="font-black text-white">銀行帳戶</h2>
        <span className="ml-auto text-xs font-mono text-[var(--accent-blue)] font-bold">${total.toLocaleString()}</span>
      </div>
      <div className="space-y-3">
        {accounts.map(a => (
          <div key={a.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-sm font-semibold text-white">{a.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{a.institution}</div>
            </div>
            <div className="text-right font-mono font-bold text-white">
              ${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
