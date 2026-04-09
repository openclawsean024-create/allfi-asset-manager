"use client";

import { useState } from 'react';

const achievements = [
  { icon: '🏆', title: '全鏈道冠軍', desc: '連接超過 5 條區塊鏈錢包', date: '2026-04-01' },
  { icon: '🌊', title: 'DeFi 航海家', desc: '在 3 個以上 DeFi 協議中有倉位', date: '2026-04-02' },
  { icon: '💎', title: '比特 diamond', desc: '持有超過 1 BTC', date: '2026-04-03' },
  { icon: '📈', title: '收益贏家', desc: '單月收益超過 10%', date: '2026-04-04' },
  { icon: '🏦', title: '銀行家', desc: '連結超過 3 個銀行帳戶', date: '2026-04-05' },
  { icon: '📊', title: '分析大師', desc: '連續查看 Analytics 超過 7 天', date: '2026-04-06' },
  { icon: '🌐', title: '跨鏈橋接者', desc: '完成跨鏈轉帳', date: '2026-04-07' },
  { icon: '🔒', title: '隱私守護者', desc: '首次開啟隱私模式', date: '2026-04-08' },
  { icon: '🎯', title: '月報達人', desc: '成功生成並查看月報', date: '2026-04-09' },
  { icon: '💱', title: '多幣種大師', desc: '同時持有 5 種以上加密貨幣', date: '2026-04-10' },
  { icon: '🚀', title: '早期採用者', desc: '完成首次帳戶連結', date: '2026-04-11' },
];

function Starfield() {
  return <div id="starfield" />;
}

function Topbar() {
  return <div className="topbar"><div style={{maxWidth:1100,margin:'0 auto',padding:'0 32px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:28,height:28,borderRadius:6,background:'linear-gradient(135deg, #d4af37, #b8960c)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#050a14'}}>A</div><span style={{fontFamily:'var(--font-serif)',fontSize:18,fontWeight:700,color:'var(--text-primary)'}}>AllFi</span></div><span style={{fontSize:12,color:'var(--text-muted)'}}>Achievements</span></div></div>;
}

export default function AchievementsPage() {
  const [active, setActive] = useState<number | null>(null);
  const unlocked = achievements.length;

  return (
    <>
      <Starfield />
      <div style={{position:'relative',zIndex:1,minHeight:'100vh'}}>
        <Topbar />
        <main style={{maxWidth:1100,margin:'0 auto',padding:'48px 32px 80px'}}>
          <div className="gold-card" style={{padding:'2px',marginBottom:24}}>
            <div className="gold-card-inner" style={{padding:'28px 32px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:16,marginBottom:16}}>
                <div>
                  <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>進度</p>
                  <h1 style={{fontFamily:'var(--font-serif)',fontSize:34,margin:0}}>已解鎖：{unlocked} / 11</h1>
                </div>
              </div>
              <div style={{height:10,background:'rgba(255,255,255,0.06)',borderRadius:999,overflow:'hidden'}}>
                <div style={{width:`${(unlocked/11)*100}%`,height:'100%',background:'linear-gradient(90deg, var(--gold), var(--gold-light))'}} />
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:16}}>
            {achievements.map((a, i) => (
              <button key={a.title} onClick={() => setActive(i)} className="gold-card" style={{padding:'2px',textAlign:'left',cursor:'pointer',border:'none',background:'transparent'}}>
                <div className="gold-card-inner" style={{padding:'20px'}}>
                  <div style={{fontSize:28,marginBottom:12}}>{a.icon}</div>
                  <h3 style={{margin:'0 0 8px',fontSize:16}}>{a.title}</h3>
                  <p style={{margin:0,color:'var(--text-secondary)',fontSize:13,lineHeight:1.5}}>{a.desc}</p>
                  <div style={{marginTop:14,fontSize:12,color:'var(--gold)'}}>已解鎖</div>
                </div>
              </button>
            ))}
          </div>

          {active !== null && (
            <div onClick={() => setActive(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:16,zIndex:200}}>
              <div onClick={(e)=>e.stopPropagation()} className="gold-card" style={{padding:'2px',maxWidth:420,width:'100%'}}>
                <div className="gold-card-inner" style={{padding:'24px'}}>
                  <div style={{fontSize:28,marginBottom:12}}>{achievements[active].icon}</div>
                  <h3 style={{marginTop:0}}>{achievements[active].title}</h3>
                  <p style={{color:'var(--text-secondary)'}}>{achievements[active].desc}</p>
                  <p style={{fontSize:12,color:'var(--text-muted)'}}>解鎖日期：{achievements[active].date}</p>
                  <button onClick={()=>setActive(null)} style={{marginTop:16,padding:'10px 14px',border:'1px solid var(--border)',background:'transparent',color:'var(--text-primary)',borderRadius:8,cursor:'pointer'}}>關閉</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
