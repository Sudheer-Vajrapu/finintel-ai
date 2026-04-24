import React from 'react'

type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'indigo' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/*
 * Contrast rationale (WCAG AA requires 4.5:1 on small text):
 *  green  — #14532D on #DCFCE7 = 9.2:1  ✓
 *  red    — #7F1D1D on #FEE2E2 = 8.4:1  ✓
 *  amber  — #78350F on #FEF3C7 = 8.1:1  ✓
 *  blue   — #1E3A8A on #DBEAFE = 8.6:1  ✓
 *  indigo — #312E81 on #EEF2FF = 9.1:1  ✓
 *  gray   — #3D4A63 on #F4F5FA = 7.2:1  ✓
 */
const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-[var(--success-bg)]  text-[var(--success-text)]  border border-[var(--success-border)]',
  red:    'bg-[var(--danger-bg)]   text-[var(--danger-bold)]   border border-[var(--danger-border)]',
  amber:  'bg-[var(--warning-bg)]  text-[var(--warning-text)]  border border-[var(--warning-border)]',
  blue:   'bg-[var(--info-bg)]     text-[var(--info-text)]     border border-[var(--info-border)]',
  indigo: 'bg-accent-light text-ink-primary border border-accent-border dark:text-accent',
  gray:   'bg-surface-raised        text-[var(--ink-secondary)]  border border-[var(--border-default)]',
}

const dotColors: Record<BadgeVariant, string> = {
  green:  'bg-[var(--success-mid)]',
  red:    'bg-[var(--danger-mid)]',
  amber:  'bg-[var(--warning-mid)]',
  blue:   'bg-[var(--info-mid)]',
  indigo: 'bg-accent',
  gray:   'bg-[var(--ink-tertiary)]',
}

export function Badge({ variant = 'gray', dot = true, icon, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'text-[11px] font-bold leading-none tracking-wide',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {icon
        ? <span className="flex-shrink-0 flex items-center">{icon}</span>
        : dot
        ? <span className={['w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant]].join(' ')} />
        : null}
      {children}
    </span>
  )
}
