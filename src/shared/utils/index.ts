// ─── Number formatting ────────────────────────────────────────────────────────
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
    return `$${Math.round(value).toLocaleString()}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString()
}

// ─── CSV parsing ──────────────────────────────────────────────────────────────
export interface CsvRow {
  employee: string
  project: string
  date: string
  hours: string
  billing_rate: string
  cost_rate: string
  [key: string]: string
}

export function parseCSV(text: string): CsvRow[] {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row as CsvRow
  })
}

export function isValidCSV(text: string): boolean {
  const firstLine = text.trim().split('\n')[0] ?? ''
  const requiredCols = ['employee', 'project', 'hours', 'billing_rate', 'cost_rate']
  return requiredCols.every((col) => firstLine.toLowerCase().includes(col))
}

// ─── Date filtering ───────────────────────────────────────────────────────────
export type TimeRange = 'all' | '1m' | '3m' | '6m' | '1y'

export function filterByTimeRange<T extends { date?: string }>(
  rows: T[],
  range: TimeRange,
): T[] {
  if (range === 'all') return rows
  const now = new Date()
  const cutoffDays: Record<Exclude<TimeRange, 'all'>, number> = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
  }
  const days = cutoffDays[range]
  return rows.filter((r) => {
    if (!r.date) return true
    const d = new Date(r.date)
    return (now.getTime() - d.getTime()) / 86_400_000 <= days
  })
}

// ─── Analytics computation ────────────────────────────────────────────────────
import type { Project, Employee, Risk, Recommendation } from '@/shared/api/types'

export interface AnalysisResult {
  projects: Project[]
  employees: Employee[]
  risks: Risk[]
  recommendations: Recommendation[]
  metrics: {
    totalRevenue: number
    totalProfit: number
    avgMargin: number
    totalHours: number
    totalRecords: number
  }
}

export function computeAnalysis(rows: CsvRow[]): AnalysisResult {
  const projectMap: Record<string, {
    name: string; rev: number; cost: number; profit: number; hours: number
  }> = {}

  const employeeMap: Record<string, {
    name: string; hours: number; profit: number; projects: Set<string>
  }> = {}

  let totalRevenue = 0
  let totalProfit = 0
  let totalHours = 0

  rows.forEach((r) => {
    const hours = parseFloat(r.hours) || 0
    const billingRate = parseFloat(r.billing_rate) || 0
    const costRate = parseFloat(r.cost_rate) || 0
    const rev = hours * billingRate
    const cost = hours * costRate
    const profit = rev - cost

    totalRevenue += rev
    totalProfit += profit
    totalHours += hours

    // Projects
    if (!projectMap[r.project]) {
      projectMap[r.project] = { name: r.project, rev: 0, cost: 0, profit: 0, hours: 0 }
    }
    projectMap[r.project].rev += rev
    projectMap[r.project].cost += cost
    projectMap[r.project].profit += profit
    projectMap[r.project].hours += hours

    // Employees
    if (!employeeMap[r.employee]) {
      employeeMap[r.employee] = { name: r.employee, hours: 0, profit: 0, projects: new Set() }
    }
    employeeMap[r.employee].hours += hours
    employeeMap[r.employee].profit += profit
    employeeMap[r.employee].projects.add(r.project)
  })

  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Build projects
  const projects: Project[] = Object.values(projectMap).map((p, i) => {
    const margin = p.rev > 0 ? (p.profit / p.rev) * 100 : 0
    return {
      id: `proj-${i}`,
      name: p.name,
      revenue: Math.round(p.rev),
      cost: Math.round(p.cost),
      profit: Math.round(p.profit),
      margin: parseFloat(margin.toFixed(1)),
      status: (margin >= 30 ? 'Healthy' : margin >= 15 ? 'Warning' : 'At Risk') as Project['status'],
      trend: { revenue_trend: 'Stable' as const, cost_trend: 'Stable' as const, profit_trend: 'Stable' as const, margin_trend: 'Stable' as const },
      employees: 0, // Not available from CSV parsing
      hours: Math.round(p.hours),
    }
  }).sort((a, b) => b.revenue - a.revenue)

  // Build employees
  const avgEmpHours = Object.values(employeeMap).reduce((s, e) => s + e.hours, 0)
    / Math.max(1, Object.keys(employeeMap).length)

  const employees: Employee[] = Object.values(employeeMap).map((e, i) => {
    const ratio = e.hours / avgEmpHours
    let tag: Employee['tag']
    if (ratio > 1.3) tag = 'overloaded'
    else if (ratio < 0.6) tag = 'underutilized'
    else if (e.profit > avgMargin * totalRevenue / 100 / Object.keys(employeeMap).length * 1.5) tag = 'high_contributor'
    else tag = 'optimal'

    return {
      id: `emp-${i}`,
      name: e.name,
      hours: Math.round(e.hours),
      profit: Math.round(e.profit),
      projects: [...e.projects],
      tag,
    }
  }).sort((a, b) => b.profit - a.profit)

  // Build risks & recommendations
  const risks: Risk[] = []
  const recommendations: Recommendation[] = []
  let rIdx = 0, recIdx = 0

  projects.forEach((p) => {
    if (p.status === 'At Risk') {
      risks.push({
        id: `risk-${rIdx++}`,
        title: `${p.name}: low margin project (${p.margin}%)`,
        description: `Project ${p.name} has a margin of ${p.margin}%, significantly below the healthy threshold of 30%.`,
        severity: 'high',
        project: p.name,
      })
      recommendations.push({
        id: `rec-${recIdx++}`,
        title: `Increase billing rate or reduce costs for ${p.name}`,
        description: `Current margin is ${p.margin}%. Consider renegotiating rates or optimising resource allocation.`,
        impact: 'high',
        category: 'pricing',
      })
    } else if (p.status === 'Warning') {
      risks.push({
        id: `risk-${rIdx++}`,
        title: `${p.name}: margin approaching risk threshold (${p.margin}%)`,
        description: `Project ${p.name} margin of ${p.margin}% is below the 30% healthy benchmark.`,
        severity: 'medium',
        project: p.name,
      })
    }
  })

  employees.forEach((e) => {
    if (e.tag === 'underutilized') {
      recommendations.push({
        id: `rec-${recIdx++}`,
        title: `Reallocate ${e.name} to higher-demand projects`,
        description: `${e.name} is logging fewer hours than average. Reallocating to busy projects could improve margins.`,
        impact: 'medium',
        category: 'staffing',
      })
    }
    if (e.tag === 'overloaded') {
      risks.push({
        id: `risk-${rIdx++}`,
        title: `${e.name} may be overloaded`,
        description: `${e.name} is logging significantly more hours than the team average.`,
        severity: 'low',
        employee: e.name,
      })
    }
  })

  if (risks.length === 0) {
    risks.push({
      id: 'risk-none',
      title: 'No critical risks detected',
      description: 'All projects and employees are within healthy parameters.',
      severity: 'low',
    })
  }

  return {
    projects,
    employees,
    risks,
    recommendations,
    metrics: {
      totalRevenue: Math.round(totalRevenue),
      totalProfit: Math.round(totalProfit),
      avgMargin: parseFloat(avgMargin.toFixed(1)),
      totalHours: Math.round(totalHours),
      totalRecords: rows.length,
    },
  }
}

// ─── Class name helper ────────────────────────────────────────────────────────
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ─── File utils ───────────────────────────────────────────────────────────────
export function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    csv: '📊', xlsx: '📗', xls: '📗',
    pdf: '📄', docx: '📝', txt: '📋',
  }
  return map[ext ?? ''] ?? '📁'
}

export const ACCEPTED_FILE_TYPES =
  '.csv,.xlsx,.xls,.pdf,.docx,.txt'

export const SAMPLE_CSV = `employee,project,date,hours,billing_rate,cost_rate
Alice,Alpha,2024-01-10,8,150,80
Alice,Alpha,2024-01-17,6,150,80
Bob,Beta,2024-01-12,9,120,70
Bob,Beta,2024-01-19,8,120,70
Carol,Alpha,2024-01-15,7,150,90
Carol,Gamma,2024-01-22,8,160,90
Dave,Delta,2024-01-11,9,90,80
Dave,Gamma,2024-01-18,7,160,80
Eve,Beta,2024-01-14,5,120,85
Eve,Gamma,2024-01-21,6,160,85
Alice,Alpha,2024-02-05,8,150,80
Bob,Beta,2024-02-08,7,120,70
Carol,Gamma,2024-02-12,9,160,90
Dave,Delta,2024-02-10,9,90,80
Eve,Delta,2024-02-15,6,90,85
Carol,Alpha,2024-02-18,5,150,90
Alice,Gamma,2024-02-22,5,160,80
Bob,Gamma,2024-02-25,6,160,70
Dave,Beta,2024-03-01,2,120,80
Carol,Delta,2024-03-05,4,90,90
Alice,Beta,2024-03-10,7,120,80`
