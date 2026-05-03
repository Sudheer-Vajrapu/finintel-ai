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
      High: [],
      Average: [],
      Low: [],
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
    High: grouped.High.length,
    Average: grouped.Average.length,
    Low: grouped.Low.length,
  }

  const summary = (
    <span className="flex items-center gap-2 text-[12px]">
      <span className="font-medium">{scorecards.length} Employees</span>
      {bandCounts.High > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-success-bg text-success-text text-[10px] font-medium">
          {bandCounts.High} High
        </span>
      )}
      {bandCounts.Average > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-warning-bg text-warning-text text-[10px] font-medium">
          {bandCounts.Average} Average
        </span>
      )}
      {bandCounts.Low > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-danger-bg text-danger-text text-[10px] font-medium">
          {bandCounts.Low} Low
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
      {grouped.High.length > 0 && (
        <div className="mb-4">
          <BandHeader band="High" count={grouped.High.length} />
          <VirtualizedList
            items={grouped.High}
            maxHeight={340}
            renderItem={(sc: EmployeeScorecard) => renderScorecard(sc)}
          />
        </div>
      )}

      {grouped.Average.length > 0 && (
        <div className="mb-4">
          <BandHeader band="Average" count={grouped.Average.length} />
          <VirtualizedList
            items={grouped.Average}
            maxHeight={340}
            renderItem={(sc: EmployeeScorecard) => renderScorecard(sc)}
          />
        </div>
      )}

      {grouped.Low.length > 0 && (
        <div>
          <BandHeader band="Low" count={grouped.Low.length} />
          <VirtualizedList
            items={grouped.Low}
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
    High: 'var(--success-text)',
    Average: 'var(--warning-text)',
    Low: 'var(--danger-text)',
  }

  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.7px] mb-2 flex items-center gap-2" style={{ color: colors[band] }}>
      <span className="flex-1 h-px" style={{ background: colors[band], opacity: 0.3 }} />
      {band} Margin Employees ({count})
      <span className="flex-1 h-px" style={{ background: colors[band], opacity: 0.3 }} />
    </p>
  )
}
