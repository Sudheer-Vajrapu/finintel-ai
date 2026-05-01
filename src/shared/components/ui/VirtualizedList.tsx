import { ReactNode } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  maxHeight?: number
  className?: string
}

/**
 * ScrollableList - A scrollable container for lists with variable-height items.
 * Uses native scrolling instead of virtualization to properly handle expandable cards.
 * For very large lists (100+ items), consider implementing true virtualization with
 * dynamic height measurement.
 */
export function VirtualizedList<T>({
  items,
  renderItem,
  maxHeight = 500,
  className = '',
}: VirtualizedListProps<T>) {
  if (items.length === 0) {
    return null
  }

  // For small lists, render without scroll container
  if (items.length <= 5) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  // For larger lists, use a scrollable container with max height
  return (
    <div 
      className={`${className} overflow-y-auto scrollbar-thin`}
      style={{ maxHeight }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
