import { useState, useEffect } from 'react'
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon } from '@/shared/components/ui/Icons'
import { Badge } from '@/shared/components/ui/Badge'
import type { RiskItem, RiskSeverity, RiskMetrics } from '@/shared/api/types'
import { formatCurrency, formatPercent } from '@/shared/utils'

// Metric display configuration
interface MetricConfig {
  label: string
  format: (value: unknown) => string
}

const metricConfigs: Record<string, MetricConfig> = {
  // Financial metrics
  total_revenue: { label: 'Revenue', format: (v) => formatCurrency(v as number) },
  total_cost: { label: 'Cost', format: (v) => formatCurrency(v as number) },
  total_profit: { label: 'Profit', format: (v) => formatCurrency(v as number) },
  revenue: { label: 'Revenue', format: (v) => formatCurrency(v as number) },
  cost: { label: 'Cost', format: (v) => formatCurrency(v as number) },
  profit: { label: 'Profit', format: (v) => formatCurrency(v as number) },
  avg_margin_pct: { label: 'Margin', format: (v) => formatPercent(v as number) },
  margin_pct: { label: 'Margin', format: (v) => formatPercent(v as number) },
  target_margin: { label: 'Target', format: (v) => formatPercent(v as number) },
  gap_pct: { label: 'Gap', format: (v) => formatPercent(v as number) },
  billing_rate: { label: 'Billing Rate', format: (v) => formatCurrency(v as number) + '/h' },
  cost_rate: { label: 'Cost Rate', format: (v) => formatCurrency(v as number) + '/h' },
  rate_ratio: { label: 'Rate Ratio', format: (v) => `${(v as number).toFixed(2)}x` },
  buffer_pct: { label: 'Buffer', format: (v) => formatPercent(v as number) },
  profit_recovery: { label: 'Recovery', format: (v) => formatCurrency(v as number) },
  employees: { label: 'Employees', format: (v) => String(v) },
  
  // Workforce metrics
  consecutive_overload_months: { label: 'Overload Months', format: (v) => String(v) },
  avg_utilisation_pct: { label: 'Utilisation', format: (v) => formatPercent(v as number) },
  leave_pct_latest: { label: 'Leave %', format: (v) => formatPercent(v as number) },
  billable_drop_pct: { label: 'Billable Drop', format: (v) => formatPercent(v as number) },
  latest_month: { label: 'Month', format: (v) => String(v) },
  estimated_replacement_cost: { label: 'Replacement Cost', format: (v) => formatCurrency(v as number) },
  total_drop_pct: { label: 'Total Drop', format: (v) => formatPercent(v as number) },
  leave_days: { label: 'Leave Days', format: (v) => String(v) },
  working_days: { label: 'Working Days', format: (v) => String(v) },
  leave_pct: { label: 'Leave %', format: (v) => formatPercent(v as number) },
  month: { label: 'Month', format: (v) => String(v) },
  estimated_revenue_impact: { label: 'Revenue Impact', format: (v) => formatCurrency(v as number) },
  months_on_record: { label: 'Months', format: (v) => String(v) },
  target_pct: { label: 'Target', format: (v) => formatPercent(v as number) },
  
  // Operational metrics
  hours_gap: { label: 'Hours Gap', format: (v) => `${(v as number).toFixed(1)}h` },
  estimated_rev_gap: { label: 'Revenue Gap', format: (v) => formatCurrency(v as number) },
  consecutive_bench_months: { label: 'Bench Months', format: (v) => String(v) },
  bench_cost: { label: 'Bench Cost', format: (v) => formatCurrency(v as number) },
  consecutive_ceiling_months: { label: 'Ceiling Months', format: (v) => String(v) },
  approved_hours_per_month: { label: 'Approved Hours', format: (v) => `${v}h/mo` },
  months_covered: { label: 'Months', format: (v) => String(v) },
  
  // Project & Trend metrics
  drop_pct: { label: 'Drop', format: (v) => formatPercent(v as number) },
  employee_count: { label: 'Employees', format: (v) => String(v) },
  cost_growth_pct: { label: 'Cost Growth', format: (v) => formatPercent(v as number) },
  
  // Legacy
  performance_score: { label: 'Score', format: (v) => `${v}/100` },
}

// Keys to skip (arrays, objects, or handled separately)
const skipKeys = new Set(['months', 'util_series', 'margin_series', 'cost_series', 'missing_fields', 'performance_band'])

function renderMetrics(metrics: RiskMetrics): JSX.Element[] {
  const elements: JSX.Element[] = []
  
  // Handle missing_fields specially
  if (metrics.missing_fields && metrics.missing_fields.length > 0) {
    elements.push(
      <MetricPill 
        key="missing_fields" 
        label="Missing" 
        value={metrics.missing_fields.join(', ')} 
      />
    )
  }
  
  // Handle series data (show trend indicator)
  if (metrics.months && metrics.months.length > 0) {
    elements.push(
      <MetricPill 
        key="period" 
        label="Period" 
        value={`${metrics.months[0]} → ${metrics.months[metrics.months.length - 1]}`} 
      />
    )
  }
  
  // Render all other metrics dynamically
  for (const [key, value] of Object.entries(metrics)) {
    if (skipKeys.has(key) || value === undefined || value === null) continue
    
    const config = metricConfigs[key]
    if (config && typeof value !== 'object') {
      elements.push(
        <MetricPill 
          key={key} 
          label={config.label} 
          value={config.format(value)} 
        />
      )
    }
  }
  
  return elements
}

const severityCfg: Record<RiskSeverity, {
  bg: string
  border: string
  text: string
  iconBg: string
  iconColor: string
  barColor: string
  badgeVariant: 'red' | 'amber' | 'gray' | 'green'
}> = {
  critical: {
    bg: 'var(--danger-bg)',
    border: '2px solid var(--danger-border)',
    text: 'var(--danger-bold)',
    iconBg: '#FEE2E2',
    iconColor: 'var(--danger-mid)',
    barColor: 'var(--danger-mid)',
    badgeVariant: 'red',
  },
  high: {
    bg: 'var(--danger-bg)',
    border: '2px solid var(--danger-border)',
    text: 'var(--danger-text)',
    iconBg: '#FEE2E2',
    iconColor: 'var(--danger-mid)',
    barColor: 'var(--danger-mid)',
    badgeVariant: 'red',
  },
  medium: {
    bg: 'var(--warning-bg)',
    border: '2px solid var(--warning-border)',
    text: 'var(--warning-text)',
    iconBg: '#FEF3C7',
    iconColor: 'var(--warning-mid)',
    barColor: 'var(--warning-mid)',
    badgeVariant: 'amber',
  },
  low: {
    bg: 'var(--surface-raised)',
    border: '1px solid var(--border-default)',
    text: 'var(--ink-secondary)',
    iconBg: 'var(--surface-sunken)',
    iconColor: 'var(--ink-tertiary)',
    barColor: 'var(--ink-tertiary)',
    badgeVariant: 'gray',
  },
  positive: {
    bg: 'var(--success-bg)',
    border: '2px solid var(--success-border)',
    text: 'var(--success-text)',
    iconBg: '#BBF7D0',
    iconColor: 'var(--success-mid)',
    barColor: 'var(--success-mid)',
    badgeVariant: 'green',
  },
}

function formatRiskType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

interface RiskCardProps {
  risk: RiskItem
  defaultExpanded?: boolean
  resetKey?: number
  onViewScorecard?: (employeeName: string) => void
  onViewRecommendation?: (riskType: string) => void
}

export function RiskCard({ risk, defaultExpanded = false, resetKey, onViewScorecard, onViewRecommendation }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Collapse when resetKey changes (section collapsed)
  useEffect(() => {
    if (resetKey !== undefined) {
      setIsExpanded(false)
    }
  }, [resetKey])
  const cfg = severityCfg[risk.severity]
  const isPositive = risk.severity === 'positive'

  return (
    <div
      className="rounded-[12px] mb-2 relative overflow-hidden transition-all duration-200 hover:shadow-sm"
      style={{ background: cfg.bg, border: cfg.border }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: cfg.barColor }} />

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer"
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: cfg.iconBg, color: cfg.iconColor }}
          >
            {isPositive ? (
              <>
                <CheckIcon size={12} strokeWidth={2.5} className="sm:hidden" />
                <CheckIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
              </>
            ) : (
              <>
                <AlertTriangleIcon size={12} strokeWidth={2.5} className="sm:hidden" />
                <AlertTriangleIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">
                  {formatRiskType(risk.type)}
                </span>
                <span className="text-ink-tertiary">·</span>
                <span className="text-[12px] font-medium text-ink-secondary">{risk.entity}</span>
                {risk.project && (
                  <>
                    <span className="text-ink-tertiary">·</span>
                    <span className="text-[11px] text-ink-tertiary">{risk.project}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={cfg.badgeVariant}>
                  {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                </Badge>
                <ChevronDownIcon
                  size={14}
                  strokeWidth={2}
                  className={[
                    'text-ink-tertiary transition-transform duration-200',
                    isExpanded ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </div>
            </div>

            <p className="text-[12px] sm:text-[13px] font-medium leading-snug" style={{ color: cfg.text }}>
              {risk.description}
            </p>
          </div>
        </div>
      </button>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: isExpanded ? 500 : 0,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'max-height, opacity, transform',
        }}
      >
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 ml-8 sm:ml-10 border-t border-[var(--border-subtle)] mt-2 pt-3">
          {risk.metrics && Object.keys(risk.metrics).length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">
                Metrics
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {renderMetrics(risk.metrics)}
              </div>
            </div>
          )}

          {/* View Links */}
          {(onViewScorecard || onViewRecommendation) && (
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-3">
              {onViewScorecard && risk.linked_employees && risk.linked_employees.length > 0 && (
                <button
                  type="button"
                  onClick={() => onViewScorecard(risk.linked_employees[0])}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-150"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  View Scorecard
                </button>
              )}
              {onViewRecommendation && risk.recommendation && (
                <button
                  type="button"
                  onClick={() => onViewRecommendation(risk.type)}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-150"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  View Recommendation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1 rounded-md bg-surface-sunken">
      <p className="text-[10px] text-ink-tertiary">{label}</p>
      <p className="text-[12px] font-semibold text-ink-primary">{value}</p>
    </div>
  )
}
