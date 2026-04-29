import { useState, useMemo, useCallback } from 'react'
import { RisksPanelSkeleton } from '@/shared/components/ui/Loader'
import { CollapsibleSection } from '@/shared/components/ui/CollapsibleSection'
import { EmptyState, ErrorState } from '@/shared/components/ui/EmptyState'
import { RiskCategoryTabs, type CategoryFilter, type CategoryCount } from './RiskCategoryTabs'
import { SeverityFilterBar, type SeverityFilter, type SeverityCount } from './SeverityFilter'
import { ProjectFilterDropdown } from './ProjectFilterDropdown'
import { AIInsightsBanner } from './AIInsightsBanner'
import { RiskCard } from './RiskCard'
import { RecommendationCard } from './RecommendationCard'
import { ScorecardsSection } from './ScorecardsSection'
import type { RisksData, RiskItem, RiskSeverity, Project } from '@/shared/api/types'

// ─── Overview Header ─────────────────────────────────────────────────────────
function RiskOverviewHeader({ overview }: { overview: RisksData['overview'] }) {
  type NonPositiveSeverity = Exclude<RiskSeverity, 'positive'>
  
  const criticalCount = overview.by_severity.critical ?? 0
  const highCount = overview.by_severity.high ?? 0
  const mediumCount = overview.by_severity.medium ?? 0
  const lowCount = overview.by_severity.low ?? 0
  
  const allBadges: { severity: NonPositiveSeverity; count: number; label: string; bg: string; text: string }[] = [
    { severity: 'critical', count: criticalCount, label: 'Critical', bg: 'var(--danger-bg)', text: 'var(--danger-bold)' },
    { severity: 'high', count: highCount, label: 'High', bg: 'var(--danger-bg)', text: 'var(--danger-text)' },
    { severity: 'medium', count: mediumCount, label: 'Medium', bg: 'var(--warning-bg)', text: 'var(--warning-text)' },
    { severity: 'low', count: lowCount, label: 'Low', bg: 'var(--surface-sunken)', text: 'var(--ink-secondary)' },
  ]
  const severityBadges = allBadges.filter(b => b.count > 0)

  // Determine the top category
  const categoryEntries = Object.entries(overview.by_category)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
  const topCategory = categoryEntries[0]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-ink-primary">
          {overview.total_risks} Risks Identified
        </span>
        {overview.action_needed > 0 && (
          <span 
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger-bold)' }}
          >
            {overview.action_needed} Require Action
          </span>
        )}
      </div>
      
      <span className="text-ink-tertiary hidden sm:inline">|</span>
      
      <div className="flex items-center gap-1.5">
        {severityBadges.map(({ severity, count, label, bg, text }) => (
          <span
            key={severity}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: bg, color: text }}
          >
            {count} {label}
          </span>
        ))}
      </div>

      {topCategory && (
        <>
          <span className="text-ink-tertiary hidden sm:inline">|</span>
          <span className="text-[12px] text-ink-secondary">
            Top: <span className="font-medium capitalize">{topCategory[0]}</span> ({topCategory[1]})
          </span>
        </>
      )}
    </div>
  )
}

// ─── Risks Section Content ───────────────────────────────────────────────────
interface RisksSectionProps {
  risks: RiskItem[]
  overview: RisksData['overview']
  onViewScorecard?: (employeeName: string) => void
  onViewRecommendation?: (riskType: string) => void
}

function RisksSection({ risks, overview, onViewScorecard, onViewRecommendation }: RisksSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')

  // Filter out positive signals from risks
  const nonPositiveRisks = useMemo(() => 
    risks.filter(r => r.severity !== 'positive'), 
    [risks]
  )

  const categoryCounts: CategoryCount = useMemo(() => ({
    all: nonPositiveRisks.length,
    financial: overview.by_category.financial ?? 0,
    workforce: overview.by_category.workforce ?? 0,
    operational: overview.by_category.operational ?? 0,
    general: overview.by_category.general ?? 0,
  }), [nonPositiveRisks.length, overview])

  const severityCounts: SeverityCount = useMemo(() => ({
    all: nonPositiveRisks.length,
    critical: overview.by_severity.critical ?? 0,
    high: overview.by_severity.high ?? 0,
    medium: overview.by_severity.medium ?? 0,
    low: overview.by_severity.low ?? 0,
  }), [nonPositiveRisks.length, overview])

  const filteredRisks = useMemo(() => {
    return nonPositiveRisks.filter((risk) => {
      const categoryMatch = categoryFilter === 'all' || risk.category === categoryFilter
      const severityMatch = severityFilter === 'all' || risk.severity === severityFilter
      return categoryMatch && severityMatch
    })
  }, [nonPositiveRisks, categoryFilter, severityFilter])

  const risksSummary = (
    <span className="text-[12px]">
      <span className="font-medium">{nonPositiveRisks.length} total</span>
      {overview.action_needed > 0 && (
        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-danger-bg text-danger-text text-[10px] font-medium">
          {overview.action_needed} Immediate
        </span>
      )}
    </span>
  )

  return (
    <CollapsibleSection title="Risks" summary={risksSummary} defaultExpanded={true}>
      <RiskCategoryTabs
        activeCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        counts={categoryCounts}
      />
      <SeverityFilterBar
        activeSeverity={severityFilter}
        onSeverityChange={setSeverityFilter}
        counts={severityCounts}
      />
      {filteredRisks.length > 0 ? (
        filteredRisks.map((risk, idx) => (
          <RiskCard 
            key={`${risk.type}-${risk.entity}-${idx}`} 
            risk={risk}
            onViewScorecard={onViewScorecard}
            onViewRecommendation={onViewRecommendation}
          />
        ))
      ) : (
        <p className="text-center py-6 text-ink-tertiary text-[13px]">
          No risks match the selected filters.
        </p>
      )}
    </CollapsibleSection>
  )
}

// ─── Recommendations Section Content ─────────────────────────────────────────
interface RecommendationsSectionProps {
  recommendations: RisksData['recommendations']
  highlightedId?: string | null
  forceExpand?: boolean
}

function RecommendationsSection({ recommendations, highlightedId, forceExpand }: RecommendationsSectionProps) {
  const immediateCount = recommendations.filter(r => r.priority === 'IMMEDIATE').length
  const shortTermCount = recommendations.filter(r => r.priority === 'SHORT_TERM').length

  const summary = (
    <span className="text-[12px]">
      <span className="font-medium">{recommendations.length} total</span>
      {immediateCount > 0 && (
        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-danger-bg text-danger-text text-[10px] font-medium">
          {immediateCount} Immediate
        </span>
      )}
      {shortTermCount > 0 && (
        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-warning-bg text-warning-text text-[10px] font-medium">
          {shortTermCount} Short-Term
        </span>
      )}
    </span>
  )

  if (recommendations.length === 0) {
    return null
  }

  return (
    <CollapsibleSection title="Recommendations" summary={summary} defaultExpanded={false} forceExpand={forceExpand}>
      {recommendations.map((rec, idx) => {
        const recId = `recommendation-${idx}`
        const isHighlighted = highlightedId === recId
        return (
          <RecommendationCard 
            key={`${rec.related_risk_type}-${idx}`} 
            recommendation={rec}
            id={recId}
            isHighlighted={isHighlighted}
          />
        )
      })}
    </CollapsibleSection>
  )
}

// ─── Main RisksPanel Component ───────────────────────────────────────────────
export interface RisksPanelProps {
  data?: RisksData
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  projects?: Project[]
  projectsLoading?: boolean
  selectedProject?: string | null
  onProjectChange?: (project: string | null) => void
}

export function RisksPanel({
  data,
  isLoading = false,
  isError = false,
  onRetry,
  projects = [],
  projectsLoading = false,
  selectedProject = null,
  onProjectChange,
}: RisksPanelProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [expandRecommendations, setExpandRecommendations] = useState(false)
  const [expandScorecards, setExpandScorecards] = useState(false)

  const scrollToAndHighlight = useCallback((targetId: string, expandSection: () => void) => {
    expandSection()
    
    // Wait for section to expand before scrolling
    setTimeout(() => {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightedId(targetId)
        
        // Remove highlight after animation
        setTimeout(() => setHighlightedId(null), 2000)
      }
    }, 350)
  }, [])

  const handleViewScorecard = useCallback((employeeName: string) => {
    // Find the first scorecard matching this employee
    const scorecardIndex = data?.employeeScorecards.findIndex(
      sc => sc.employee.toLowerCase() === employeeName.toLowerCase()
    ) ?? -1
    if (scorecardIndex >= 0) {
      const targetId = `scorecard-${scorecardIndex}`
      scrollToAndHighlight(targetId, () => setExpandScorecards(true))
    }
  }, [scrollToAndHighlight, data?.employeeScorecards])

  const handleViewRecommendation = useCallback((riskType: string) => {
    // Find the first recommendation matching this risk type
    const recIndex = data?.recommendations.findIndex(
      rec => rec.related_risk_type.toLowerCase() === riskType.toLowerCase()
    ) ?? -1
    if (recIndex >= 0) {
      const targetId = `recommendation-${recIndex}`
      scrollToAndHighlight(targetId, () => setExpandRecommendations(true))
    }
  }, [scrollToAndHighlight, data?.recommendations])

  if (isLoading) {
    return <RisksPanelSkeleton />
  }

  if (isError) {
    return <ErrorState message="Could not load risk data." onRetry={onRetry} />
  }

  if (!data || data.risks.length === 0) {
    return (
      <div>
        {onProjectChange && (
          <div className="mb-4">
            <ProjectFilterDropdown
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={onProjectChange}
              isLoading={projectsLoading}
            />
          </div>
        )}
        <EmptyState
          title="No risk data"
          description={selectedProject 
            ? `No risks found for project "${selectedProject}".`
            : "Upload and analyze data to detect risks and get recommendations."
          }
        />
      </div>
    )
  }

  return (
    <div>
      {/* AI Insights Banner */}
      <AIInsightsBanner insights={data.aiInsights} />
      {/* Header row with title and project filter */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <RiskOverviewHeader overview={data.overview} />
        {onProjectChange && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-ink-tertiary">Filter by:</span>
            <ProjectFilterDropdown
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={onProjectChange}
              isLoading={projectsLoading}
            />
          </div>
        )}
      </div>

      {/* Sections */}
      <RisksSection 
        risks={data.risks} 
        overview={data.overview}
        onViewScorecard={handleViewScorecard}
        onViewRecommendation={handleViewRecommendation}
      />
      <RecommendationsSection 
        recommendations={data.recommendations}
        highlightedId={highlightedId}
        forceExpand={expandRecommendations}
      />
      <ScorecardsSection 
        scorecards={data.employeeScorecards} 
        defaultExpanded={false}
        highlightedId={highlightedId}
        forceExpand={expandScorecards}
      />
    </div>
  )
}
