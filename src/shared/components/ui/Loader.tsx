import React from 'react'

interface LoaderProps { size?: 'sm' | 'md' | 'lg'; className?: string }
const sizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-8 w-8' }

export function Loader({ size = 'md', className = '' }: LoaderProps) {
  return (
    <svg
      className={['animate-spin text-accent', sizeMap[size], className].join(' ')}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function Skeleton({ className = '', height, width, rounded = 'md' }: {
  className?: string; height?: string | number; width?: string | number; rounded?: 'sm' | 'md' | 'full'
}) {
  const r = { sm: 'rounded', md: 'rounded-lg', full: 'rounded-full' }[rounded]
  return <div className={['skeleton', r, className].join(' ')} style={{ height, width }} />
}

export function MetricSkeleton() {
  return (
    <div className="bg-surface-base rounded-[14px] p-4 overflow-hidden relative" style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px] skeleton" />
      <div className="pl-2 space-y-2.5">
        <Skeleton height={10} width="50%" />
        <Skeleton height={26} width="70%" />
      </div>
    </div>
  )
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-surface-base rounded-[14px] p-4 mb-3 space-y-3" style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex justify-between items-start">
        <div className="space-y-2"><Skeleton height={16} width={140} /><Skeleton height={12} width={190} /></div>
        <Skeleton height={24} width={70} rounded="full" />
      </div>
      {Array.from({ length: lines - 1 }).map((_, i) => <Skeleton key={i} height={10} width={`${60 + i * 13}%`} />)}
    </div>
  )
}

export function FullPageLoader() {
  return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" /></div>
}

export function InlineLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-12 text-ink-secondary text-sm font-medium">
      <Loader size="sm" /><span>{label}</span>
    </div>
  )
}

const ANALYSIS_STEPS = [
  'Reading file data…',
  'Parsing rows…',
  'Calculating revenue…',
  'Computing margins…',
  'Analyzing trends…',
  'Generating insights…',
]

export function AnalysisLoader() {
  const [stepIndex, setStepIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % ANALYSIS_STEPS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader size="lg" />
      <p className="text-[14px] font-medium text-ink-secondary animate-pulse">
        {ANALYSIS_STEPS[stepIndex]}
      </p>
    </div>
  )
}

// ─── Risks & Recommendations Skeletons ───────────────────────────────────────

export function RiskOverviewSkeleton() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Skeleton height={16} width={80} />
      <Skeleton height={16} width={4} rounded="full" />
      <Skeleton height={16} width={120} />
      <div className="flex gap-1 ml-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={8} width={8} rounded="full" />
        ))}
      </div>
    </div>
  )
}

export function RiskCategoryTabsSkeleton() {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={28} width={i === 0 ? 50 : 90} rounded="full" />
      ))}
    </div>
  )
}

export function RiskCardSkeleton() {
  return (
    <div 
      className="rounded-[12px] p-4 mb-2 relative overflow-hidden"
      style={{ background: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 skeleton" />
      <div className="flex items-start gap-3">
        <Skeleton height={28} width={28} rounded="md" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton height={14} width="60%" />
            <Skeleton height={20} width={60} rounded="full" />
          </div>
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="70%" />
        </div>
      </div>
    </div>
  )
}

export function RecommendationCardSkeleton() {
  return (
    <div 
      className="rounded-[12px] p-4 mb-2"
      style={{ background: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-start gap-3">
        <Skeleton height={24} width={80} rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} width="85%" />
          <div className="flex items-center gap-4">
            <Skeleton height={12} width={120} />
            <Skeleton height={12} width={100} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CollapsibleSectionSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div 
      className="rounded-[14px] mb-4 overflow-hidden"
      style={{ background: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton height={16} width={16} rounded="sm" />
          <Skeleton height={16} width={100} />
          <Skeleton height={16} width={4} rounded="full" />
          <Skeleton height={16} width={60} />
        </div>
        <Skeleton height={16} width={16} rounded="sm" />
      </div>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <RiskCardSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export function RisksPanelSkeleton() {
  return (
    <div>
      <RiskOverviewSkeleton />
      <CollapsibleSectionSkeleton />
      <CollapsibleSectionSkeleton />
      <CollapsibleSectionSkeleton collapsed />
    </div>
  )
}
