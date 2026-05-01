/*
 * MetricCard — each card has:
 *  • A colored top-border strip (semantic identity per metric)
 *  • Larger value text (28px → was 24px) for hierarchy
 *  • Sub-label with increased contrast (ink-secondary → was ink-tertiary)
 *  • Trend badge with semantic background
 */

// Uniform accent strip color for all KPI cards (removes visual noise)
const STRIP_COLOR = 'var(--accent)'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  stripColor?: string
}

const trendConfig = {
  up:      { symbol: '↑', bg: 'var(--success-bg)',      color: 'var(--success-text)' },
  down:    { symbol: '↓', bg: 'var(--danger-bg)',       color: 'var(--danger-bold)'  },
  neutral: { symbol: '→', bg: 'var(--surface-sunken)',  color: 'var(--ink-tertiary)' },
}

export function MetricCard({ label, value, sub, trend, stripColor }: MetricCardProps) {
  const t = trend ? trendConfig[trend] : null

  return (
    <div
      className="bg-surface-base rounded-[14px] overflow-hidden relative"
      style={{
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Subtle top accent strip — uniform color for all cards */}
      <div className="h-[3px] w-full" style={{ background: stripColor ?? STRIP_COLOR }} />

      <div className="px-3 py-2.5 sm:px-4 sm:py-3.5">
        <p className="text-[10px] sm:text-[11px] font-bold text-ink-tertiary uppercase tracking-[0.7px] mb-1.5 sm:mb-2 leading-none">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          {/* Larger value — responsive sizing */}
          <p className="text-[22px] sm:text-[28px] font-bold leading-none tracking-tight text-ink-primary tabular-nums">
            {value}
          </p>
          {t && (
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none"
              style={{ background: t.bg, color: t.color }}
            >
              {t.symbol}
            </span>
          )}
        </div>
        {sub && (
          <p className="text-[11px] font-semibold text-ink-secondary mt-1.5 leading-none">{sub}</p>
        )}
      </div>
    </div>
  )
}
