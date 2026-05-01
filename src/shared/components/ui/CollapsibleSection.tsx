import { useState, ReactNode, useRef, useEffect } from 'react'
import { ChevronDownIcon } from './Icons'

interface CollapsibleSectionProps {
  title: string
  summary?: ReactNode
  defaultExpanded?: boolean
  forceExpand?: number  // Increment to trigger expansion
  onExpandChange?: (isExpanded: boolean) => void
  children: ReactNode
  className?: string
  id?: string
}

export function CollapsibleSection({
  title,
  summary,
  defaultExpanded = true,
  forceExpand,
  onExpandChange,
  children,
  className = '',
  id,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Force expand when triggered from parent (increment-based trigger)
  useEffect(() => {
    if (forceExpand && forceExpand > 0) {
      setIsExpanded(true)
    }
  }, [forceExpand])
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isExpanded])

  return (
    <div
      id={id}
      className={[
        'rounded-[14px] mb-4 overflow-hidden',
        'transition-shadow duration-300 ease-out',
        isExpanded ? 'shadow-sm' : 'shadow-none',
        className,
      ].join(' ')}
      style={{
        background: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <button
        type="button"
        onClick={() => {
          const newState = !isExpanded
          setIsExpanded(newState)
          onExpandChange?.(newState)
        }}
        className={[
          'w-full flex items-center justify-between px-4 py-3 cursor-pointer',
          'transition-all duration-200 ease-out',
          'hover:bg-surface-raised/50',
        ].join(' ')}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <div
            className={[
              'transition-transform duration-300 ease-out',
              isExpanded ? 'rotate-0' : '-rotate-90',
            ].join(' ')}
          >
            <ChevronDownIcon
              size={16}
              strokeWidth={2.5}
              className="text-ink-tertiary"
            />
          </div>
          <span className="text-[14px] font-semibold text-ink-primary">{title}</span>
          {summary && (
            <>
              <span className="text-ink-tertiary mx-1">·</span>
              <span className="text-[13px] text-ink-secondary">{summary}</span>
            </>
          )}
        </div>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          maxHeight: isExpanded ? contentHeight ?? 5000 : 0,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'max-height, opacity, transform',
        }}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  )
}
