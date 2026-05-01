// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
}

// ─── Ingest ───────────────────────────────────────────────────────────────────
export interface IngestResponse {
  message: string
  file_id?: string
  files_processed?: number
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
export interface MetricsApiResponse {
  time_range: string
  overall_summary: {
    total_revenue: number
    total_cost: number
    total_profit: number
    avg_margin_pct: number
    total_employees: number
  }
  monthly?: Record<string, {
    total_revenue: number
    total_cost: number
    total_profit: number
    employees: number
    avg_margin_pct: number
  }>
}

// Normalized metrics for UI consumption
export interface Metrics {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  avgMarginPct: number
  totalEmployees: number
  totalHours?: number
  totalRecords?: number
  timeRange: string
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export type ProjectStatus = 'Healthy' | 'At Risk' | 'Average'
export type TrendValue = 'Up' | 'Down' | 'Stable'

export interface ProjectTrend {
  revenue_trend: TrendValue
  cost_trend: TrendValue
  profit_trend: TrendValue
  margin_trend: TrendValue
}

// Raw API response (array format)
export interface ProjectsApiResponse {
  time_range: string
  projects: Array<{
    project_name: string
    total_revenue: number
    total_cost: number
    total_profit: number
    gross_margin_pct: number
    status: ProjectStatus
    trends: ProjectTrend
    employees?: number
    hours?: number
  }>
}

// Normalized project for UI consumption
export interface Project {
  id: string
  name: string
  revenue: number
  cost: number
  profit: number
  margin: number
  status: ProjectStatus
  trend?: ProjectTrend
  employees?: number
  hours?: number
}

// ─── Employees ────────────────────────────────────────────────────────────────
export type EmployeeTag = 'optimal' | 'high_contributor' | 'underutilized' | 'overloaded'
export type ContributionStatus = 'High' | 'Average' | 'Low'

export interface EmployeeTrend {
  revenue_trend: TrendValue
  cost_trend: TrendValue
  profit_trend: TrendValue
  margin_trend: TrendValue
}

export interface EmployeeProject {
  project_name: string
  revenue: number
  profit: number
  hours: number
}

// Raw API response for /employees endpoint
export interface EmployeesApiResponse {
  time_range: string
  count: number
  employees: Array<{
    employee_name: string
    total_hours: number
    total_revenue: number
    total_profit: number
    total_cost: number
    gross_margin_pct: number
    utilization_pct: number
    attendance_pct?: number
    vacation_days?: number
    leave_days?: number
    working_days?: number
    projects: EmployeeProject[]
    contribution_status: ContributionStatus
    trends?: EmployeeTrend
  }>
}

// Normalized employee for UI consumption
export interface Employee {
  id: string
  name: string
  hours: number
  revenue: number
  profit: number
  cost: number
  grossMarginPct: number
  utilizationPct: number
  attendancePct?: number
  vacationDays?: number
  leaveDays?: number
  workingDays?: number
  projects: EmployeeProject[]
  tag: EmployeeTag
  contributionStatus: ContributionStatus
  trends?: EmployeeTrend
}

// ─── Risks & Recommendations ──────────────────────────────────────────────────
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'positive'
export type RiskCategory = 'financial' | 'workforce' | 'operational' | 'general'
export type RiskPriority = 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
export type PerformanceBand = 'Star' | 'Solid' | 'Watch'

export interface RiskMetrics {
  // Financial metrics (employee & project level)
  total_revenue?: number
  total_cost?: number
  total_profit?: number
  avg_margin_pct?: number
  margin_pct?: number
  target_margin?: number
  gap_pct?: number
  billing_rate?: number
  cost_rate?: number
  rate_ratio?: number
  buffer_pct?: number
  profit_recovery?: number
  missing_fields?: string[]
  revenue?: number
  cost?: number
  profit?: number
  employees?: number
  
  // Workforce metrics
  consecutive_overload_months?: number
  avg_utilisation_pct?: number
  months?: string[]
  leave_pct_latest?: number
  billable_drop_pct?: number
  latest_month?: string
  estimated_replacement_cost?: number
  util_series?: number[]
  total_drop_pct?: number
  leave_days?: number
  working_days?: number
  leave_pct?: number
  month?: string
  estimated_revenue_impact?: number
  months_on_record?: number
  target_pct?: number
  
  // Operational metrics
  hours_gap?: number
  estimated_rev_gap?: number
  consecutive_bench_months?: number
  bench_cost?: number
  consecutive_ceiling_months?: number
  approved_hours_per_month?: number
  months_covered?: number
  
  // Project-level metrics
  margin_series?: number[]
  drop_pct?: number
  employee_count?: number
  
  // Trend metrics
  cost_series?: number[]
  cost_growth_pct?: number
  
  // Legacy/general
  performance_score?: number
  performance_band?: PerformanceBand
}

export interface RiskItem {
  type: string
  category: RiskCategory
  severity: RiskSeverity
  entity: string
  project: string
  description: string
  recommendation: string
  owner: string
  deadline: string
  metrics: RiskMetrics
  linked_employees: string[]
  revenue_contribution_pct: number
  priority: RiskPriority
}

export interface RecommendationItem {
  action: string
  owner: string
  deadline: string
  priority: RiskPriority
  priority_score: number
  category: RiskCategory
  linked_employees: string[]
  related_risk_type: string
}

export interface EmployeeScorecardPerformance {
  score: number
  band: PerformanceBand
  breakdown: {
    margin_score: number
    utilisation_score: number
    attendance_score: number
  }
  inputs: {
    margin_pct: number
    utilisation_pct: number
    leave_pct: number
    months_covered: number
  }
}

export interface EmployeeScorecard {
  employee: string
  project: string
  months_covered: number
  latest_month: string
  performance: EmployeeScorecardPerformance
  total_revenue: number
  total_profit: number
  avg_utilisation: number
}

export interface RiskOverview {
  total_risks: number
  action_needed: number
  by_severity: Record<RiskSeverity, number>
  by_category: Record<RiskCategory, number>
  highest_priority: string
}

export interface ExecutiveSummary {
  top_critical_actions: Array<{
    type: string
    entity: string
    project: string
    severity: RiskSeverity
    priority: RiskPriority
    owner: string
    deadline: string
    estimated_impact: number
  }>
  financial_exposure: {
    estimated_total: number
    components: {
      loss_making_projects: number
      loss_making_employees: number
      bench_cost: number
      low_utilisation_gap: number
      high_leave_impact: number
    }
  }
  execution_load: {
    total_recommendations: number
    immediate_actions: number
    short_term_actions: number
    recurring_signals: number
  }
}

export interface RisksApiResponse {
  overview: RiskOverview
  executive_summary: ExecutiveSummary
  risks: RiskItem[]
  financial_risks: RiskItem[]
  workforce_risks: RiskItem[]
  operational_risks: RiskItem[]
  positive_signals: RiskItem[]
  recommendations: RecommendationItem[]
  employee_scorecards: EmployeeScorecard[]
  ai_insights: string
  summary: {
    total_revenue: number
    total_cost: number
    total_profit: number
    avg_margin_pct: number
    total_employees: number
    total_hours: number
  }
  meta: {
    time_range: string
    total_employees: number
    total_risks: number
    action_needed: number
    records_analysed: number
  }
}

// Normalized risks data for UI consumption
export interface RisksData {
  overview: RiskOverview
  risks: RiskItem[]
  financialRisks: RiskItem[]
  workforceRisks: RiskItem[]
  operationalRisks: RiskItem[]
  positiveSignals: RiskItem[]
  recommendations: RecommendationItem[]
  employeeScorecards: EmployeeScorecard[]
  aiInsights: string
  meta: RisksApiResponse['meta']
}

// Legacy types for backward compatibility
export interface Risk {
  id: string
  title: string
  description: string
  severity: RiskSeverity
  project?: string
  employee?: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'pricing' | 'staffing' | 'cost' | 'general'
}

export interface RisksResponse {
  risks: Risk[]
  recommendations: Recommendation[]
}

// ─── Q&A ──────────────────────────────────────────────────────────────────────
export interface AskRequest {
  query: string
  context?: string
}

export type AskVisualType = 'metric' | 'text' | 'table'

export interface AskResponse {
  answer: string
  sources?: string[]
  confidence?: number
  visual_type?: AskVisualType
  summary?: string
  columns?: string[]
  data?: (string | number | null)[][] | Record<string, string | number | null>[]
}

// ─── Shared ───────────────────────────────────────────────────────────────────
export type TimeRange = 'all' | '1m' | '3m' | '6m' | '1y'
