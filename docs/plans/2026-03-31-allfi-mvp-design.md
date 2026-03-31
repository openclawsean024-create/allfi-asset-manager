# AllFi 資產管家 MVP — 設計文件

> **版本：** v1.0  
> **作者：** Alan（CTO）  
> **依據：** Sophia 規格計劃書 v1.0  
> **日期：** 2026-03-31  
> **狀態：** 已批准（基于 Sophia spec）

---

## 1. 概念與願景

AllFi 資產管家是一個**整合式資產管理平台**，使命是讓使用者用一個介面掌握「銀行存款 + 股票績效 + 虛擬貨幣餘額」的全貌。

核心主張：**「你的全部資產，一目了然。」**

MVP 定位：先做一個可運作的 Web 儀表板，串接真實資料源（股票/加密）或 Mock 資料（銀行），展示統一淨值概念。

---

## 2. 設計語言

### 色彩系統
```css
--bg-primary: #0a0e1a;        /* 深邃藏青背景 */
--bg-card: #111827;           /* 卡片背景 */
--border: rgba(255,255,255,0.08);
--accent-blue: #3b82f6;       /* 主色調藍 */
--accent-green: #10b981;       /* 獲利/正向 */
--accent-red: #ef4444;         /* 虧損/警示 */
--accent-yellow: #f59e0b;     /* 加密/警告 */
--text-primary: #f9fafb;
--text-secondary: #9ca3af;
--text-muted: #6b7280;
```

### 字體
- 主字體：Inter（Google Fonts）
- 數字/資料：JetBrains Mono（等寬）

### 設計參考
- 儀表板參考：Empower（Personal Capital）簡潔風格
- 卡片系統：每個帳戶類型一個卡片群組
- 配色：深色模式為主（投資人偏好）

### Motion
- 頁面載入：staggered fade-up（100ms 間隔）
- 數值更新：計數器動畫（300ms）
- 圓餅圖：CSS conic-gradient（無 JS 依賴）

---

## 3. 版面結構

```
┌─────────────────────────────────────────────────┐
│ Header: Logo + "AllFi" + 用戶頭像（登入後）         │
├─────────────────────────────────────────────────┤
│ Net Worth Hero: 總淨值（大字）+ 資產分配圓餅圖      │
│ [Bank: $XX] [Stocks: $XX] [Crypto: $XX]          │
├─────────────────────────────────────────────────┤
│ Bank Accounts (摺疊/展開)                        │
│  ├ Account: Chasing ****1234 — $12,450.00        │
│  └ Account: HSBC ****5678 — $8,200.00            │
├─────────────────────────────────────────────────┤
│ Stock Accounts                                   │
│  ├ AAPL — 10 shares @ $178 = $1,780 (+3.2%)     │
│  └ TSLA — 5 shares @ $175 = $875 (-1.1%)         │
├─────────────────────────────────────────────────┤
│ Crypto Wallets                                   │
│  ├ BTC — 0.25 BTC @ $65,000 = $16,250            │
│  └ ETH — 2.0 ETH @ $3,500 = $7,000               │
└─────────────────────────────────────────────────┘
```

---

## 4. 功能範圍（MVP）

### 已批核
1. **統一淨值儀表板** — 總資產 + 三類帳戶分類
2. **銀行帳戶卡片** — 顯示餘額（使用 Mock 資料，架構支援 Plaid）
3. **股票帳戶卡片** — 持股明細 + 損益（Yahoo Finance 免費 API）
4. **加密貨幣錢包卡片** — 餘額 + 市值（CoinGecko API — 免費）
5. **資產分配圓餅圖** — CSS conic-gradient
6. **響應式設計** — Mobile-first

### 排除（MVP）
- 真實銀行串接（Plaid 需要商業帳號）
- 用戶認證（NextAuth MVP 階段先不做，單一使用者）
- 交易記錄歷史
- 價格警報
- 贏負百分比顯示（非 P0）

---

## 5. 技術架構

### Stack
- **Framework:** Next.js 14（App Router）
- **樣式:** Tailwind CSS
- **字體:** Inter + JetBrains Mono（next/font）
- **資料獲取:** Yahoo Finance API（股票）、CoinGecko API（加密）、Mock（銀行）
- **部署:** Vercel

### API Routes
```
GET /api/networth        — 總淨值彙總
GET /api/portfolio       — 投資組合（股票+ETF）
GET /api/crypto          — 加密貨幣餘額
GET /api/accounts         — 銀行帳戶（Mock）
```

### 資料模型
```typescript
interface Account {
  id: string
  type: 'bank' | 'stock' | 'crypto'
  name: string
  institution: string
  balance: number        // USD
  lastUpdated: string    // ISO timestamp
}

interface Holding {
  symbol: string
  name: string
  shares: number
  price: number
  value: number
  gainLoss: number       // absolute
  gainLossPct: number   // percentage
}

interface CryptoAsset {
  symbol: string         // BTC, ETH
  amount: number
  price: number           // USD
  value: number
}
```

---

## 6. 驗收標準

- [ ] 首屏總淨值數字顯示正確
- [ ] 三個帳戶類型各有一筆示範資料
- [ ] 圓餅圖準確反映三類比例
- [ ] 股票代碼真實報價（Yahoo Finance）
- [ ] 加密幣種真實報價（CoinGecko）
- [ ] 銀行 Mock 資料正常顯示
- [ ] Mobile 響應式正常
- [ ] Vercel 部署成功，HTTP 200

---

## 7. 里程碑

| 里程碑 | 內容 |
|--------|------|
| M1 | Next.js 專案初始化 + 儀表板版面 |
| M2 | 股票資料整合（Yahoo Finance）|
| M3 | 加密貨幣整合（CoinGecko）|
| M4 | 銀行 Mock + 圓餅圖 |
| M5 | 最終部署 |
