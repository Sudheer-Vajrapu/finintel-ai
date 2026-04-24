import { useState } from 'react'
import { Badge } from '@/shared/components/ui/Badge'
import { CardSkeleton } from '@/shared/components/ui/Loader'
import { EmptyState, ErrorState } from '@/shared/components/ui/EmptyState'
import { ChevronDownIcon } from '@/shared/components/ui/Icons'
import { formatCurrency } from '@/shared/utils'
import type { Employee, EmployeeTag } from '@/shared/api/types'

const AVATARS = [
  { bg: '#EEF2FF', color: '#3730A3', ring: '#C7D2FE' },
  { bg: '#F0FDF4', color: '#14532D', ring: '#BBF7D0' },
  { bg: '#FFF7ED', color: '#9A3412', ring: '#FED7AA' },
  { bg: '#EFF6FF', color: '#1E3A8A', ring: '#BFDBFE' },
  { bg: '#FDF4FF', color: '#6B21A8', ring: '#E9D5FF' },
  { bg: '#F0FDFA', color: '#134E4A', ring: '#99F6E4' },
]

/*
 * Tag config — badge variant + optional icon for attention states.
 * "Underutilized" gets amber + warning icon per spec (req #6).
 */
const tagConfig: Record<EmployeeTag, {
  label: string
  variant: 'green' | 'red' | 'amber' | 'blue' | 'indigo' | 'gray'
  icon?: React.ReactNode
}> = {
  optimal:          { label: 'Optimal',          variant: 'indigo' },
  high_contributor: { label: 'High contributor', variant: 'green'  },
  underutilized: {
    label: 'Underutilized',
    variant: 'amber',
    // Warning icon baked into the badge so it can't be missed
    icon: (
      <svg
        width="10" height="10" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9"  x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  overloaded: { label: 'Overloaded', variant: 'red' },
}

function Avatar({ name, index }: { name: string; index: number }) {
  const c = AVATARS[index % AVATARS.length]
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
      style={{
        background: c.bg,
        color: c.color,
        boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${c.ring}`,
      }}
      aria-label={name}
    >
      {name[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function UtilizationBar({ tag, hours, avgHours }: { tag: EmployeeTag; hours: number; avgHours: number }) {
  const pct = Math.min(150, (hours / Math.max(avgHours, 1)) * 100)
  const color =
    tag === 'overloaded'    ? 'var(--danger-mid)'  :
    tag === 'underutilized' ? 'var(--warning-mid)' :
    tag === 'high_contributor' ? 'var(--success-mid)' :
    'var(--accent)'

  return (
    <div className="mt-2">
      <div className="h-1 bg-surface-sunken rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, pct)}%`, background: color }}
        />
      </div>
    </div>
  )
}

function EmployeeCard({ employee, index, avgHours, isExpanded, onToggle }: { 
  employee: Employee
  index: number
  avgHours: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const { tag } = employee
  const primary = tagConfig[tag]
  const showOptimal = tag === 'high_contributor'

  // Underutilized gets a more emphatic left-border treatment
  const leftBorder = tag === 'underutilized'
    ? '3px solid var(--warning-mid)'
    : tag === 'overloaded'
    ? '3px solid var(--danger-mid)'
    : '3px solid transparent'

  return (
    <div
      className="bg-surface-base rounded-[14px] mb-2 sm:mb-3 animate-fade-up transition-shadow hover:shadow-md overflow-hidden"
      style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', borderLeft: leftBorder }}
    >
      {/* Mobile: Collapsed header (tappable) - shows ONLY essential info */}
      <button
        onClick={onToggle}
        className="sm:hidden w-full text-left px-3 py-2.5 flex items-center gap-2"
        aria-expanded={isExpanded}
      >
        <Avatar name={employee.name} index={index} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-ink-primary tracking-tight leading-tight truncate">
            {employee.name}
          </p>
          <p className="text-[12px] font-semibold text-[var(--success-bold)] mt-0.5">
            {formatCurrency(employee.profit)}
          </p>
        </div>
        <Badge variant={primary.variant} dot={!primary.icon}>
          {primary.label}
        </Badge>
        <ChevronDownIcon 
          size={16} 
          strokeWidth={2} 
          className={`text-ink-tertiary flex-shrink-0 transition-all duration-300 ease-out ${isExpanded ? 'rotate-180 text-ink-secondary' : ''}`} 
        />
      </button>

      {/* Mobile: Expandable details - ALL secondary content here */}
      <div className="sm:hidden collapse-content" data-open={isExpanded}>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[12px] font-semibold text-ink-secondary">
              {employee.hours}h logged
            </span>
            {showOptimal && <Badge variant="indigo" dot={false}>Optimal</Badge>}
          </div>
          {employee.projects.length > 0 && (
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {employee.projects.map(p => (
                <span key={p} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-surface-raised rounded-full text-ink-tertiary border border-[var(--border-default)]">
                  {p}
                </span>
              ))}
            </div>
          )}
          <UtilizationBar tag={tag} hours={employee.hours} avgHours={avgHours} />
        </div>
      </div>

      {/* Desktop: Full card (always visible) */}
      <div className="hidden sm:flex items-center gap-4 p-4">
        <Avatar name={employee.name} index={index} />

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-ink-primary tracking-tight leading-tight">
            {employee.name}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[12px] font-semibold text-ink-secondary">
              {employee.hours}h logged
            </span>
            <span className="text-ink-tertiary text-[11px]">·</span>
            <span className="text-[12px] font-semibold text-[var(--success-bold)]">
              {formatCurrency(employee.profit)} profit
            </span>
          </div>
          {employee.projects.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {employee.projects.map(p => (
                <span key={p} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-surface-raised rounded-full text-ink-tertiary border border-[var(--border-default)]">
                  {p}
                </span>
              ))}
            </div>
          )}
          <UtilizationBar tag={tag} hours={employee.hours} avgHours={avgHours} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0 ml-2">
          {showOptimal && <Badge variant="indigo" dot={false}>Optimal</Badge>}
          <Badge variant={primary.variant} icon={primary.icon} dot={!primary.icon}>
            {primary.label}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export function EmployeesList({ employees, isLoading = false, isError = false, onRetry }: {
  employees?: Employee[]; isLoading?: boolean; isError?: boolean; onRetry?: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) return <div>{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}</div>
  if (isError)   return <ErrorState message="Could not load employee data." onRetry={onRetry} />
  if (!employees?.length)
    return <EmptyState title="No employee data" description="Upload data with employee records to see utilization analytics." />

  const avgHours = employees.reduce((s, e) => s + e.hours, 0) / Math.max(employees.length, 1)

  return (
    <div>
      {employees.map((e, i) => (
        <EmployeeCard 
          key={e.id} 
          employee={e} 
          index={i} 
          avgHours={avgHours}
          isExpanded={expandedId === e.id}
          onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
        />
      ))}
    </div>
  )
}
