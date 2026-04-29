import type { RiskSeverity } from '@/shared/api/types'

type SeverityFilter = 'all' | Exclude<RiskSeverity, 'positive'>

interface SeverityCount {
  all: number
  critical: number
  high: number
  medium: number
  low: number
}

const SEVERITY_STYLES: Record<SeverityFilter, {
  activeBg: string
  activeText: string
  activeBorder: string
  dot: string
}> = {
  all: {
    activeBg: 'var(--surface-raised)',
    activeText: 'var(--ink-primary)',
    activeBorder: 'var(--border-default)',
    dot: 'var(--ink-tertiary)',
  },
  critical: {
    activeBg: 'var(--danger-bg)',
    activeText: 'var(--danger-bold)',
    activeBorder: 'var(--danger-border)',
    dot: 'var(--danger-mid)',
  },
  high: {
    activeBg: 'var(--danger-bg)',
    activeText: 'var(--danger-text)',
    activeBorder: 'var(--danger-border)',
    dot: 'var(--danger-mid)',
  },
  medium: {
    activeBg: 'var(--warning-bg)',
    activeText: 'var(--warning-text)',
    activeBorder: 'var(--warning-border)',
    dot: 'var(--warning-mid)',
  },
  low: {
    activeBg: 'var(--surface-raised)',
    activeText: 'var(--ink-secondary)',
    activeBorder: 'var(--border-default)',
    dot: 'var(--ink-tertiary)',
  },
}

const SEVERITY_LABELS: Record<SeverityFilter, string> = {
  all: 'All',
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const SEVERITY_ORDER: SeverityFilter[] = ['all', 'critical', 'high', 'medium', 'low']

interface SeverityFilterBarProps {
  activeSeverity: SeverityFilter
  onSeverityChange: (severity: SeverityFilter) => void
  counts: SeverityCount
}

export function SeverityFilterBar({
  activeSeverity,
  onSeverityChange,
  counts,
}: SeverityFilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-3">
      <span className="text-[11px] font-medium text-ink-tertiary mr-1">Severity:</span>
      {SEVERITY_ORDER.map((severity) => {
        const isActive = activeSeverity === severity
        const count = severity === 'all' ? counts.all : counts[severity]
        const styles = SEVERITY_STYLES[severity]

        if (severity !== 'all' && count === 0) return null

        return (
          <button
            key={severity}
            onClick={() => onSeverityChange(severity)}
            className={[
              'px-2.5 py-0.5 rounded-full text-[11px] font-medium font-sans cursor-pointer border transition-all duration-150',
              'inline-flex items-center gap-1.5',
            ].join(' ')}
            style={isActive ? {
              backgroundColor: styles.activeBg,
              color: styles.activeText,
              borderColor: styles.activeBorder,
            } : {
              backgroundColor: 'transparent',
              color: 'var(--ink-secondary)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {severity !== 'all' && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: styles.dot }}
              />
            )}
            {SEVERITY_LABELS[severity]}
            <span className="text-[10px] opacity-70">({count})</span>
          </button>
        )
      })}
    </div>
  )
}

export type { SeverityFilter, SeverityCount }
