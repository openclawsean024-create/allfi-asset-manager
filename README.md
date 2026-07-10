# AllFi 資產管家 v2.0

純前端、零 API Key 的多帳戶資產 dashboard。

## 為什麼 v2.0？
v1.1 曾卡在 NextAuth v5 + edge runtime + Stripe 等複雜後端整合。v2.0 砍掉所有後端：

- 匿名使用，零登入
- 純 localStorage 持久化
- 6 種帳戶類型 + 6 種幣別
- CSV 匯入/匯出

## 技術棧
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- 純前端，無 backend

## 開發
```bash
npm install
npm run dev
```

## 部署
Push to `main` branch 觸發 Vercel deploy。

## 完整規格書
見 Notion subpage。
