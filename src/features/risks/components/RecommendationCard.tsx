import { ArrowRightIcon, UserIcon, CalendarIcon } from '@/shared/components/ui/Icons'
import { Badge } from '@/shared/components/ui/Badge'
import type { RecommendationItem, RiskPriority } from '@/shared/api/types'

const priorityCfg: Record<RiskPriority, {
  bg: string
  border: string
  text: string
  badgeVariant: 'red' | 'amber' | 'gray'
}> = {
  IMMEDIATE: {
    bg: 'var(--danger-bg)',
    border: '2px solid var(--danger-border)',
    text: 'var(--danger-text)',
    badgeVariant: 'red',
  },
  SHORT_TERM: {
    bg: 'var(--warning-bg)',
    border: '2px solid var(--warning-border)',
    text: 'var(--warning-text)',
    badgeVariant: 'amber',
  },
  LONG_TERM: {
    bg: 'var(--surface-raised)',
    border: '1px solid var(--border-default)',
    text: 'var(--ink-secondary)',
    badgeVariant: 'gray',
  },
}

function formatPriority(priority: RiskPriority): string {
  return priority.replace('_', ' ')
}

interface RecommendationCardProps {
  recommendation: RecommendationItem
  id?: string
  isHighlighted?: boolean
}

export function RecommendationCard({ recommendation, id, isHighlighted }: RecommendationCardProps) {
  const cfg = priorityCfg[recommendation.priority]

  return (
    <div
      id={id}
      className={[
        'rounded-[12px] mb-2 px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-200 hover:shadow-sm',
        isHighlighted ? 'animate-pulse-glow' : '',
      ].join(' ')}
      style={{ background: cfg.bg, border: cfg.border }}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}
        >
          <ArrowRightIcon size={12} strokeWidth={2.5} className="sm:hidden" />
          <ArrowRightIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Badge variant={cfg.badgeVariant}>
              {formatPriority(recommendation.priority)}
            </Badge>
            {recommendation.related_risk_type && (
              <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">
                {recommendation.related_risk_type.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          <p className="text-[12px] sm:text-[13px] font-medium leading-snug text-ink-primary mb-2">
            {recommendation.action}
          </p>

          <div className="flex flex-wrap gap-3 text-[11px] text-ink-secondary">
            {recommendation.owner && (
              <div className="flex items-center gap-1.5">
                <UserIcon size={12} className="text-ink-tertiary" />
                <span>{recommendation.owner}</span>
              </div>
            )}
            {recommendation.deadline && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={12} className="text-ink-tertiary" />
                <span>{recommendation.deadline}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
