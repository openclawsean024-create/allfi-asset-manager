# 【AllFi 全資產聚合平台】規格計劃書

# 網站規格企劃書：AllFi 全資產聚合平台

---

文件版本：v1.0｜建立日期：2026-03-31｜原始網址：https://allfi-asset-manager.vercel.app/｜GitHub：https://github.com/your-finance/allfi｜負責人：Sophia（產品）/ Alan（技術實作參考）
# 1. 專案概述

## 1.1 專案背景與目的

「天天都在幣本位新高，既興奮又難受？」
當比特幣暴跌時，即便你的山寨幣對 BTC 上漲，你的法幣總資產可能依然在嚴重縮水。AllFi 是一個完全開源、本地自托管的個人全資產聚合平台。與 SaaS 服務不同，你的 API Key、錢包地址和資產數據永遠只存在你自己的電腦或伺服器上，甚至斷網也能查看。
核心價值：一鍵自由切換多幣種計價（USDC / BTC / ETH / CNY），穿透牛熊迷霧，看清真實的資產全局。
# 1. 專案概述

## 1.2 目標受眾（TA）

｜Web3 從業人員｜資產散落 Binance/OKX/十幾個鏈上錢包 + DeFi 協議，無法一眼看清
｜深度加密貨幣參與者｜各平台計價方式不一致，無法正確評估真實收益
｜注重隱私的投資者｜不敢把 API Key 授權給中心化 SaaS，又想統一管理
｜技術背景投資者｜想自托管、有能力部署 Docker、不依賴第三方服務
｜跨資產投資者｜同時有加密貨幣 + 美股 + 銀行存款，需要統一視圖
## 1.3 專案範圍

### In Scope

- CEX 交易所帳戶連結（Binance / OKX / Coinbase，Read-only API）
- Web3 鏈上錢包（Ethereum / BSC / Polygon + Arbitrum / Optimism / Base）
- DeFi 協議倉位（Lido / RocketPool / Aave / Compound / Uniswap V2,V3 / Curve）
- NFT 資產瀏覽與估值（Alchemy API）
- 傳統資產（銀行存款、現金、股票、基金）
- 多幣種計價切換（USDC / BTC / ETH / CNY）
- 隱私模式（一鍵隱藏金額）
- 交易記錄聚合（CEX + 鏈上）
- 數據分析（每日盈虧、費用分析、歸因分析、基準對比）
- 資產報告（日/周/月/年報）
- 成就系統（11 項投資成就徽章）
- 價格預警 + WebPush 通知
- 多主題（3 深色 + 1 淺色）
- 多語言（簡中/繁中/English）
- PWA（離線可用）
- Docker 一鍵部署
### Out of Scope

- 交易執行（下單、轉帳）
- 信用卡管理
- 稅務申報自動生成
- 即時新聞/社群整合
- 真人顧問服務
- 多用戶協作（個人用戶優先）
## 1.4 參考網站 / 競品分析

Personal Capital（personalcapital.com）｜優點：資產總覽完整、投資分析強｜缺點：僅支援美國帳戶、非開源
Ghostfolio（ghostfol.io）｜優點：開源、個人財務儀表板｜缺點：無加密貨幣深度整合
Welfy（welfy.io）｜優點：多平台 300+ 整合、即時同步｜缺點：非開源、需訂閱
AllInvestView（allinvestview.com）｜優點：專業投資組合分析、Monte Carlo｜缺點：複雜度高、非 Web3 原生
Mint（mint.com）｜優點：免費、介面簡單｜缺點：無加密支援、廣告多
切入點：AllFi 是市場上唯一同時滿足開源 + 自托管 + Web3 原生 + 傳統資產整合的產品。Personal Capital 的體驗 + Ghostfolio 的開源精神 + 專為 Web3 設計的深度整合。
# 2. 資訊架構與動線

## 2.1 網站地圖

Dashboard 首頁（/）｜總資產顯示、計價切換（USDC/BTC/ETH/CNY）、今日盈虧、資產趨勢圖、資產分布餅圖、隱私模式（Ctrl+H）
帳戶管理（/accounts）｜CEX 帳戶、鏈上錢包、DeFi 協議、NFT、傳統資產、新增帳戶向導
交易記錄（/transactions）｜全平台統一流水、增量同步、篩選、cursor 分頁
數據分析（/analytics）｜每日盈虧、費用分析、歸因分析、基準對比
資產報告（/reports）｜日報、周報、月報、年報
成就系統（/achievements）｜11 項成就徽章，已解鎖/未解鎖狀態
設定（/settings）｜帳戶安全、主題、語言、通知、資料匯出、關於
幫助（/help）｜部署指南、使用教學、Swagger API 文檔
## 2.2 使用者動線

用戶首次使用流程：下載/克隆專案 → 執行 Docker 部署腳本 → 設定 PIN 或複雜密碼 →（可選）設定 2FA TOTP → 進入 Dashboard → 引導新增第一個平台（CEX/鏈上/傳統）→ 系統自動同步資產
日常操作流程：查看總資產 → 資產分布餅圖 → 切換計價貨幣（USDC/BTC/ETH/CNY）→ Analytics 分析 → 生成月報/年報 → 解鎖成就 → 開啟隱私模式 → 設定價格預警
## 2.3 使用者旅程圖

首次部署：下載 Docker 部署腳本 → 執行部署 → 設定 PIN 或密碼 → 連接第一個錢包 → 看到完整資產總覽（滿意度 5/5）
資產整合：新增 Binance API → 新增 ETH 錢包地址 → 連接 DeFi 協議 → 感到「終於看清楚全部了」（滿意度 5/5）
日常使用：每天開啟查看總資產 → 切換 BTC 計價看真實收益 → 收到價格預警通知 → 查看本月資產報告
隱私使用：朋友想看資產 → 開啟隱私模式隱藏金額 → 分享儀表板截圖
成就挑戰：完成第一筆跨平台轉帳歸因 → 解鎖「全鏈道冠軍」成就（滿意度 5/5）
# 3. 視覺與使用者介面需求

## 3.1 品牌設計指南

Primary: #6366F1（科技靛藍）｜Secondary: #10B981（增長綠）｜Accent: #F59E0B（比特橙）｜Danger: #EF4444（虧損）｜Success: #10B981
Background Dark: #0A0A0A（深黑）｜Background Light: #F9FAFB（淺白）｜Card Dark: #18181B｜Card Light: #FFFFFF
Text Primary: #F4F4F5（深色主題）/ #1E293B（淺色主題）｜Text Secondary: #71717A
字體：Inter（英文/數字）/ Noto Sans TC（中文）/ DM Mono（程式/錢包地址）
## 3.2 主題系統

- Dark Navy｜專業深色主題（預設）
- Dark Black｜純黑主題
- Dark Midnight｜深紫主題
- Light Clean｜淺色簡潔主題
## 3.3 跨裝置支援

- Desktop ≥1024px｜完整多欄 Dashboard
- Tablet 768-1023px｜雙欄，側邊欄摺疊
- Mobile <768px｜單欄，底部 Tab Nav，PWA 主畫面捷徑
# 4. 前端功能規格

## 4.1 Dashboard 首頁

- 總資產卡片：顯示總額 + 今日盈虧（絕對值 + %）
- 計價切換器：USDC / BTC / ETH / CNY 一鍵切換
- 資產趨勢圖：折線圖（1D / 1W / 1M / 1Y / ALL）
- 資產分布餅圖：CEX / 鏈上 / DeFi / NFT / 傳統，各類型 Hover 顯示%
- 快捷操作：新增錢包 / 帳戶，設定提醒
- 隱私按鈕：Ctrl+H 或點擊一鍵隱藏所有金額
## 4.2 帳戶管理

- CEX｜Binance、OKX、Coinbase（API Key Read-only）
- 鏈上錢包｜Ethereum、BSC、Polygon、Arbitrum、Optimism、Base（錢包地址）
- DeFi｜Lido、RocketPool、Aave、Compound、Uniswap V2/V3、Curve
- NFT｜Alchemy API 集成（瀏覽 + 估值）
- 傳統資產｜銀行存款、現金、股票、基金（手動輸入）
## 4.3 交易記錄

- 統一流水：CEX + 鏈上自動聚合
- 增量同步：即時同步新交易，cursor 分頁
- 篩選器：日期範圍 / 平台 / 類型（存款/提款/交易/質押）
- 匯出：CSV / Excel
