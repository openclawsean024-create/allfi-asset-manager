// ─── Cash flow runway — FR-005 / AC-005 ─────────────────────────────────

export interface CashflowInputs {
  /** Liquid cash + bank accounts already computed (TWD). */
  availableCash: number
  /** Recurring fixed monthly outflows (TWD). */
  monthlyFixedOutflow: number
  /** Average monthly income (TWD). */
  monthlyIncome: number
  /** Optional one-off upcoming expense (TWD). */
  upcomingOneOff?: number
}

export interface RunwayResult {
  /** Months of cash remaining at current burn rate (3 month window). */
  monthsCovered: number
  /** TWD balance after 3 months. */
  projectedBalance3m: number
  /** Whether the user has positive monthly net cash flow. */
  positiveCashflow: boolean
  /** Breakdown shown to user (AC-005: must list every input used). */
  inputs: CashflowInputs
  warnings: string[]
}

/**
 * Compute 3-month runway.
 * - monthsCovered = availableCash / monthlyFixedOutflow (capped at 12 for sanity)
 * - projectedBalance3m = availableCash + 3 * (income - outflow) - (upcomingOneOff ?? 0)
 */
export function computeRunway(inputs: CashflowInputs): RunwayResult {
  const warnings: string[] = []
  const safeOutflow = Math.max(0, inputs.monthlyFixedOutflow)
  const monthsCovered =
    safeOutflow === 0 ? 12 : Math.min(12, Math.round((inputs.availableCash / safeOutflow) * 10) / 10)

  const projectedBalance3m =
    inputs.availableCash +
    3 * (inputs.monthlyIncome - safeOutflow) -
    (inputs.upcomingOneOff ?? 0)

  const positiveCashflow = inputs.monthlyIncome - safeOutflow >= 0

  if (inputs.monthlyFixedOutflow <= 0) {
    warnings.push('尚未輸入固定支出，結果僅供參考')
  }
  if (inputs.availableCash < safeOutflow) {
    warnings.push('可用現金低於一個月固定支出，建議檢視現金流')
  }
  if (projectedBalance3m < 0) {
    warnings.push('預估 3 個月後現金為負，建議檢視支出或收入')
  }

  return { monthsCovered, projectedBalance3m, positiveCashflow, inputs, warnings }
}