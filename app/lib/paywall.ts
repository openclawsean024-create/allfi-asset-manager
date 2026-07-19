// ─── Paywall gate — FR-009 ──────────────────────────────────────────────

export type Plan = 'demo' | 'premium'

export interface Feature {
  id: string
  label: string
  premiumOnly: boolean
}

export const FEATURES: Feature[] = [
  { id: 'crud', label: '帳戶 CRUD', premiumOnly: false },
  { id: 'csv-import', label: 'CSV 匯入', premiumOnly: false },
  { id: 'fx-convert', label: 'TWD 多幣別換算', premiumOnly: false },
  { id: 'snapshot-diff', label: '快照差異', premiumOnly: false },
  { id: 'cashflow-runway', label: '現金流 runway', premiumOnly: false },
  { id: 'rebalance-suggest', label: '再平衡建議', premiumOnly: true },
  { id: 'pdf-export', label: 'PDF 報表匯出', premiumOnly: true },
  { id: 'encrypted-cloud', label: '加密雲端備份', premiumOnly: true },
]

export interface PaywallDecision {
  allowed: boolean
  reason?: string
  upsell?: string
}

/** Demo: all free features pass; premium features return allowed=false. */
export function gateFeature(plan: Plan, featureId: string): PaywallDecision {
  const feature = FEATURES.find((f) => f.id === featureId)
  if (!feature) return { allowed: false, reason: `unknown feature ${featureId}` }
  if (!feature.premiumOnly) return { allowed: true }
  if (plan === 'premium') return { allowed: true }
  return {
    allowed: false,
    reason: `${feature.label} 為 Premium 功能`,
    upsell: '升級至 Premium 解鎖',
  }
}

/** Number of features available per plan (for marketing copy). */
export function countAvailable(plan: Plan): number {
  return FEATURES.filter((f) => gateFeature(plan, f.id).allowed).length
}