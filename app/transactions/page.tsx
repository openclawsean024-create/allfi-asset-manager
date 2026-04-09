"use client";

import { useMemo, useState } from 'react';

type TxType = '存款' | '提款' | '交易' | '質押';
type TxStatus = '已完成' | '處理中' | '失敗';

type Tx = { date: string; type: TxType; platform: string; name: string; amount: number; status: TxStatus };

const mock: Tx[] = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  type: (['存款','提款','交易','質押'] as TxType[])[i % 4],
  platform: (['Binance','Coinbase','ETH Wallet','Chase Bank'] as const)[i % 4],
  name: `Transaction ${i + 1}`,
  amount: 100 + i * 137,
  status: (['已完成','處理中','失敗'] as TxStatus[])[i % 3],
}));

function Starfield() { return <div id="starfield" />; }
function Topbar() { return <div className="topbar"><div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontFamily:'var(--font-serif)',fontSize:18,fontWeight:700}}>AllFi</span><span style={{fontSize:12,color:'var(--text-muted)'}}>Transactions</span></div></div>; }

export default function TransactionsPage() {
  const [type, setType] = useState('全部');
  const [platform, setPlatform] = useState('全部');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => mock.filter(t => (type === '全部' || t.type === type) && (platform === '全部' || t.platform === platform)), [type, platform]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return <><Starfield /><div style={{position:'relative',zIndex:1,minHeight:'100vh'}}><Topbar /><main style={{maxWidth:1100,margin:'0 auto',padding:'48px 32px 80px'}}><div className="gold-card" style={{padding:'2px',marginBottom:16}}><div className="gold-card-inner" style={{padding:'20px'}}><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select value={type} onChange={e=>{setType(e.target.value);setPage(1)}} style={sel}><option>全部</option><option>存款</option><option>提款</option><option>交易</option><option>質押</option></select><select value={platform} onChange={e=>{setPlatform(e.target.value);setPage(1)}} style={sel}><option>全部</option><option>Binance</option><option>Coinbase</option><option>ETH Wallet</option><option>Chase Bank</option></select><button onClick={()=>{ const csv=['date,type,platform,name,amount,status', ...filtered.map(t=>`${t.date},${t.type},${t.platform},${t.name},${t.amount},${t.status}`)].join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='transactions.csv'; a.click(); URL.revokeObjectURL(url); }} style={btn}>匯出 CSV</button></div></div></div><div className="gold-card" style={{padding:'2px'}}><div className="gold-card-inner" style={{padding:'20px'}}>{slice.length === 0 ? <p style={{color:'var(--text-muted)'}}>沒有交易紀錄</p> : slice.map(tx => <div key={`${tx.date}-${tx.name}`} style={{display:'grid',gridTemplateColumns:'120px 90px 160px 1fr 120px 100px',gap:12,padding:'12px 0',borderBottom:'1px solid var(--border)'}}><span>{tx.date}</span><span>{tx.type}</span><span>{tx.platform}</span><span>{tx.name}</span><span style={{color:tx.type==='提款' ? 'var(--danger)' : 'var(--success)'}}>{tx.type==='提款' ? '-' : '+'}${tx.amount.toFixed(2)}</span><span>{tx.status}</span></div>)}<div style={{display:'flex',justifyContent:'space-between',marginTop:16}}><button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={btn}>上一頁</button><span>Page {page} / {totalPages}</span><button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={btn}>下一頁</button></div></div></div></main></div></>;
}
const sel: React.CSSProperties = { padding:'10px 12px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text-primary)' };
const btn: React.CSSProperties = { padding:'10px 14px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text-primary)', cursor:'pointer' };
