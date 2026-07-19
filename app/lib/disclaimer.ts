// ─── Disclaimer stamp — FR-010 / AC-010 ─────────────────────────────────

export const NON_ADVICE_TEXT = '僅供整理，不構成投資建議'

/** Format a stamped analysis object: every analysis carries the disclaimer + data date. */
export function stampedAnalysis<T>(body: T, dataDate: string): T & {
  disclaimer: string
  dataDate: string
} {
  return { ...body, disclaimer: NON_ADVICE_TEXT, dataDate }
}

/** True if the disclaimer is present (defensive check, AC-010). */
export function hasDisclaimer(payload: { disclaimer?: string } | null | undefined): boolean {
  return Boolean(payload && payload.disclaimer === NON_ADVICE_TEXT)
}