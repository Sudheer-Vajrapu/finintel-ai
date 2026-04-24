import React, { createContext, useCallback, useContext, useReducer } from 'react'
import { CheckIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from './Icons'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string; variant: ToastVariant; title: string; message?: string
  duration?: number; removing?: boolean
}

type Action =
  | { type: 'ADD';            toast: Toast }
  | { type: 'MARK_REMOVING';  id: string   }
  | { type: 'REMOVE';         id: string   }

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case 'ADD':           return [...state, action.toast]
    case 'MARK_REMOVING': return state.map(t => t.id === action.id ? { ...t, removing: true } : t)
    case 'REMOVE':        return state.filter(t => t.id !== action.id)
    default:              return state
  }
}

interface ToastContextValue {
  toast:   (opts: Omit<Toast, 'id' | 'removing'>) => void
  success: (title: string, message?: string) => void
  error:   (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info:    (title: string, message?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'MARK_REMOVING', id })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), 220)
  }, [])

  const toast = useCallback(({ duration = 4500, ...opts }: Omit<Toast, 'id' | 'removing'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`
    dispatch({ type: 'ADD', toast: { id, ...opts } })
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  const success = useCallback((title: string, message?: string) => toast({ variant: 'success', title, message }), [toast])
  const error   = useCallback((title: string, message?: string) => toast({ variant: 'error',   title, message }), [toast])
  const warning = useCallback((title: string, message?: string) => toast({ variant: 'warning', title, message }), [toast])
  const info    = useCallback((title: string, message?: string) => toast({ variant: 'info',    title, message }), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>')
  return ctx
}

const variantCfg: Record<ToastVariant, {
  iconBg: string; iconColor: string; bar: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}> = {
  success: { iconBg: '#F0FDF4', iconColor: '#166534', bar: '#16A34A', Icon: CheckIcon         },
  error:   { iconBg: '#FFF1F2', iconColor: '#991B1B', bar: '#DC2626', Icon: AlertCircleIcon   },
  warning: { iconBg: '#FFFBEB', iconColor: '#92400E', bar: '#D97706', Icon: AlertTriangleIcon },
  info:    { iconBg: '#EFF6FF', iconColor: '#1E40AF', bar: '#2563EB', Icon: InfoIcon           },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const cfg = variantCfg[toast.variant]

  return (
    <div
      className={[
        'flex items-start gap-3 pl-3.5 pr-3 py-3.5',
        'bg-surface-base rounded-[14px]',
        'min-w-[280px] max-w-[380px] relative overflow-hidden',
        toast.removing ? 'animate-toast-out' : 'animate-toast-in',
      ].join(' ')}
      style={{
        boxShadow: 'var(--shadow-toast)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Left color bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3.5px]" style={{ background: cfg.bar }} />

      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.iconBg, color: cfg.iconColor }}
      >
        <cfg.Icon size={14} strokeWidth={2.5} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13px] font-semibold text-ink-primary leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-[12px] text-ink-secondary mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-5 h-5 rounded flex items-center justify-center text-ink-tertiary hover:text-ink-primary hover:bg-surface-raised transition-all flex-shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <XIcon size={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}

function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
