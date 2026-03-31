export default function Header() {
  return (
    <header style={{ background: 'rgba(10,14,26,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }}>
            💰
          </div>
          <span className="font-black text-xl tracking-tight text-white">All<span style={{ color: 'var(--accent-blue)' }}>Fi</span></span>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          資產管家
        </div>
      </div>
    </header>
  )
}
