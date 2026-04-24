import { useMutation } from '@tanstack/react-query'
import { api } from '@/shared/api/client'
import type { AskRequest, AskResponse } from '@/shared/api/types'
import type { AnalysisResult } from '@/shared/utils'
import { formatCurrency, formatPercent } from '@/shared/utils'

// ─── API mutation ─────────────────────────────────────────────────────────────
export function useAsk() {
  return useMutation({
    mutationFn: (data: AskRequest) =>
      api.post<AskResponse>('/ask', data),
  })
}

// ─── Local answer engine (used when API is unavailable) ───────────────────────
export function getLocalAnswer(query: string, analysis: AnalysisResult): string {
  const q = query.toLowerCase()
  const { projects, employees, metrics } = analysis

  // Risk / low margin
  if (q.includes('risk') || q.includes('low margin') || q.includes('danger')) {
    const risky = projects.filter((p) => p.status === 'At Risk')
    if (risky.length === 0) return 'No projects are currently at risk. All margins exceed 20%.'
    return risky
      .map(
        (p) =>
          `${p.name} is at risk with a margin of ${p.margin != null ? formatPercent(p.margin) : 'N/A'} (${formatCurrency(p.profit)} profit on ${formatCurrency(p.revenue)} revenue).`,
      )
      .join(' ')
  }

  // Overloaded / busiest
  if (q.includes('overload') || q.includes('busiest') || q.includes('most hours')) {
    const top = [...employees].sort((a, b) => b.hours - a.hours)[0]
    if (!top) return 'No employee data available.'
    return `${top.name} has the most hours logged at ${top.hours}h, contributing ${formatCurrency(top.profit)} in profit.`
  }

  // Highest margin / best project
  if (q.includes('highest margin') || q.includes('best project') || q.includes('most profitable')) {
    const best = [...projects].filter(p => p.margin != null).sort((a, b) => (b.margin ?? 0) - (a.margin ?? 0))[0]
    if (!best) return 'No project data available.'
    return `${best.name} has the highest margin at ${best.margin != null ? formatPercent(best.margin) : 'N/A'} with ${formatCurrency(best.revenue)} revenue and ${formatCurrency(best.profit)} profit.`
  }

  // Summary / overview
  if (q.includes('summary') || q.includes('overview') || q.includes('tell me about')) {
    const risky = projects.filter((p) => p.status === 'At Risk')
    return (
      `Portfolio summary: ${formatCurrency(metrics.totalRevenue)} total revenue, ` +
      `${formatCurrency(metrics.totalProfit)} profit, ${formatPercent(metrics.avgMargin)} avg margin ` +
      `across ${projects.length} projects and ${employees.length} employees. ` +
      (risky.length > 0
        ? `${risky.map((p) => p.name).join(', ')} ${risky.length === 1 ? 'needs' : 'need'} attention.`
        : 'All projects are healthy.')
    )
  }

  // Underutilized
  if (q.includes('underutiliz') || q.includes('under-utiliz')) {
    const under = employees.filter((e) => e.tag === 'underutilized')
    if (under.length === 0) return 'No employees appear underutilized based on current data.'
    return `${under.map((e) => e.name).join(', ')} ${under.length === 1 ? 'is' : 'are'} underutilized and could be reallocated to higher-demand projects.`
  }

  // Top earner
  if (q.includes('top') && (q.includes('earner') || q.includes('employee') || q.includes('profit'))) {
    const top = [...employees].sort((a, b) => b.profit - a.profit)[0]
    if (!top) return 'No employee data available.'
    return `${top.name} is the top profit contributor with ${formatCurrency(top.profit)} over ${top.hours} hours.`
  }

  // Fallback
  return (
    `Based on the loaded data: ${projects.length} projects, ${employees.length} employees, ` +
    `${formatCurrency(metrics.totalRevenue)} total revenue with a ${formatPercent(metrics.avgMargin)} avg margin. ` +
    `Ask a more specific question to dive deeper — try "which project is at risk?" or "give me a summary".`
  )
}
