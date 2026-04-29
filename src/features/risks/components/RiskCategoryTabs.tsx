import type { RiskCategory } from '@/shared/api/types'

type CategoryFilter = 'all' | RiskCategory

interface CategoryCount {
  all: number
  financial: number
  workforce: number
  operational: number
  general: number
}

const CATEGORY_STYLES: Record<CategoryFilter, {
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
  financial: {
    activeBg: 'var(--danger-bg)',
    activeText: 'var(--danger-bold)',
    activeBorder: 'var(--danger-border)',
    countBg: 'var(--danger-mid)',
    countText: 'white',
  },
  workforce: {
    activeBg: 'var(--warning-bg)',
    activeText: 'var(--warning-text)',
    activeBorder: 'var(--warning-border)',
    countBg: 'var(--warning-mid)',
    countText: 'white',
  },
  operational: {
    activeBg: 'var(--info-bg)',
    activeText: 'var(--info-text)',
    activeBorder: 'var(--info-border)',
    countBg: 'var(--info-mid)',
    countText: 'white',
  },
  general: {
    activeBg: 'var(--surface-raised)',
    activeText: 'var(--ink-primary)',
    activeBorder: 'var(--border-default)',
    countBg: 'var(--ink-tertiary)',
    countText: 'white',
  },
}

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All',
  financial: 'Financial',
  workforce: 'Workforce',
  operational: 'Operational',
  general: 'General',
}

interface RiskCategoryTabsProps {
  activeCategory: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
  counts: CategoryCount
}

export function RiskCategoryTabs({
  activeCategory,
  onCategoryChange,
  counts,
}: RiskCategoryTabsProps) {
  const categories: CategoryFilter[] = ['all', 'financial', 'workforce', 'operational', 'general']

  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-4">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const count = category === 'all' ? counts.all : counts[category] ?? 0
        const styles = CATEGORY_STYLES[category]
        const label = CATEGORY_LABELS[category]

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
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

export type { CategoryFilter, CategoryCount }
