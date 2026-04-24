import { useState } from 'react'
import { Badge } from '@/shared/components/ui/Badge'
import { CardSkeleton } from '@/shared/components/ui/Loader'
import { EmptyState, ErrorState } from '@/shared/components/ui/EmptyState'
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, ChevronDownIcon, UsersIcon } from '@/shared/components/ui/Icons'
import { formatCurrency, formatPercent } from '@/shared/utils'
import type { Project, ProjectStatus, ProjectTrend, TrendValue } from '@/shared/api/types'

// ── Status Dot ────────────────────────────────────────────────────────────────
// function StatusDot({ status }: { status?: ProjectStatus }) {
//   const color = status === 'Healthy' ? 'bg-green-500' 
//               : status === 'At Risk' ? 'bg-red-500' 
//               : status === 'Optimal' ? 'bg-amber-500'
//               : 'bg-gray-400'
//   return (
//     <span 
//       className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0 self-center`}
//       aria-label={status ?? 'unknown status'}
//     />
//   )
// }

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) return null
  if (status === 'Healthy') return <Badge variant="green">Healthy</Badge>
  if (status === 'At Risk') return <Badge variant="red">At Risk</Badge>
  return <Badge variant="amber">Optimal</Badge>
}

// ── Trend Arrow ───────────────────────────────────────────────────────────────
function TrendArrow({ value }: { value?: TrendValue }) {
  if (!value) return null
  if (value === 'Up') return <TrendingUpIcon size={12} strokeWidth={2.5} className="text-green-600" />
  if (value === 'Down') return <TrendingDownIcon size={12} strokeWidth={2.5} className="text-red-600" />
  return <MinusIcon size={12} strokeWidth={2.5} className="text-ink-tertiary" />
}

// ── Metrics Grid ──────────────────────────────────────────────────────────────
function MetricsGrid({ project, trends }: { project: Project; trends?: ProjectTrend }) {
  const metrics = [
    { label: 'Revenue', value: project.revenue != null ? formatCurrency(project.revenue) : 'N/A', trend: trends?.revenue_trend },
    { label: 'Cost', value: project.cost != null ? formatCurrency(project.cost) : 'N/A', trend: trends?.cost_trend },
    { label: 'Profit', value: project.profit != null ? formatCurrency(project.profit) : 'N/A', trend: trends?.profit_trend },
    { label: 'Gross Margin', value: project.margin != null ? formatPercent(project.margin) : 'N/A', trend: trends?.margin_trend },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {metrics.map(({ label, value, trend }) => (
        <div key={label}>
          <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">{label}</p>
          <p className="text-[14px] font-bold flex items-center gap-1.5 mt-0.5 text-ink-primary">
            {value} <TrendArrow value={trend} />
          </p>
        </div>
      ))}
    </div>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, isExpanded, onToggle }: { 
  project: Project
  isExpanded: boolean
  onToggle: () => void
}) {
  const isHealthy = project.status === 'Healthy'
  const isRisk = project.status === 'At Risk'
  
  // Status-based styling (matches badge colors)
  const borderAccent = isHealthy ? '#16A34A' : isRisk ? '#DC2626' : '#D97706'
  const cardBg = isHealthy ? 'var(--success-bg)' : isRisk ? 'var(--danger-bg)' : 'var(--warning-bg)'
  const cardBorder = isHealthy ? 'rgba(22,163,74,0.15)' : isRisk ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)'

  // Header summary values
  const revenueDisplay = project.revenue != null ? formatCurrency(project.revenue) : 'N/A'
  const marginDisplay = project.margin != null ? formatPercent(project.margin) : 'N/A'

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      aria-expanded={isExpanded}
      className="rounded-[14px] animate-fade-up transition-all duration-300 hover:shadow-md overflow-hidden cursor-pointer"
      style={{
        background: cardBg,
        boxShadow: 'var(--shadow-sm)',
        border: `1px solid ${cardBorder}`,
        borderLeft: `4px solid ${borderAccent}`,
      }}
    >
      {/* Card header - all items vertically centered */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 min-h-[48px]">
        {/* Project name */}
        <h3 className="text-[15px] sm:text-[15px] font-semibold tracking-tight text-ink-primary truncate flex-1 min-w-0 leading-[1]">
          {project.name}
        </h3>
        
        {/* Summary metrics - animated show/hide */}
        <span 
          className={[
            'text-[12px] sm:text-[13px] text-ink-secondary font-bold flex-shrink-0 hidden sm:inline-flex items-center gap-0 leading-[1]',
            'transition-all duration-300 ease-out origin-right',
            isExpanded 
              ? 'opacity-0 scale-x-0 w-0 overflow-hidden' 
              : 'opacity-100 scale-x-100',
          ].join(' ')}
        >
          {revenueDisplay}<span className="mx-2 opacity-50">·</span>{marginDisplay}
        </span>
        
        {/* Status badge */}
        <StatusBadge status={project.status} />
        
        {/* Chevron */}
        <ChevronDownIcon 
          size={18} 
          strokeWidth={2} 
          className={`text-ink-tertiary flex-shrink-0 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Expandable details */}
      <div className="collapse-content" data-open={isExpanded}>
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1">
          {/* Metrics grid */}
          <MetricsGrid project={project} trends={project.trend} />
          
          {/* Employees footer */}
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2">
            <UsersIcon size={14} className="text-ink-tertiary" />
            <span className="text-[12px] text-ink-secondary">
              {project.employees != null ? <><span className="font-semibold">{project.employees}</span> employees</> : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Status Filter ─────────────────────────────────────────────────────────────
type StatusFilter = 'all' | 'Healthy' | 'At Risk' | 'Optimal'

// Theme-aware filter styles using CSS variables (matches card backgrounds)
const STATUS_FILTER_STYLES: Record<StatusFilter, { 
  activeBg: string
  activeText: string
  activeBorder: string
  countBg: string
  countText: string
}> = {
  all: {
    activeBg: 'var(--accent-light)',
    activeText: 'var(--ink-primary)',
    activeBorder: 'var(--accent-border)',
    countBg: 'var(--accent)',
    countText: 'white',
  },
  Healthy: {
    activeBg: 'var(--success-bg)',
    activeText: 'var(--success-text)',
    activeBorder: 'var(--success-border)',
    countBg: 'var(--success-mid)',
    countText: 'white',
  },
  'At Risk': {
    activeBg: 'var(--danger-bg)',
    activeText: 'var(--danger-bold)',
    activeBorder: 'var(--danger-border)',
    countBg: 'var(--danger-mid)',
    countText: 'white',
  },
  Optimal: {
    activeBg: 'var(--warning-bg)',
    activeText: 'var(--warning-text)',
    activeBorder: 'var(--warning-border)',
    countBg: 'var(--warning-mid)',
    countText: 'white',
  },
}

const STATUS_FILTERS: StatusFilter[] = ['all', 'Healthy', 'At Risk', 'Optimal']

function StatusFilterBar({ 
  activeFilter, 
  onFilterChange,
  counts 
}: { 
  activeFilter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  counts: Record<StatusFilter, number>
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[12px] font-medium text-ink-secondary mr-1">Filter:</span>
      {STATUS_FILTERS.map((value) => {
        const isActive = activeFilter === value
        const count = counts[value]
        const styles = STATUS_FILTER_STYLES[value]
        const label = value === 'all' ? 'All' : value
        
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={[
              'px-3 py-1 rounded-full text-[12px] font-medium font-sans cursor-pointer border transition-all duration-150',
              'inline-flex items-center gap-1.5',
            ].join(' ')}
            style={isActive ? {
              backgroundColor: styles.activeBg,
              color: styles.activeText,
              borderColor: styles.activeBorder,
            } : {
              backgroundColor: 'var(--surface-base)',
              color: 'var(--ink-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            {label}
            <span 
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
              style={isActive ? {
                backgroundColor: styles.countBg,
                color: styles.countText,
              } : {
                backgroundColor: 'var(--surface-raised)',
                color: 'var(--ink-primary)',
              }}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Projects List ─────────────────────────────────────────────────────────────
export function ProjectsList({ projects, isLoading = false, isError = false, onRetry }: {
  projects?: Project[]; isLoading?: boolean; isError?: boolean; onRetry?: () => void
}) {
  // Track multiple expanded cards (all collapsed by default)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Calculate counts for each status
  const statusCounts: Record<StatusFilter, number> = {
    all: projects?.length ?? 0,
    Healthy: projects?.filter(p => p.status === 'Healthy').length ?? 0,
    'At Risk': projects?.filter(p => p.status === 'At Risk').length ?? 0,
    Optimal: projects?.filter(p => p.status !== 'Healthy' && p.status !== 'At Risk').length ?? 0,
  }

  // Filter projects based on selected status
  const filteredProjects = projects?.filter(p => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'Optimal') return p.status !== 'Healthy' && p.status !== 'At Risk'
    return p.status === statusFilter
  })

  // Check if all filtered projects are expanded
  const allExpanded = filteredProjects?.length 
    ? filteredProjects.every(p => expandedIds.has(p.id)) 
    : false

  // Toggle all filtered projects
  const toggleAll = () => {
    if (!filteredProjects?.length) return
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (allExpanded) {
        // Collapse all filtered
        filteredProjects.forEach(p => next.delete(p.id))
      } else {
        // Expand all filtered
        filteredProjects.forEach(p => next.add(p.id))
      }
      return next
    })
  }

  if (isLoading) return <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} lines={4} />)}</div>
  if (isError) return <ErrorState message="Could not load project data." onRetry={onRetry} />
  if (!projects?.length)
    return <EmptyState title="No project data" description="Upload data and click Analyze to see project analytics." />

  return (
    <div>
      {/* Filter bar with expand/collapse toggle */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <StatusFilterBar 
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          counts={statusCounts}
        />
        
        {/* Expand/Collapse All button */}
        {filteredProjects && filteredProjects.length > 0 && (
          <button
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-medium font-sans cursor-pointer border transition-all duration-150 bg-surface-base text-ink-secondary border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            <ChevronDownIcon 
              size={12} 
              strokeWidth={2.5} 
              className={`transition-transform duration-300 ${allExpanded ? 'rotate-180' : ''}`} 
            />
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        )}
      </div>
      
      {/* Projects list */}
      {filteredProjects?.length ? (
        <div className="flex flex-col gap-3">
          {filteredProjects.map(p => (
            <ProjectCard 
              key={p.id} 
              project={p}
              isExpanded={expandedIds.has(p.id)}
              onToggle={() => toggleExpand(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-ink-tertiary text-[14px]">
          No projects match the selected filter.
        </div>
      )}
    </div>
  )
}
