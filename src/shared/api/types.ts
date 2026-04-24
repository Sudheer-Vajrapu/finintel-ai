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
export type ProjectStatus = 'Healthy' | 'At Risk' | 'Warning'
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

export interface Employee {
  id: string
  name: string
  hours: number
  profit: number
  projects: string[]
  tag: EmployeeTag
}

// ─── Risks & Recommendations ──────────────────────────────────────────────────
export type RiskSeverity = 'high' | 'medium' | 'low'

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

export interface AskResponse {
  answer: string
  sources?: string[]
  confidence?: number
}

// ─── Shared ───────────────────────────────────────────────────────────────────
export type TimeRange = 'all' | '1m' | '3m' | '6m' | '1y'
