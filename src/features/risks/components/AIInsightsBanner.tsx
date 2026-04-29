import { CircuitIcon } from '@/shared/components/ui/Icons'

interface AIInsightsBannerProps {
  insights: string | string[]
}

function parseInsightsToBullets(insights: string | string[]): string[] {
  // Handle array input directly
  if (Array.isArray(insights)) {
    return insights.filter(s => s && s.length > 0).slice(0, 5)
  }
  
  // Handle string input
  if (typeof insights !== 'string') {
    return []
  }
  
  // Split by common delimiters: newlines, numbered lists, or sentences
  const lines = insights
    .split(/[\n\r]+|(?:\d+\.\s)|(?:•\s)|(?:-\s)/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  // If no clear splits, try splitting by periods for sentence-based bullets
  if (lines.length <= 1 && insights.length > 100) {
    return insights
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 5) // Limit to 5 bullets
  }
  
  return lines.slice(0, 5) // Limit to 5 bullets
}

export function AIInsightsBanner({ insights }: AIInsightsBannerProps) {
  if (!insights || (Array.isArray(insights) ? insights.length === 0 : insights.length === 0)) {
    return null
  }

  const bullets = parseInsightsToBullets(insights)

  return (
    <div
      className="relative overflow-hidden rounded-[14px] mb-4 p-4"
      style={{
        background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--surface-base) 100%)',
        border: '1px solid var(--accent-border)',
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative flex items-start gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'var(--accent)',
            color: 'white',
          }}
        >
          <CircuitIcon size={16} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-semibold text-ink-primary">
              AI Insights
            </span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                background: 'var(--accent)',
                color: 'white',
              }}
            >
              Auto-generated
            </span>
          </div>

          <ul className="space-y-1.5">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-ink-secondary leading-relaxed">
                <span 
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                  style={{ background: 'var(--accent)' }}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
