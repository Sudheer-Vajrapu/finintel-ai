import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingClasses = { sm: 'p-3', md: 'p-4', lg: 'p-5' }

export function Card({ children, padding = 'md', hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        'bg-surface-base border border-[var(--border-subtle)] rounded-[14px]',
        paddingClasses[padding],
        hover ? 'transition-shadow duration-150 hover:shadow-sm cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
