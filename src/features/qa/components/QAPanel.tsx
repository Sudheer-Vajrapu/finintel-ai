import { useRef, useState } from 'react'
import { ArrowRightIcon, AlertTriangleIcon, CircuitIcon } from '@/shared/components/ui/Icons'
import { Skeleton } from '@/shared/components/ui/Loader'
import { useAsk, getLocalAnswer } from '../hooks/useAsk'
import { QAResponseRenderer } from './QAResponseRenderer'
import type { AskResponse } from '@/shared/api/types'
import type { AnalysisResult } from '@/shared/utils'

const QUICK_QUESTIONS = [
  'Which project is at risk?',
  'Who is overloaded?',
  'What is the highest margin project?',
  'Give me a summary',
]

function LoadingSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#C7D2FE' }}
      >
        <CircuitIcon size={12} strokeWidth={2} className="text-indigo-600" />
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton height={12} width="75%" />
        <Skeleton height={12} width="50%" />
        <Skeleton height={12} width="85%" />
      </div>
    </div>
  )
}

// ── Error state (req #7) ────────────────────────────────────────────────────
// Light red background · dark red text · warning icon · error-pop animation
function AIErrorState({ message }: { message: string }) {
  return (
    <div
      className="rounded-[14px] p-4 mb-4 animate-error-pop"
      style={{
        background: 'var(--danger-bg)',
        border: '2px solid var(--danger-border)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Warning icon badge */}
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'var(--danger-bold)', color: '#fff' }}
        >
          <AlertTriangleIcon size={15} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[var(--danger-bold)] leading-tight mb-0.5">
            AI unavailable
          </p>
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--danger-text)' }}>
            {message}
          </p>
          <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'var(--danger-text)', opacity: 0.75 }}>
            Check your connection or try again in a moment.
          </p>
        </div>
      </div>
    </div>
  )
}

export function QAPanel({ localData }: { localData?: AnalysisResult | null }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<AskResponse | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: ask, isPending, isError, error } = useAsk()

  const handleAsk = (q?: string) => {
    const question = (q ?? query).trim()
    if (!question) return
    setQuery(question)
    setResponse(null)
    ask(
      { query: question },
      {
        onSuccess: data => setResponse(data),
        onError: () => {
          if (localData) {
            setResponse({ answer: getLocalAnswer(question, localData) })
          }
        },
      },
    )
  }

  const showApiError = isError && !response && !localData
  const errMsg = error instanceof Error ? error.message : 'Could not reach the AI service.'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border-subtle)]">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#C7D2FE' }}
        >
          <CircuitIcon size={18} strokeWidth={2} className="text-indigo-600" />
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed flex-1">
          Ask questions about your projects, employees, margins, or risks. 
          Get instant insights, trends, and forecasts powered by AI analysis of your financial data.
        </p>
      </div>

      {/* Input row - stacked on mobile, inline on desktop */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="e.g. Which project has the highest margin?"
          className={[
            'flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-[13px] sm:text-[14px] font-sans bg-surface-base',
            'border-2 border-[var(--border-default)] rounded-[10px] text-ink-primary',
            'placeholder:text-ink-tertiary outline-none',
            'transition-all focus:border-accent focus:ring-2 focus:ring-[var(--accent-light)]',
          ].join(' ')}
        />
        <button
          onClick={() => handleAsk()}
          disabled={isPending || !query.trim()}
          className="ask-btn px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Ask
              <ArrowRightIcon size={14} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>

      {/* Error state — req #7 */}
      {showApiError && <AIErrorState message={errMsg} />}

      {/* Answer area — only shown when NOT an error */}
      {!showApiError && (isPending || response) && (
        <div
          className="rounded-[14px] p-4 mb-4 min-h-[80px] animate-fade-in"
          style={{
            background: 'var(--accent-light)',
            border: '2px solid var(--accent-border)',
          }}
        >
          {isPending ? (
            <LoadingSkeleton />
          ) : (
            response && (
              <QAResponseRenderer
                response={response}
                isTyping={response.visual_type !== 'table'}
              />
            )
          )}
        </div>
      )}

      {/* Quick questions - 2-column grid on mobile, flex-wrap on desktop */}
      <div>
        <p className="text-[10px] sm:text-[11px] font-semibold text-ink-tertiary uppercase tracking-[0.5px] mb-2">
          Quick questions
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); handleAsk(q) }}
              disabled={isPending}
              className={[
                'px-2.5 py-1.5 sm:px-3.5 rounded-full text-[11px] sm:text-[12px] font-semibold text-left',
                'bg-surface-base border-2 border-[var(--border-default)] text-ink-secondary',
                'hover:border-accent hover:text-ink-primary hover:bg-accent',
                'dark:hover:text-accent-text',
                'transition-all duration-150 disabled:opacity-40',
              ].join(' ')}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
