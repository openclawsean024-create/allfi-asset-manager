export default function Header() {
  return (
    <header style={{ background: '#00261E' }}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#00B900' }}>
            A
          </div>
          <span className="font-serif text-lg font-bold text-white tracking-tight">AllFi</span>
        </div>
        <div className="text-xs text-white/50 tracking-widest uppercase">
          資產管家
        </div>
      </div>
    </header>
  );
}
