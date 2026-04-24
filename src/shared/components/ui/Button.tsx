import React from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'accent-ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-text border border-transparent hover:bg-accent-hover active:scale-[0.98] shadow-sm focus-visible:ring-2 focus-visible:ring-accent-dark focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base dark:bg-surface-raised dark:text-accent dark:border-accent-border dark:hover:bg-surface-sunken',
  ghost:
    'bg-transparent text-ink-secondary border border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary hover:border-[var(--border-strong)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
  'accent-ghost':
    'bg-accent-light text-accent-text border border-accent-border hover:bg-accent hover:text-accent-text active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base dark:text-accent dark:hover:bg-accent-light',
  danger:
    'bg-danger-bg text-danger-text border border-danger-border hover:opacity-85 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-danger-mid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-[12px] px-3 py-1.5 rounded-full gap-1.5',
  md: 'text-[13px] px-4 py-2 rounded-full gap-2',
  lg: 'text-[14px] px-5 py-2.5 rounded-full gap-2',
}

export function Button({
  variant = 'ghost', size = 'md', loading = false,
  disabled, className = '', children, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center font-semibold font-sans cursor-pointer outline-none',
        'tracking-tight transition-all duration-150 leading-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ].join(' ')}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </>
      ) : children}
    </button>
  )
}
