# AllFi MVP — 実装計画

> **Alan** — 2026-03-31  
> **依據：** `docs/plans/2026-03-31-allfi-mvp-design.md`

---

## タスク一覧

### M1: Next.js プロジェクト初期化 + ダッシュボード版面
**担当:** Implementer Agent  
**所要時間:** ~15分

- [ ] `npx create-next-app@latest allfi-asset-manager --typescript --tailwind --app --no-src`
- [ ] `app/layout.tsx` — Inter + JetBrains Mono fonts、OG 設定
- [ ] `app/globals.css` — CSS 変数（dark theme colors）定義
- [ ] `app/page.tsx` — ダッシュボード版面（Net Worth Hero、3セクション）
- [ ] `components/Header.tsx` — Logo + AllFi branding
- [ ] `components/NetWorthHero.tsx` — 総資産額 + 円グラフ
- [ ] `components/AssetSection.tsx` — 銀行/株式/暗号通貨セクション

**検証:** `npm run build` → success、`http://localhost:3000` → 200

---

### M2: 株式データ統合（Yahoo Finance API）
**担当:** Implementer Agent  
**所要時間:** ~10分

- [ ] `app/api/portfolio/route.ts` — Yahoo Finance Screener API で持股取得
- [ ] `types/index.ts` — `Holding` インターフェース定義
- [ ] `components/StockAccount.tsx` — 持股卡片表示
- [ ] `lib/yahoo-finance.ts` — API 取得ロジック + フォールバック Mock

**検証:** `http://localhost:3000/api/portfolio` → JSON 応答（実データまたは Mock）

---

### M3: 暗号通貨統合（CoinGecko API）
**担当:** Implementer Agent  
**所要時間:** ~10分

- [ ] `app/api/crypto/route.ts` — CoinGecko API でBTC/ETH 等取得
- [ ] `types/index.ts` — `CryptoAsset` インターフェース追加
- [ ] `components/CryptoWallet.tsx` — 暗号資産カード表示
- [ ] `lib/coingecko.ts` — API ロジック + rate limit ハンドリング

**検証:** `http://localhost:3000/api/crypto` → JSON 応答

---

### M4: 銀行 Mock + 円グラフ
**担当:** Implementer Agent  
**所要時間:** ~10分

- [ ] `app/api/accounts/route.ts` — 銀行口座 Mock データ
- [ ] `components/BankAccount.tsx` — 銀行カード表示
- [ ] `components/AssetPieChart.tsx` — CSS conic-gradient 円グラフ
- [ ] `app/api/networth/route.ts` — 全データを集計

**検証:** 円グラフが3色を正しく表示、合計 = 100%

---

### M5: 最終ビルド + Vercel deploy
**担当:** Alan（手動）  
**所要時間:** ~5分

- [ ] `npm run build` → success
- [ ] `vercel deploy --prod --yes`
- [ ] 実 URL 検証（HTTP 200）

---

## 実装モード
Subagent-driven（各タスク並列実行）

## コミット策略
各 M 完了後即コミット（1ファイル変更毎ではない）
