import { useMemo, useState } from 'react'
import { CollapsibleSection } from '@/shared/components/ui/CollapsibleSection'
import { VirtualizedList } from '@/shared/components/ui/VirtualizedList'
import { EmployeeScorecardCard } from './EmployeeScorecardCard'
import type { EmployeeScorecard, PerformanceBand } from '@/shared/api/types'

interface ScorecardsSectionProps {
  scorecards: EmployeeScorecard[]
  defaultExpanded?: boolean
  highlightedId?: string | null
  forceExpand?: number  // Increment to trigger expansion
}

export function ScorecardsSection({ scorecards, defaultExpanded = false, highlightedId, forceExpand }: ScorecardsSectionProps) {
  const [cardResetKey, setCardResetKey] = useState(0)

  const handleSectionExpandChange = (isExpanded: boolean) => {
    if (!isExpanded) {
      // Increment reset key to collapse all cards
      setCardResetKey(prev => prev + 1)
    }
  }

  const grouped = useMemo(() => {
    const groups: Record<PerformanceBand, EmployeeScorecard[]> = {
      Star: [],
      Solid: [],
      Watch: [],
    }

    scorecards.forEach((sc) => {
      const band = sc.performance.band
      if (groups[band]) {
        groups[band].push(sc)
      }
    })

    return groups
  }, [scorecards])

  const bandCounts = {
    Star: grouped.Star.length,
    Solid: grouped.Solid.length,
    Watch: grouped.Watch.length,
  }

  const summary = (
    <span className="flex items-center gap-2 text-[12px]">
      <span className="font-medium">{scorecards.length} Employees</span>
      {bandCounts.Star > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-success-bg text-success-text text-[10px] font-medium">
          {bandCounts.Star} Star
        </span>
      )}
      {bandCounts.Solid > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-info-bg text-info-text text-[10px] font-medium">
          {bandCounts.Solid} Solid
        </span>
      )}
      {bandCounts.Watch > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-warning-bg text-warning-text text-[10px] font-medium">
          {bandCounts.Watch} Watch
        </span>
      )}
    </span>
  )

  if (scorecards.length === 0) {
    return null
  }

  // Create a map of employee to original index for unique IDs
  const employeeIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    scorecards.forEach((sc, idx) => {
      const key = sc.employee.toLowerCase()
      if (!map.has(key)) {
        map.set(key, idx)
      }
    })
    return map
  }, [scorecards])

  const renderScorecard = (sc: EmployeeScorecard) => {
    const originalIndex = employeeIndexMap.get(sc.employee.toLowerCase()) ?? 0
    const scId = `scorecard-${originalIndex}`
    const isHighlighted = highlightedId === scId
    return (
      <EmployeeScorecardCard 
        key={`${sc.employee}-${sc.project}`} 
        scorecard={sc}
        resetKey={cardResetKey}
        id={scId}
        isHighlighted={isHighlighted}
      />
    )
  }

  return (
    <CollapsibleSection
      title="Employee Scorecards"
      summary={summary}
      defaultExpanded={defaultExpanded}
      forceExpand={forceExpand}
      onExpandChange={handleSectionExpandChange}
    >
      {grouped.Star.length > 0 && (
        <div className="mb-4">
          <BandHeader band="Star" count={grouped.Star.length} />
          <VirtualizedList
            items={grouped.Star}
            maxHeight={340}
            renderItem={(sc: EmployeeScorecard) => renderScorecard(sc)}
          />
        </div>
      )}

      {grouped.Solid.length > 0 && (
        <div className="mb-4">
          <BandHeader band="Solid" count={grouped.Solid.length} />
          <VirtualizedList
            items={grouped.Solid}
            maxHeight={340}
            renderItem={(sc: EmployeeScorecard) => renderScorecard(sc)}
          />
        </div>
      )}

      {grouped.Watch.length > 0 && (
        <div>
          <BandHeader band="Watch" count={grouped.Watch.length} />
          <VirtualizedList
            items={grouped.Watch}
            maxHeight={340}
            renderItem={(sc: EmployeeScorecard) => renderScorecard(sc)}
          />
        </div>
      )}
    </CollapsibleSection>
  )
}

function BandHeader({ band, count }: { band: PerformanceBand; count: number }) {
  const colors: Record<PerformanceBand, string> = {
    Star: 'var(--success-text)',
    Solid: 'var(--info-text)',
    Watch: 'var(--warning-text)',
  }

  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-2 flex items-center gap-2" style={{ color: colors[band] }}>
      <span className="flex-1 h-px" style={{ background: colors[band], opacity: 0.3 }} />
      {band} Performers ({count})
      <span className="flex-1 h-px" style={{ background: colors[band], opacity: 0.3 }} />
    </p>
  )
}
