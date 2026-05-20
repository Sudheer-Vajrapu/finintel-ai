import type { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

/**
 * CSS-only tooltip component with light/dark mode support.
 * Wraps children and shows tooltip on hover.
 */
export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses = position === 'top' 
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2'

  const arrowClasses = position === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 border-t-[var(--ink-primary)] dark:border-t-[var(--surface-raised)] border-x-transparent border-b-transparent'
    : 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--ink-primary)] dark:border-b-[var(--surface-raised)] border-x-transparent border-t-transparent'

  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={[
          'absolute z-50 pointer-events-none',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-150 ease-out',
          positionClasses,
        ].join(' ')}
        role="tooltip"
      >
        <div
          className={[
            'px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap',
            'bg-[var(--ink-primary)] text-[var(--surface-base)]',
            'dark:bg-[var(--surface-raised)] dark:text-[var(--ink-primary)]',
            'border border-[var(--border-strong)]',
            'shadow-md',
          ].join(' ')}
        >
          {content}
        </div>
        {/* Arrow */}
        <div
          className={[
            'absolute w-0 h-0 border-4',
            arrowClasses,
          ].join(' ')}
        />
      </div>
    </div>
  )
}
