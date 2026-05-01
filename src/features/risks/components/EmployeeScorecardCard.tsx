import { useState, useEffect } from 'react'
import { ChevronDownIcon, BriefcaseIcon } from '@/shared/components/ui/Icons'
import { Badge } from '@/shared/components/ui/Badge'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import type { EmployeeScorecard, PerformanceBand } from '@/shared/api/types'
import { formatCurrency, formatPercent } from '@/shared/utils'

const bandCfg: Record<PerformanceBand, {
  bg: string
  border: string
  text: string
  badgeVariant: 'green' | 'blue' | 'amber'
  progressVariant: 'green' | 'blue' | 'amber'
}> = {
  Star: {
    bg: 'var(--success-bg)',
    border: '2px solid var(--success-border)',
    text: 'var(--success-text)',
    badgeVariant: 'green',
    progressVariant: 'green',
  },
  Solid: {
    bg: 'var(--info-bg)',
    border: '2px solid var(--info-border)',
    text: 'var(--info-text)',
    badgeVariant: 'blue',
    progressVariant: 'blue',
  },
  Watch: {
    bg: 'var(--warning-bg)',
    border: '2px solid var(--warning-border)',
    text: 'var(--warning-text)',
    badgeVariant: 'amber',
    progressVariant: 'amber',
  },
}

interface EmployeeScorecardCardProps {
  scorecard: EmployeeScorecard
  defaultExpanded?: boolean
  resetKey?: number
  id?: string
  isHighlighted?: boolean
}

export function EmployeeScorecardCard({ scorecard, defaultExpanded = false, resetKey, id, isHighlighted }: EmployeeScorecardCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Collapse when resetKey changes (section collapsed)
  useEffect(() => {
    if (resetKey !== undefined) {
      setIsExpanded(false)
    }
  }, [resetKey])
  const band = scorecard.performance.band
  const cfg = bandCfg[band]
  const score = scorecard.performance.score

  return (
    <div
      id={id}
      className={[
        'rounded-[12px] mb-2 overflow-hidden transition-all duration-200 hover:shadow-sm',
        isHighlighted ? 'animate-pulse-glow' : '',
      ].join(' ')}
      style={{ background: cfg.bg, border: cfg.border }}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.text, color: 'white' }}
          >
            <span className="text-[12px] font-bold">
              {scorecard.employee.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[13px] font-semibold text-ink-primary truncate">
                {scorecard.employee}
              </span>
              <Badge variant={cfg.badgeVariant}>{band}</Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-ink-secondary">
              <BriefcaseIcon size={11} className="text-ink-tertiary" />
              <span>{scorecard.project}</span>
              <span className="text-ink-tertiary">·</span>
              <span>{scorecard.latest_month}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[18px] font-bold" style={{ color: cfg.text }}>
                {score.toFixed(1)}
              </p>
              <p className="text-[10px] text-ink-tertiary">/ 100</p>
            </div>
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
      </button>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: isExpanded ? 400 : 0,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'max-height, opacity, transform',
        }}
      >
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-[var(--border-subtle)] mt-1 pt-3">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <ScoreBreakdown
              label="Margin"
              score={scorecard.performance.breakdown.margin_score}
              value={formatPercent(scorecard.performance.inputs.margin_pct)}
              variant={cfg.progressVariant}
            />
            <ScoreBreakdown
              label="Utilisation"
              score={scorecard.performance.breakdown.utilisation_score}
              value={formatPercent(scorecard.performance.inputs.utilisation_pct)}
              variant={cfg.progressVariant}
            />
            <ScoreBreakdown
              label="Attendance"
              score={scorecard.performance.breakdown.attendance_score}
              value={formatPercent(100 - scorecard.performance.inputs.leave_pct)}
              variant={cfg.progressVariant}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <MetricBox label="Revenue" value={formatCurrency(scorecard.total_revenue)} />
            <MetricBox label="Profit" value={formatCurrency(scorecard.total_profit)} />
            <MetricBox label="Utilisation" value={formatPercent(scorecard.avg_utilisation)} />
            <MetricBox label="Months" value={`${scorecard.months_covered}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreBreakdown({ label, score, value, variant }: {
  label: string
  score: number
  value: string
  variant: 'green' | 'blue' | 'amber'
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-ink-tertiary">{label}</span>
        <span className="text-[11px] font-semibold text-ink-primary">{score.toFixed(0)}</span>
      </div>
      <ProgressBar value={score} variant={variant} height={4} />
      <p className="text-[10px] text-ink-secondary mt-0.5">{value}</p>
    </div>
  )
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5 rounded-md bg-surface-sunken">
      <p className="text-[10px] text-ink-tertiary">{label}</p>
      <p className="text-[12px] font-semibold text-ink-primary">{value}</p>
    </div>
  )
}
