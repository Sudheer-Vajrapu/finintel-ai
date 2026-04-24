import { Button } from './Button'
import { FolderIcon, AlertTriangleIcon, XIcon } from './Icons'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-accent mb-4"
        style={{ boxShadow: '0 0 0 6px rgba(79,70,229,0.06)' }}>
        {icon ?? <FolderIcon size={20} strokeWidth={1.8} />}
      </div>
      <h4 className="text-[15px] font-semibold text-ink-primary mb-1.5 tracking-tight">{title}</h4>
      {description && <p className="text-[13px] text-ink-secondary max-w-xs leading-relaxed">{description}</p>}
      {action && (
        <Button variant="accent-ghost" size="sm" onClick={action.onClick} className="mt-5">
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: {
  title?: string; message?: string; onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-11 h-11 rounded-2xl bg-danger-bg flex items-center justify-center text-danger-text mb-3.5"
        style={{ boxShadow: '0 0 0 5px rgba(220,38,38,0.06)' }}>
        <AlertTriangleIcon size={18} strokeWidth={2} />
      </div>
      <h4 className="text-[15px] font-semibold text-ink-primary mb-1 tracking-tight">{title}</h4>
      {message && <p className="text-[13px] text-ink-secondary max-w-xs">{message}</p>}
      {onRetry && <Button variant="ghost" size="sm" onClick={onRetry} className="mt-4">Try again</Button>}
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-danger-bg border-2 border-danger-border rounded-xl px-4 py-3 mb-4">
      <AlertTriangleIcon size={15} strokeWidth={2.5} className="text-danger-text mt-0.5 flex-shrink-0" />
      <p className="text-[13px] font-medium text-danger-text flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-danger-text/50 hover:text-danger-text transition-colors ml-1">
          <XIcon size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
