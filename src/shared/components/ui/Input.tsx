import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-semibold text-ink-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[
            'w-full px-3.5 py-2.5 text-[14px] font-sans bg-surface-base rounded-[10px]',
            'text-ink-primary placeholder:text-ink-tertiary',
            'outline-none transition-all duration-150',
            'border-2 outline-none',
            error
              ? 'border-danger-mid ring-2 ring-danger-bg'
              : 'border-[var(--border-default)] focus:border-accent focus:ring-2 focus:ring-accent-light focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
            props.disabled ? 'opacity-40 cursor-not-allowed bg-surface-raised' : '',
            className,
          ].join(' ')}
        />
        {error && <p className="text-[12px] font-medium text-danger-text">{error}</p>}
        {hint && !error && <p className="text-[12px] text-ink-tertiary">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
