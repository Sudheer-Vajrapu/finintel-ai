import { useEffect, useState } from 'react'
import { CircuitIcon } from '@/shared/components/ui/Icons'
import type { AskResponse } from '@/shared/api/types'

interface QAResponseRendererProps {
  response: AskResponse
  isTyping?: boolean
  typingSpeed?: number
}

function useTypingEffect(text: string, enabled: boolean, speed = 10) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setDone(false)
      return
    }
    if (!enabled) {
      setDisplayed(text)
      setDone(true)
      return
    }
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, enabled, speed])

  return { displayed, done }
}

function ResponseIcon() {
  return (
    <div
      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
    >
      <CircuitIcon size={12} strokeWidth={2} className="text-white" />
    </div>
  )
}

function TextResponse({ text, typing, speed }: { text: string; typing: boolean; speed: number }) {
  const { displayed, done } = useTypingEffect(text, typing, speed)

  return (
    <div className="flex items-start gap-3">
      <ResponseIcon />
      <p className="text-[14px] text-ink-primary leading-[1.75] flex-1">
        {displayed}
        {!done && (
          <span className="inline-block w-0.5 h-[15px] bg-accent ml-0.5 align-middle animate-pulse" />
        )}
      </p>
    </div>
  )
}

type TableData = (string | number | null)[][] | Record<string, string | number | null>[]

function normalizeTableData(columns: string[], data: TableData): (string | number | null)[][] {
  if (!data || data.length === 0) return []
  const firstRow = data[0]
  // Already a 2D array
  if (Array.isArray(firstRow)) {
    return data as (string | number | null)[][]
  }
  // Array of objects — map to 2D array using columns
  return (data as Record<string, string | number | null>[]).map(row =>
    columns.map(col => row[col] ?? null)
  )
}

function TableResponse({ summary, columns, data }: { summary: string; columns: string[]; data: TableData }) {
  const normalizedData = normalizeTableData(columns, data)
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <ResponseIcon />
        <p className="text-[14px] text-ink-primary font-medium leading-[1.5]">{summary}</p>
      </div>
      {columns.length > 0 && normalizedData.length > 0 && (
        <div className="overflow-x-auto ml-9">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="text-left py-2 px-3 font-semibold text-ink-secondary bg-surface-raised first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-surface-raised/50 transition-colors"
                >
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="py-2 px-3 text-ink-primary">
                      {cell ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(columns.length === 0 || normalizedData.length === 0) && (
        <p className="text-[13px] text-ink-tertiary ml-9">No data available.</p>
      )}
    </div>
  )
}

export function QAResponseRenderer({ response, isTyping = true, typingSpeed = 10 }: QAResponseRendererProps) {
  const visualType = response.visual_type ?? 'text'
  const displayText = response.summary ?? response.answer

  if (visualType === 'table') {
    return (
      <TableResponse
        summary={displayText}
        columns={response.columns ?? []}
        data={response.data ?? []}
      />
    )
  }

  return <TextResponse text={displayText} typing={isTyping} speed={typingSpeed} />
}
