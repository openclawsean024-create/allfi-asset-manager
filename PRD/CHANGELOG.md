# allfi-asset-manager · 變更日誌

## v3.0.2 — 2026-09-06
**by Sean 10-repo-fleet (Batch 4C)**

### Added
- `PRD/CHANGELOG.md` — 本檔
- `.github/workflows/ci.yml` — 4-job CI（lint / test / build / deploy→Vercel）
- `eslint.config.mjs` — ESLint 9 flat config + @typescript-eslint plugin
- `PRD/SPEC.md` 開頭加 v3.0.2 banner + 維護者換成 Sean 10-repo-fleet

### Changed
- `PRD/SPEC.md` 開頭 frontmatter: 版本 v3.0 → v3.0.2 + 更新日期 2026-09-06
- 規格書正文 §1–§15 維持 v3.0 原貌(此次僅 fleet alignment)

### Notes
- v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet
- Deploy target: Vercel(vercel.json 已存在,framework: nextjs)
- Lint: 0 error / 3 warning(unused lucide-react imports — 預留,非阻擋)
- Tests: 64/64 vitest 全綠(10 個 test 檔)
- Build: Next.js 16 + Turbopack,3 個 static page

---

## v3.0 — 2026-07-19 (forced upgrade · sweet-spot-driven rewrite)
- 完整 v3.0 規格書(1147 行)
- sweet spot 7.2/10、商業化 80.4
- 5 個 ADR、5 條市場驗證 checklist
- 6 種帳戶類型、6 種幣別、CSV 匯入/匯出、加密匯出、paywall 控管
- 64 個 vitest 單元測試(10 個 test 檔)
- 純前端、零後端、零登入、零 API Key

---

## v2.2.1 (legacy)
- 既有 sweet spot 4/10 評分
- 仍在 v1 NextAuth v5 + edge runtime + Stripe 複雜整合階段
