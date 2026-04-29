import { useState, useEffect } from 'react'
import { UploadSection } from '@/features/upload/components/UploadSection'
import { ProjectsList } from '@/features/projects/components/ProjectsList'
import { EmployeesList } from '@/features/employees/components/EmployeesList'
import { RisksPanel } from '@/features/risks/components/RisksPanel'
import { QAPanel } from '@/features/qa/components/QAPanel'
import { MetricCard } from '@/shared/components/ui/MetricCard'
import { Tabs, TabList, TabTrigger, TabPanel } from '@/shared/components/ui/Tabs'
import { Button } from '@/shared/components/ui/Button'
import { MetricSkeleton } from '@/shared/components/ui/Loader'
import { ChevronLeftIcon, ChevronDownIcon, ArrowUpIcon } from '@/shared/components/ui/Icons'
import { useIngest, useMetrics, useProjects, useRisks, useResetDataset } from '@/shared/api/hooks'
import { useToast } from '@/shared/components/ui/Toast'
import { formatCurrency, formatPercent, formatNumber } from '@/shared/utils'
import type { TimeRange } from '@/shared/utils'

// ── Time range selector ────────────────────────────────────────────────────
const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: 'All', value: 'all' },
  { label: '1M',  value: '1m'  },
  { label: '3M',  value: '3m'  },
  { label: '6M',  value: '6m'  },
  { label: '1Y',  value: '1y'  },
]

function TimeRangeSelector({
  value,
  onChange,
}: {
  value: TimeRange
  onChange: (v: TimeRange) => void
}) {
  return (
    <>
      {/* Mobile: Dropdown */}
      <div className="sm:hidden relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as TimeRange)}
          className={[
            'appearance-none pl-3 pr-8 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer',
            'bg-accent text-accent-text border border-accent',
            'dark:bg-surface-raised dark:text-accent dark:border-accent-border',
            'focus:outline-none focus:ring-2 focus:ring-accent-light',
          ].join(' ')}
        >
          {TIME_RANGES.map(r => (
            <option key={r.value} value={r.value}>
              {r.label === 'All' ? 'All time' : r.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon 
          size={14} 
          strokeWidth={2.5} 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-accent-text dark:text-accent" 
        />
      </div>

      {/* Desktop: Pill buttons */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-[12px] font-medium text-ink-secondary mr-1">Time range:</span>
        {TIME_RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => onChange(r.value)}
            className={[
              'px-3 py-1 rounded-full text-[12px] font-medium font-sans cursor-pointer border transition-all duration-150',
              value === r.value
                ? 'bg-accent text-accent-text border-accent dark:bg-surface-raised dark:text-accent dark:border-accent-border'
                : 'bg-surface-base text-ink-secondary border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary',
            ].join(' ')}
          >
            {r.label}
          </button>
        ))}
      </div>
    </>
  )
}

// ── Dashboard page ─────────────────────────────────────────────────────────
export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [activeTab, setActiveTab] = useState<string>('projects')
  // Track whether ingest was successful - enables data fetching
  const [isIngested, setIsIngested] = useState(false)
  // Track scroll position for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false)
  // Project filter for risks tab
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Show scroll-to-top button when scrolled past 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { mutate: ingestFiles, isPending: isIngesting } = useIngest()
  const { mutate: resetDataset, isPending: isResetting } = useResetDataset()
  const { success: toastSuccess, error: toastError } = useToast()

  // ── Data fetching hooks (enabled after successful ingest) ────────────────
  const { 
    data: metrics, 
    isLoading: metricsLoading, 
    isError: metricsError,
    refetch: refetchMetrics,
  } = useMetrics(timeRange, { enabled: isIngested })

  const { 
    data: projects, 
    isLoading: projectsLoading, 
    isError: projectsError,
    refetch: refetchProjects,
  } = useProjects(timeRange, { enabled: isIngested && (activeTab === 'projects' || activeTab === 'risks') })

  const { 
    data: risksData, 
    isLoading: risksLoading, 
    isError: risksError,
    refetch: refetchRisks,
  } = useRisks(timeRange, { enabled: isIngested && activeTab === 'risks', project: selectedProject })

  // ── Analyze handler — calls POST /ingest then enables data fetching ──────
  const handleAnalyze = (_csvText: string, files: File[]) => {
    const hasFiles = files.length > 0
    const hasCsv   = _csvText.trim().length > 0

    ingestFiles(
      { files: hasFiles ? files : undefined, csvText: hasCsv ? _csvText : undefined },
      {
        onSuccess: (data) => {
          toastSuccess(
            'Data ingested successfully',
            data.files_processed != null
              ? `${data.files_processed} files processed`
              : data.message ?? 'Files processed',
          )
          setIsIngested(true)
        },
        onError: (err: Error) => {
          const msg = err instanceof Error ? err.message : 'Ingestion failed'
          toastError('Ingestion failed', msg)
          // Stay on upload screen - do NOT set isIngested
        },
      },
    )
  }

  // ── Reset handler — calls DELETE /dataset then navigates to upload ──────
  const handleReset = () => {
    resetDataset(undefined, {
      onSuccess: () => {
        toastSuccess('Dataset cleared', 'Ready for new analysis')
        setIsIngested(false)
        setTimeRange('all')
        setActiveTab('projects')
      },
      onError: (err: Error) => {
        const msg = err instanceof Error ? err.message : 'Failed to reset dataset'
        toastError('Reset failed', msg)
        // Still navigate to upload even if delete fails
        setIsIngested(false)
        setTimeRange('all')
        setActiveTab('projects')
      },
    })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // ── Upload view ──────────────────────────────────────────────────────────
  if (!isIngested) {
    return <UploadSection onAnalyze={handleAnalyze} isLoading={isIngesting} />
  }

  // ── Dashboard view ───────────────────────────────────────────────────────
  const isMetricsReady = !metricsLoading && !metricsError && metrics

  return (
    <div>
      {/* Controls row */}
      <div className="flex items-center justify-between mb-3 sm:mb-5 gap-2 sm:gap-3">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        <button
          onClick={handleReset}
          disabled={isResetting}
          className={[
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-medium font-sans cursor-pointer border transition-all duration-150',
            'bg-surface-base text-ink-secondary border-[var(--border-default)]',
            'hover:bg-surface-raised hover:text-ink-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
            isResetting ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {isResetting ? (
            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <ChevronLeftIcon size={12} strokeWidth={2.5} />
          )}
          {isResetting ? 'Resetting...' : 'New analysis'}
        </button>
      </div>

      {/* Metrics grid - responsive: 2 cols mobile, 3 cols tablet, 5 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-6 sm:mb-8">
        {metricsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={i === 4 ? 'col-span-2 sm:col-span-1' : ''}>
              <MetricSkeleton />
            </div>
          ))
        ) : metricsError ? (
          <div className="col-span-full text-center py-4">
            <p className="text-ink-secondary text-sm mb-2">Failed to load metrics</p>
            <Button variant="ghost" size="sm" onClick={() => refetchMetrics()}>
              Retry
            </Button>
          </div>
        ) : isMetricsReady ? (
          <>
            <MetricCard 
              label="Total revenue" 
              value={metrics.totalRevenue != null ? formatCurrency(metrics.totalRevenue) : 'N/A'} 
            />
            <MetricCard 
              label="Total cost" 
              value={metrics.totalCost != null ? formatCurrency(metrics.totalCost) : 'N/A'} 
            />
            <MetricCard 
              label="Total profit" 
              value={metrics.totalProfit != null ? formatCurrency(metrics.totalProfit) : 'N/A'} 
            />
            <MetricCard 
              label="Gross margin" 
              value={metrics.avgMarginPct != null ? formatPercent(metrics.avgMarginPct) : 'N/A'} 
            />
            <div className="col-span-2 sm:col-span-1">
              <MetricCard
                label="Total employees"
                value={metrics.totalEmployees != null ? formatNumber(metrics.totalEmployees) : 'N/A'}
              />
            </div>
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs defaultTab="projects" onChange={handleTabChange}>
        <TabList>
          <TabTrigger id="projects">Projects</TabTrigger>
          <TabTrigger id="employees">Employees</TabTrigger>
          <TabTrigger id="risks">Risks & recs</TabTrigger>
          <TabTrigger id="qa">Ask AI</TabTrigger>
        </TabList>
        <TabPanel id="projects">
          <ProjectsList 
            projects={projects} 
            isLoading={projectsLoading} 
            isError={projectsError}
            onRetry={() => refetchProjects()}
          />
        </TabPanel>
        <TabPanel id="employees">
          <EmployeesList employees={[]} isLoading={false} />
        </TabPanel>
        <TabPanel id="risks">
          <RisksPanel 
            data={risksData} 
            isLoading={risksLoading} 
            isError={risksError}
            onRetry={() => refetchRisks()}
            projects={projects ?? []}
            projectsLoading={projectsLoading}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
          />
        </TabPanel>
        <TabPanel id="qa">
          <QAPanel />
        </TabPanel>
      </Tabs>

      {/* Global Scroll to Top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={[
          'fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg',
          'bg-accent text-white hover:bg-accent/90',
          'transition-all duration-300 ease-out',
          showScrollTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <ArrowUpIcon size={20} strokeWidth={2.5} />
      </button>
    </div>
  )
}
