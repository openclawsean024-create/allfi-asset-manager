export default function Header() {
  return (
    <header style={{ background: 'var(--color-navy-deep)', borderBottom: '1px solid rgba(196,163,90,0.2)' }}>
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: 'var(--color-gold)' }}>
            <span className="text-sm font-black" style={{ color: 'var(--color-navy-deep)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>A</span>
          </div>
          <span className="text-lg font-bold tracking-widest text-white" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.12em' }}>ALLFI</span>
          <span className="text-[9px] tracking-[0.2em] text-[--color-gold] uppercase ml-1">Private Wealth</span>
        </div>
        <div className="text-xs text-white/50 tracking-widest uppercase">資產管家</div>
      </div>
    </header>
  );
}
