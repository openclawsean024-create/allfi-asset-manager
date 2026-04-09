"use client";

import { useState } from 'react';

function Starfield() { return <div id="starfield" />; }
function Topbar() { return <div className="topbar"><div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontFamily:'var(--font-serif)',fontSize:18,fontWeight:700}}>AllFi</span><span style={{fontSize:12,color:'var(--text-muted)'}}>Help</span></div></div>; }

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  return <><Starfield /><div style={{position:'relative',zIndex:1,minHeight:'100vh'}}><Topbar /><main style={{maxWidth:1100,margin:'0 auto',padding:'48px 32px 80px'}}><section className="gold-card" style={{padding:'2px',marginBottom:16}}><div className="gold-card-inner" style={{padding:'22px 24px'}}><h2>部署指南</h2><pre style={pre}>git clone https://github.com/openclawsean024-create/allfi-asset-manager\ncd allfi-asset-manager\ndocker-compose up -d</pre><p>Vercel, docker, environment variables: NOTION_API_KEY, NEXTAUTH_SECRET.</p></div></section><section className="gold-card" style={{padding:'2px',marginBottom:16}}><div className="gold-card-inner" style={{padding:'22px 24px'}}><h2>使用教學</h2><ol><li>新增銀行帳戶</li><li>新增加密貨幣錢包</li><li>查看 Analytics</li><li>設定價格預警</li></ol></div></section><section className="gold-card" style={{padding:'2px',marginBottom:16}}><div className="gold-card-inner" style={{padding:'22px 24px'}}><h2>API 文檔</h2><ul><li>GET /api/accounts</li><li>POST /api/accounts</li><li>GET /api/prices</li><li>GET /api/transactions</li></ul></div></section><section className="gold-card" style={{padding:'2px'}}><div className="gold-card-inner" style={{padding:'22px 24px'}}><h2>FAQ</h2>{['資料存在哪裡？','如何備份資料？','支援哪些交易所？'].map((q,i)=><div key={q} style={{borderTop:'1px solid var(--border)',padding:'12px 0'}}><button onClick={()=>setOpen(open===i?null:i)} style={qaBtn}>{q}</button>{open===i && <p style={{color:'var(--text-secondary)'}}>這是 Mock 回答。</p>}</div>)}</div></section></main></div></>;
}
const pre: React.CSSProperties = { padding:'14px', borderRadius:8, background:'rgba(0,0,0,0.2)', overflow:'auto' };
const qaBtn: React.CSSProperties = { width:'100%', textAlign:'left', background:'transparent', border:'none', color:'var(--text-primary)', cursor:'pointer', fontWeight:600 };
