import type {
  MetricsApiResponse,
  Metrics,
  ProjectsApiResponse,
  Project,
  RisksApiResponse,
  RisksData,
} from './types'

/**
 * Transform raw /metrics API response to normalized UI format
 */
export function transformMetricsResponse(response: MetricsApiResponse): Metrics {
  const { overall_summary, time_range } = response
  return {
    totalRevenue: overall_summary.total_revenue,
    totalCost: overall_summary.total_cost,
    totalProfit: overall_summary.total_profit,
    avgMarginPct: overall_summary.avg_margin_pct,
    totalEmployees: overall_summary.total_employees,
    timeRange: time_range,
  }
}

/**
 * Transform raw /projects API response (array format) to normalized array
 * Maps backend field names to UI field names
 */
export function transformProjectsResponse(response: ProjectsApiResponse): Project[] {
  const { projects } = response
  
  return projects.map((data) => ({
    id: generateProjectId(data.project_name),
    name: data.project_name,
    revenue: data.total_revenue,
    cost: data.total_cost,
    profit: data.total_profit,
    margin: data.gross_margin_pct,
    status: data.status,
    trend: data.trends,
    employees: data.employees,
    hours: data.hours,
  }))
  // Sort by revenue descending
  .sort((a, b) => b.revenue - a.revenue)
}

/**
 * Generate a stable ID from project name
 */
function generateProjectId(name: string): string {
  return `proj-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

/**
 * Build query string for time range
 * Maps UI values to API query params
 */
export function buildRangeParam(range: string): string {
  const rangeMap: Record<string, string> = {
    'all': '',
    '1m': '?range=1',
    '3m': '?range=3',
    '6m': '?range=6',
    '1y': '?range=12',
  }
  return rangeMap[range] ?? ''
}

/**
 * Transform raw /risks API response to normalized UI format
 * Maps snake_case backend fields to camelCase for consistency
 */
export function transformRisksResponse(response: RisksApiResponse): RisksData {
  return {
    overview: response.overview,
    risks: response.risks,
    financialRisks: response.financial_risks,
    workforceRisks: response.workforce_risks,
    operationalRisks: response.operational_risks,
    positiveSignals: response.positive_signals,
    recommendations: response.recommendations,
    employeeScorecards: response.employee_scorecards,
    aiInsights: response.ai_insights,
    meta: response.meta,
  }
}
