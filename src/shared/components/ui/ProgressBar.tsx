const fills: Record<string, string> = {
  green:  'var(--success-mid)',
  red:    'var(--danger-mid)',
  amber:  'var(--warning-mid)',
  blue:   'var(--info-mid)',
  indigo: 'var(--accent)',
}

interface ProgressBarProps {
  value: number
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'indigo'
  height?: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, variant = 'green', height = 5, className = '', showLabel = false }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={className}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: 'var(--surface-sunken)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: fills[variant] ?? fills.green }}
          role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
        />
      </div>
      {showLabel && <p className="text-xs text-ink-tertiary mt-1 font-medium">{pct.toFixed(1)}%</p>}
    </div>
  )
}

export function SegmentedBar({ segments = 4, filledRatio, variant = 'green', height = 28, labels }: {
  segments?: number; filledRatio: number; variant?: 'green' | 'red' | 'amber'; height?: number; labels?: string[]
}) {
  const count = Math.round(Math.min(1, filledRatio) * segments)
  const color = variant === 'green' ? 'var(--success-mid)' : variant === 'red' ? 'var(--danger-mid)' : 'var(--warning-mid)'
  const defaultLabels = ['Q1', 'Q2', 'Q3', 'Q4']
  const segmentLabels = labels ?? defaultLabels.slice(0, segments)
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-[3px]" style={{ height }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-[5px] transition-all duration-300 cursor-default group relative"
            style={{ background: color, opacity: i < count ? 1 : 0.12 }}
            title={segmentLabels[i] ? `${segmentLabels[i]}: ${i < count ? 'Active' : 'Inactive'}` : undefined}
          />
        ))}
      </div>
      <div className="flex gap-[3px]">
        {segmentLabels.map((label, i) => (
          <span key={i} className="flex-1 text-[9px] text-ink-tertiary text-center font-medium">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
