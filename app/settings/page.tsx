'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'allfi_theme';
const LANG_KEY = 'allfi_lang';
const PRIVACY_KEY = 'allfi_privacy_default';

const themes = {
  navy: { '--bg': '#050a14', '--bg-surface': '#0a1628', '--bg-card': '#0d1f3c', '--text-primary': '#e8e4d9', '--text-secondary': '#8a9bb5', '--text-muted': '#4a6080', '--border': 'rgba(212,175,55,0.12)', '--border-gold': 'rgba(212,175,55,0.35)' },
  black: { '--bg': '#000000', '--bg-surface': '#090909', '--bg-card': '#111111', '--text-primary': '#f5f5f5', '--text-secondary': '#a1a1aa', '--text-muted': '#6b7280', '--border': 'rgba(255,255,255,0.10)', '--border-gold': 'rgba(212,175,55,0.35)' },
  midnight: { '--bg': '#120824', '--bg-surface': '#1a1033', '--bg-card': '#22163f', '--text-primary': '#f4efff', '--text-secondary': '#c4b5fd', '--text-muted': '#8b5cf6', '--border': 'rgba(139,92,246,0.18)', '--border-gold': 'rgba(212,175,55,0.35)' },
  light: { '--bg': '#f9fafb', '--bg-surface': '#ffffff', '--bg-card': '#ffffff', '--text-primary': '#1e293b', '--text-secondary': '#475569', '--text-muted': '#64748b', '--border': 'rgba(15,23,42,0.10)', '--border-gold': 'rgba(212,175,55,0.35)' },
} as const;

type ThemeKey = keyof typeof themes;

function applyTheme(theme: ThemeKey) {
  const root = document.documentElement;
  Object.entries(themes[theme]).forEach(([k, v]) => root.style.setProperty(k, v));
  localStorage.setItem(THEME_KEY, theme);
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeKey>('navy');
  const [lang, setLang] = useState('繁體中文');
  const [privacyDefault, setPrivacyDefault] = useState(false);
  const [priceAlert, setPriceAlert] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);
  const [pin, setPin] = useState('');
  const [lastBackup] = useState('2026-04-09 21:00');

  useEffect(() => {
    const t = (localStorage.getItem(THEME_KEY) as ThemeKey) || 'navy';
    const l = localStorage.getItem(LANG_KEY) || '繁體中文';
    const p = localStorage.getItem(PRIVACY_KEY) === 'true';
    setTheme(t);
    setLang(l);
    setPrivacyDefault(p);
    applyTheme(t);
  }, []);

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}><div className="topbar"><div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37, #b8960c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#050a14' }}>A</div><span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700 }}>AllFi</span></div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Settings</span></div></div><main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 80px' }}><Section title="主題設定"><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{(['navy', 'black', 'midnight', 'light'] as const).map((k) => <button key={k} onClick={() => { setTheme(k); applyTheme(k); }} style={{ padding: '10px 14px', border: '1px solid var(--border)', background: theme === k ? 'var(--gold-dim)' : 'transparent', color: 'var(--text-primary)', borderRadius: 8, cursor: 'pointer' }}>{k}</button>)}</div></Section><Section title="語言設定"><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{['English', '繁體中文', '簡體中文'].map((l) => <button key={l} onClick={() => { setLang(l); localStorage.setItem(LANG_KEY, l); }} style={{ padding: '10px 14px', border: '1px solid var(--border)', background: lang === l ? 'var(--gold-dim)' : 'transparent', color: 'var(--text-primary)', borderRadius: 8, cursor: 'pointer' }}>{l}</button>)}</div></Section><Section title="隱私設定"><Toggle label="預設隱私模式" value={privacyDefault} onChange={(v: boolean) => { setPrivacyDefault(v); localStorage.setItem(PRIVACY_KEY, String(v)); }} /><div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}><input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="設定 PIN" style={inputStyle} /><button onClick={() => alert('PIN 已設定（Mock）')} style={btnStyle}>確認</button></div></Section><Section title="通知設定"><Toggle label="價格預警" value={priceAlert} onChange={(v: boolean) => setPriceAlert(v)} /><Toggle label="每日報告" value={dailyReport} onChange={(v: boolean) => setDailyReport(v)} /><button onClick={() => alert('已請求推播權限（Mock）')} style={{ ...btnStyle, marginTop: 12 }}>推播權限</button></Section><Section title="資料管理"><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button onClick={() => { const data = localStorage.getItem('allfi_assets_v1') || '{}'; const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'allfi-backup.json'; a.click(); URL.revokeObjectURL(url); }} style={btnStyle}>匯出資料</button><button onClick={() => { if (confirm('確定清除所有資料？')) localStorage.clear(); }} style={{ ...btnStyle, borderColor: 'var(--danger)', color: 'var(--danger)' }}>清除所有資料</button></div><p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>最後備份：{lastBackup}</p></Section><Section title="關於"><p>版本號：v0.1.0</p><p><a href="https://github.com/openclawsean024-create/allfi-asset-manager" target="_blank" rel="noreferrer">GitHub</a></p><p>本專案為開源、自托管資產管理工具。</p></Section></main></div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="gold-card" style={{ padding: '2px', marginBottom: 18 }}><div className="gold-card-inner" style={{ padding: '22px 24px' }}><h2 style={{ marginTop: 0 }}>{title}</h2>{children}</div></section>; }
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) { return <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 }}><span>{label}</span><button onClick={() => onChange(!value)} style={{ width: 52, height: 30, borderRadius: 999, border: '1px solid var(--border)', background: value ? 'var(--gold)' : 'transparent', color: value ? '#050a14' : 'var(--text-primary)', cursor: 'pointer' }}>{value ? 'ON' : 'OFF'}</button></label>; }
const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)' };
const btnStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' };
