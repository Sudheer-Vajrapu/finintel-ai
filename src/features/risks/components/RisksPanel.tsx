import { CardSkeleton } from '@/shared/components/ui/Loader'
import { EmptyState, ErrorState } from '@/shared/components/ui/EmptyState'
import { AlertTriangleIcon, ArrowRightIcon, CheckIcon } from '@/shared/components/ui/Icons'
import type { Risk, Recommendation, RiskSeverity } from '@/shared/api/types'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.7px] text-ink-tertiary mb-3 flex items-center gap-2">
      <span className="flex-1 h-px bg-[var(--border-default)]" />
      {children}
      <span className="flex-1 h-px bg-[var(--border-default)]" />
    </p>
  )
}

const severityCfg: Record<RiskSeverity, { bg: string; border: string; text: string; iconBg: string; iconColor: string; barColor: string }> = {
  high:   { bg:'var(--danger-bg)',  border:'2px solid var(--danger-border)',  text:'var(--danger-text)',  iconBg:'#FEE2E2', iconColor:'var(--danger-mid)',  barColor:'var(--danger-mid)'  },
  medium: { bg:'var(--warning-bg)', border:'2px solid var(--warning-border)', text:'var(--warning-text)', iconBg:'#FEF3C7', iconColor:'var(--warning-mid)', barColor:'var(--warning-mid)' },
  low:    { bg:'var(--surface-raised)', border:'1px solid var(--border-default)', text:'var(--ink-secondary)', iconBg:'var(--surface-sunken)', iconColor:'var(--ink-tertiary)', barColor:'var(--ink-tertiary)' },
}

function RiskAlert({ risk }: { risk: Risk }) {
  const isNone = risk.id === 'risk-none'

  if (isNone) return (
    <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 bg-success-bg border-2 border-success-border rounded-[12px] mb-2">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#BBF7D0] flex items-center justify-center flex-shrink-0 text-[var(--success-text)]">
        <CheckIcon size={12} strokeWidth={2.5} className="sm:hidden" />
        <CheckIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
      </div>
      <p className="text-[12px] sm:text-[13px] font-semibold text-[var(--success-text)]">{risk.title}</p>
    </div>
  )

  const cfg = severityCfg[risk.severity]
  return (
    <div
      className="flex items-start gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-[12px] mb-2 relative overflow-hidden"
      style={{ background: cfg.bg, border: cfg.border }}
    >
      {/* Severity bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: cfg.barColor }} />
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.iconBg, color: cfg.iconColor }}>
        <AlertTriangleIcon size={12} strokeWidth={2.5} className="sm:hidden" />
        <AlertTriangleIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] sm:text-[13px] font-bold leading-tight" style={{ color: cfg.text }}>{risk.title}</p>
        {risk.description && (
          <p className="text-[11px] sm:text-[12px] text-ink-secondary mt-1 leading-relaxed">{risk.description}</p>
        )}
      </div>
    </div>
  )
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div
      className="flex items-start gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-[12px] mb-2 cursor-default transition-all hover:shadow-sm"
      style={{ background: 'var(--info-bg)', border: '2px solid var(--info-border)' }}
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: '#DBEAFE', color: 'var(--info-text)' }}>
        <ArrowRightIcon size={12} strokeWidth={2.5} className="sm:hidden" />
        <ArrowRightIcon size={14} strokeWidth={2.5} className="hidden sm:block" />
      </div>
      <div className="flex-1">
        <p className="text-[12px] sm:text-[13px] font-bold text-[var(--info-text)] leading-tight">{rec.title}</p>
        {rec.description && (
          <p className="text-[11px] sm:text-[12px] text-ink-secondary mt-1 leading-relaxed">{rec.description}</p>
        )}
      </div>
    </div>
  )
}

export function RisksPanel({ risks, recommendations, isLoading = false, isError = false, onRetry }: {
  risks?: Risk[]; recommendations?: Recommendation[]; isLoading?: boolean; isError?: boolean; onRetry?: () => void
}) {
  if (isLoading) return (
    <div>
      <div className="skeleton h-3 w-28 mb-4 rounded" />
      {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}
    </div>
  )
  if (isError)  return <ErrorState message="Could not load risk data." onRetry={onRetry} />
  if (!risks?.length) return <EmptyState title="No risk data" description="Upload and analyze data to detect risks and get recommendations." />

  return (
    <div>
      <SectionLabel>Risks detected</SectionLabel>
      <div className="mb-6">{risks.map(r => <RiskAlert key={r.id} risk={r} />)}</div>

      {recommendations && recommendations.length > 0 && (
        <>
          <SectionLabel>Recommendations</SectionLabel>
          {recommendations.map(r => <RecommendationCard key={r.id} rec={r} />)}
        </>
      )}
    </div>
  )
}
