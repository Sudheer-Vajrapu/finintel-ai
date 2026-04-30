import { useState, useMemo, useRef, useEffect } from 'react'
import { Badge } from '@/shared/components/ui/Badge'
import { CardSkeleton } from '@/shared/components/ui/Loader'
import { EmptyState, ErrorState } from '@/shared/components/ui/EmptyState'
import { ChevronDownIcon, XIcon } from '@/shared/components/ui/Icons'
import { formatCurrency, formatPercent } from '@/shared/utils'
import type { Employee, EmployeeTag, Project } from '@/shared/api/types'

// ── Avatar Colors ────────────────────────────────────────────────────────────
const AVATARS = [
  { bg: '#EEF2FF', color: '#3730A3' },
  { bg: '#F0FDF4', color: '#14532D' },
  { bg: '#FFF7ED', color: '#9A3412' },
  { bg: '#EFF6FF', color: '#1E3A8A' },
  { bg: '#FDF4FF', color: '#6B21A8' },
  { bg: '#F0FDFA', color: '#134E4A' },
]

// ── Tag Config ───────────────────────────────────────────────────────────────
const tagConfig: Record<EmployeeTag, {
  label: string
  variant: 'green' | 'red' | 'amber' | 'blue' | 'indigo' | 'gray'
}> = {
  optimal:          { label: 'Optimal',     variant: 'amber' },
  high_contributor: { label: 'High',        variant: 'green'  },
  underutilized:    { label: 'Low',         variant: 'red'  },
  overloaded:       { label: 'Overloaded',  variant: 'red'    },
}

// ── Status Filter Types ──────────────────────────────────────────────────────
type StatusFilter = 'all' | 'high_contributor' | 'optimal' | 'underutilized'

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
  high_contributor: {
    activeBg: 'var(--success-bg)',
    activeText: 'var(--success-text)',
    activeBorder: 'var(--success-border)',
    countBg: 'var(--success-mid)',
    countText: 'white',
  },
  optimal: {
    activeBg: 'var(--warning-bg)',
    activeText: 'var(--warning-text)',
    activeBorder: 'var(--warning-border)',
    countBg: 'var(--warning-mid)',
    countText: 'white',
  },
  underutilized: {
    activeBg: 'var(--danger-bg)',
    activeText: 'var(--danger-bold)',
    activeBorder: 'var(--danger-border)',
    countBg: 'var(--danger-mid)',
    countText: 'white',
  },
}

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high_contributor', label: 'High' },
  { value: 'optimal', label: 'Optimal' },
  { value: 'underutilized', label: 'Low' },
]

// ── Avatar Component ─────────────────────────────────────────────────────────
function Avatar({ name, index }: { name: string; index: number }) {
  const c = AVATARS[index % AVATARS.length]
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
      style={{ background: c.bg, color: c.color }}
      aria-hidden="true"
    >
      {name[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

// ── Metrics Grid ─────────────────────────────────────────────────────────────
function MetricsGrid({ employee }: { employee: Employee }) {
  const metrics = [
    { label: 'Total Revenue', value: employee.revenue != null ? formatCurrency(employee.revenue) : 'N/A' },
    { label: 'Total Profit', value: employee.profit != null ? formatCurrency(employee.profit) : 'N/A' },
    { label: 'Total Cost', value: employee.cost != null ? formatCurrency(employee.cost) : 'N/A' },
    { label: 'Gross Margin', value: employee.grossMarginPct != null ? formatPercent(employee.grossMarginPct) : 'N/A' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">{label}</p>
          <p className="text-[14px] font-bold text-ink-primary mt-0.5">{value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Project Section with Hours & Utilization ─────────────────────────────────
function ProjectSection({ employee }: { employee: Employee }) {
  const projects = employee.projects
  const hoursDisplay = employee.hours != null ? `${employee.hours}h` : 'N/A'
  const utilDisplay = employee.utilizationPct != null ? formatPercent(employee.utilizationPct) : 'N/A'
  
  return (
    <div className="flex items-start justify-between gap-4 mt-3 pt-3 border-t border-[var(--border-subtle)]">
      {/* Left: Project badges */}
      <div className="flex-1 min-w-0">
        {projects && projects.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap items-center">
            <span className="text-[11px] font-medium text-ink-tertiary mr-1">Projects:</span>
            {projects.map((p) => (
              <span 
                key={p.project_name} 
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-surface-raised rounded-full text-ink-secondary border border-[var(--border-default)]"
              >
                {p.project_name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-ink-tertiary">No projects assigned</span>
        )}
      </div>
      
      {/* Right: Hours & Utilization */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">Hours</p>
          <p className="text-[13px] font-bold text-ink-primary">{hoursDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wide">Utilization</p>
          <p className="text-[13px] font-bold text-ink-primary">{utilDisplay}</p>
        </div>
      </div>
    </div>
  )
}

// ── Status Filter Bar ────────────────────────────────────────────────────────
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
    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter employees by contribution status">
      <span className="text-[12px] font-medium text-ink-secondary mr-1">Filter:</span>
      {STATUS_FILTERS.map(({ value, label }) => {
        const isActive = activeFilter === value
        const count = counts[value]
        const styles = STATUS_FILTER_STYLES[value]
        
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            aria-pressed={isActive}
            className={[
              'px-3 py-1 rounded-full text-[12px] font-medium font-sans cursor-pointer border transition-all duration-150',
              'inline-flex items-center gap-1.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
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

// ── Project Filter Dropdown ──────────────────────────────────────────────────
function ProjectFilterDropdown({
  projects,
  selectedProject,
  onProjectChange,
}: {
  projects: Project[]
  selectedProject: string | null
  onProjectChange: (project: string | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (projectName: string | null) => {
    onProjectChange(projectName)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-medium text-ink-tertiary">Filter by project:</span>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium',
            'border transition-all duration-150 cursor-pointer',
            selectedProject
              ? 'bg-accent/10 text-accent border-accent/30 dark:bg-accent/20 dark:border-accent/40'
              : 'bg-surface-base text-ink-secondary border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary',
          ].join(' ')}
        >
          <span className="truncate max-w-[140px]">
            {selectedProject || 'All Projects'}
          </span>
          {selectedProject ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(null)
              }}
              className="p-0.5 rounded-full hover:bg-accent/20 transition-colors"
              aria-label="Clear project filter"
            >
              <XIcon size={10} strokeWidth={2.5} />
            </button>
          ) : (
            <ChevronDownIcon
              size={12}
              strokeWidth={2}
              className={[
                'transition-transform duration-200',
                isOpen ? 'rotate-180' : '',
              ].join(' ')}
            />
          )}
        </button>

        {isOpen && (
          <div
            className={[
              'absolute top-full right-0 mt-1 z-50 min-w-[200px] max-w-[280px]',
              'bg-surface-base border border-[var(--border-default)] rounded-lg shadow-lg',
              'overflow-hidden',
            ].join(' ')}
          >
            <div className="p-2 border-b border-[var(--border-subtle)]">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className={[
                  'w-full px-2.5 py-1.5 text-[12px] rounded-md',
                  'bg-surface-sunken border border-[var(--border-subtle)]',
                  'text-ink-primary placeholder:text-ink-tertiary',
                  'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
                ].join(' ')}
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto py-1">
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className={[
                  'w-full text-left px-3 py-2 text-[12px] transition-colors',
                  !selectedProject
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-ink-secondary hover:bg-surface-raised hover:text-ink-primary',
                ].join(' ')}
              >
                All Projects
              </button>

              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleSelect(project.name)}
                    className={[
                      'w-full text-left px-3 py-2 text-[12px] transition-colors',
                      selectedProject === project.name
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-ink-secondary hover:bg-surface-raised hover:text-ink-primary',
                    ].join(' ')}
                  >
                    <span className="block truncate">{project.name}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-[11px] text-ink-tertiary text-center">
                  No projects found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Employee Card ────────────────────────────────────────────────────────────
function EmployeeCard({ employee, index, isExpanded, onToggle }: { 
  employee: Employee
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const { tag } = employee
  const primary = tagConfig[tag]

  const revenueDisplay = employee.revenue != null ? formatCurrency(employee.revenue) : 'N/A'
  const marginDisplay = employee.grossMarginPct != null ? formatPercent(employee.grossMarginPct) : 'N/A'

  return (
    <article
      className="bg-surface-base rounded-[14px] animate-fade-up transition-shadow hover:shadow-md overflow-hidden"
      style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Card Header - Clickable */}
      <div
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${employee.name}, ${primary.label} contributor. ${isExpanded ? 'Collapse' : 'Expand'} details.`}
        className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 cursor-pointer"
      >
        <Avatar name={employee.name} index={index} />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-ink-primary tracking-tight truncate">
            {employee.name}
          </h3>
        </div>
        
        {/* Summary metrics - hidden when expanded */}
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
        <Badge variant={primary.variant} dot>
          {primary.label}
        </Badge>
        
        {/* Chevron */}
        <ChevronDownIcon 
          size={18} 
          strokeWidth={2} 
          className={`text-ink-tertiary flex-shrink-0 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Expandable Details */}
      <div className="collapse-content" data-open={isExpanded}>
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1">
          <MetricsGrid employee={employee} />
          <ProjectSection employee={employee} />
        </div>
      </div>
    </article>
  )
}

// ── Main EmployeesList Component ─────────────────────────────────────────────
export interface EmployeesListProps {
  employees?: Employee[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  projects?: Project[]
  projectsLoading?: boolean
  selectedProject?: string | null
  onProjectChange?: (project: string | null) => void
}

export function EmployeesList({ 
  employees, 
  isLoading = false, 
  isError = false, 
  onRetry,
  projects = [],
  projectsLoading = false,
  selectedProject = null,
  onProjectChange,
}: EmployeesListProps) {
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
  const statusCounts: Record<StatusFilter, number> = useMemo(() => ({
    all: employees?.length ?? 0,
    high_contributor: employees?.filter(e => e.tag === 'high_contributor').length ?? 0,
    optimal: employees?.filter(e => e.tag === 'optimal').length ?? 0,
    underutilized: employees?.filter(e => e.tag === 'underutilized').length ?? 0,
  }), [employees])

  // Filter employees based on selected status
  const filteredEmployees = useMemo(() => {
    if (!employees) return []
    if (statusFilter === 'all') return employees
    return employees.filter(e => e.tag === statusFilter)
  }, [employees, statusFilter])

  // Check if all filtered employees are expanded
  const allExpanded = filteredEmployees.length > 0 && filteredEmployees.every(e => expandedIds.has(e.id))

  // Toggle all filtered employees
  const toggleAll = () => {
    if (!filteredEmployees.length) return
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (allExpanded) {
        filteredEmployees.forEach(e => next.delete(e.id))
      } else {
        filteredEmployees.forEach(e => next.add(e.id))
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}
      </div>
    )
  }

  if (isError) {
    return <ErrorState message="Could not load employee data." onRetry={onRetry} />
  }

  if (!employees?.length) {
    return (
      <div>
        {onProjectChange && projects.length > 0 && (
          <div className="mb-4">
            <ProjectFilterDropdown
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={onProjectChange}
            />
          </div>
        )}
        <EmptyState 
          title="No employee data" 
          description={selectedProject 
            ? `No employees found for project "${selectedProject}".`
            : "Upload data with employee records to see utilization analytics."
          } 
        />
      </div>
    )
  }

  return (
    <div>
      {/* Filter bar with expand/collapse toggle */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        {/* Left side: Status filter */}
        <StatusFilterBar 
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          counts={statusCounts}
        />
        
        {/* Right side: Project filter + Expand/Collapse All */}
        <div className="flex items-center gap-3 flex-wrap">
          {onProjectChange && projects.length > 0 && !projectsLoading && (
            <ProjectFilterDropdown
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={onProjectChange}
            />
          )}
          {filteredEmployees.length > 0 && (
            <button
              onClick={toggleAll}
              aria-label={allExpanded ? 'Collapse all employee cards' : 'Expand all employee cards'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium font-sans cursor-pointer border transition-all duration-150 bg-surface-base text-ink-secondary border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
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
      </div>
      
      {/* Employees list */}
      {filteredEmployees.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredEmployees.map((e, i) => (
            <EmployeeCard 
              key={e.id} 
              employee={e}
              index={i}
              isExpanded={expandedIds.has(e.id)}
              onToggle={() => toggleExpand(e.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-ink-tertiary text-[14px]">
          No employees match the selected filter.
        </div>
      )}
    </div>
  )
}
