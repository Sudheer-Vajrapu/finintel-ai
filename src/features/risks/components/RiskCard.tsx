import { useState } from 'react'
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon } from '@/shared/components/ui/Icons'
import { Badge } from '@/shared/components/ui/Badge'
import type { RiskItem, RiskSeverity } from '@/shared/api/types'
import { formatCurrency, formatPercent } from '@/shared/utils'

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
  onViewScorecard?: (employeeName: string) => void
  onViewRecommendation?: (riskType: string) => void
}

export function RiskCard({ risk, defaultExpanded = false, onViewScorecard, onViewRecommendation }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
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
        className={[
          'transition-all duration-300 ease-out overflow-hidden',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 ml-8 sm:ml-10 border-t border-[var(--border-subtle)] mt-2 pt-3">
          {risk.metrics && Object.keys(risk.metrics).length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">
                Metrics
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {risk.metrics.avg_margin_pct !== undefined && (
                  <MetricPill label="Margin" value={formatPercent(risk.metrics.avg_margin_pct)} />
                )}
                {risk.metrics.target_margin !== undefined && (
                  <MetricPill label="Target" value={formatPercent(risk.metrics.target_margin)} />
                )}
                {risk.metrics.billing_rate !== undefined && (
                  <MetricPill label="Billing" value={formatCurrency(risk.metrics.billing_rate) + '/h'} />
                )}
                {risk.metrics.cost_rate !== undefined && (
                  <MetricPill label="Cost" value={formatCurrency(risk.metrics.cost_rate) + '/h'} />
                )}
                {risk.metrics.buffer_pct !== undefined && (
                  <MetricPill label="Buffer" value={formatPercent(risk.metrics.buffer_pct)} />
                )}
                {risk.metrics.avg_utilisation_pct !== undefined && (
                  <MetricPill label="Utilisation" value={formatPercent(risk.metrics.avg_utilisation_pct)} />
                )}
                {risk.metrics.total_profit !== undefined && (
                  <MetricPill label="Profit" value={formatCurrency(risk.metrics.total_profit)} />
                )}
                {risk.metrics.performance_score !== undefined && (
                  <MetricPill label="Score" value={`${risk.metrics.performance_score}/100`} />
                )}
              </div>
            </div>
          )}

          {risk.linked_employees && risk.linked_employees.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-ink-tertiary">Linked:</span>
              {risk.linked_employees.map((emp) => (
                <span
                  key={emp}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-surface-sunken text-ink-secondary"
                >
                  {emp}
                </span>
              ))}
            </div>
          )}

          {/* View Links */}
          {(onViewScorecard || onViewRecommendation) && (
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-4">
              {onViewScorecard && risk.linked_employees && risk.linked_employees.length > 0 && (
                <button
                  type="button"
                  onClick={() => onViewScorecard(risk.linked_employees[0])}
                  className="text-[11px] font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                >
                  View Scorecard →
                </button>
              )}
              {onViewRecommendation && risk.recommendation && (
                <button
                  type="button"
                  onClick={() => onViewRecommendation(risk.type)}
                  className="text-[11px] font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                >
                  View Recommendation →
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
