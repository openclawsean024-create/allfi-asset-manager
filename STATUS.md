# AllFi 資產管家 — STATUS.md (v3.0 sprint, 2026-07-19)

## Delegation
- Delegated by: Sophia (CPO) for Sean
- Date: 2026-07-19
- Mode: compressed 19-day sprint in single session
- Repo: openclawsean024-create/allfi-asset-manager
- Workdir: /tmp/allfi-asset-manager-dev

## Environment verification
- gh auth status: LOGGED IN (account openclawsean024-create)
- node v22.22.2 / npm 10.9.7 / vercel 51.7.0
- SPEC: loaded from https://raw.githubusercontent.com/openclawsean024-create/allfi-asset-manager/main/PRD/SPEC.md (v3.0)
- Skill loaded: nextjs-pnpm-vercel-deploy-pitfalls v1.2

## Pre-existing scaffold (from commit 665929b)
- Next.js 16.2.4 + React 19.2.4 + TS 5 strict
- Tailwind CSS v4 + @tailwindcss/postcss
- app/page.tsx + layout.tsx + globals.css (app router)
- app/lib/types.ts (Account/Currency models + DEFAULT_RATES_TO_TWD + STORAGE_KEY)
- app/lib/csv.ts (CSV import/export helpers)
- next.config.ts (no eslint key — Next 16 safe)
- next-env.d.ts (already valid)

## Stage 1 plan
1. Audit existing .gitignore → confirm adequate
2. Run `npm install` (no pnpm, with --legacy-peer-deps)
3. Confirm Next.js 16 + React 19 already at safe versions
4. Skip duplicate src/app/ scaffold (already exists)
5. Confirm Vitest available; install if missing

## Stage 2 plan (TDD)
- Pure-function core logic (no React/DB deps) — easiest to TDD
- Coverage targets per FR / AC from SPEC:
  - FR-001: account CRUD + status + version validation
  - FR-002: multi-currency TWD conversion + stale FX detection (AC-004)
  - FR-003: monthly snapshot diff (AC-007)
  - FR-004: net worth / liquid / debt ratio / concentration (AC-003)
  - FR-005: cashflow runway 3 months (AC-005)
  - FR-006: CSV preview validation (AC-006)
  - FR-007: snapshot delta + manual note
  - FR-008: encrypted export roundtrip (AC-008)
  - FR-009: paywall gate (demo vs premium flag)
  - FR-010: every analysis stamped with "非投資建議" + data date (AC-010)

Target: ≥30 unit tests, ≥80% pass rate

## Stage 3 plan
- npx next build (mandatory)

## Stage 4 plan
- commit wip: prefix
- push via x-access-token
- vercel link --yes
- vercel deploy --prod --yes

## Hard rules (reaffirmed)
- [1] no silent die — STATUS.md updated every stage
- [2] don't touch Notion
- [3] commit prefix wip:/verified:/unverified:
- [4] [真實狀態] block in final report
- [5] npx next build mandatory

## Status log
- [init] repo cloned, scaffold audited
- [stage-1] in progress...