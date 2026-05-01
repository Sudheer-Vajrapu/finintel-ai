import { useState, useRef } from 'react'
import { DropZone } from './DropZone'
import { Button } from '@/shared/components/ui/Button'
import { ErrorBanner } from '@/shared/components/ui/EmptyState'
import { ArrowRightIcon, InfoIcon, UploadIcon, FileTextIcon, TrashIcon, AlertTriangleIcon } from '@/shared/components/ui/Icons'
import { useToast } from '@/shared/components/ui/Toast'
import { useResetDataset } from '@/shared/api/hooks'
import { isValidCSV } from '@/shared/utils'

type InputMode = 'upload' | 'paste'

interface UploadSectionProps {
  onAnalyze: (csvText: string, files: File[]) => void
  isLoading?: boolean
}

export function UploadSection({ onAnalyze, isLoading = false }: UploadSectionProps) {
  const [mode, setMode]           = useState<InputMode>('upload')
  const [files, setFiles]         = useState<File[]>([])
  const [csvText, setCsvText]     = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const { success: toastSuccess, error: toastError } = useToast()
  const { mutate: resetDataset, isPending: isResetting } = useResetDataset()
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode)
    setError(null)
    // Clear the other input when switching modes (mutual exclusivity)
    if (newMode === 'upload') {
      setCsvText('')
    } else {
      setFiles([])
    }
  }

  const handleResetData = () => {
    resetDataset(undefined, {
      onSuccess: () => {
        toastSuccess('Data reset', 'All existing data has been cleared')
      },
      onError: (err: Error) => {
        const msg = err instanceof Error ? err.message : 'Failed to reset data'
        toastError('Reset failed', msg)
      },
    })
  }

  const handleAnalyze = () => {
    // Trigger click animation
    setIsButtonClicked(true)
    setTimeout(() => setIsButtonClicked(false), 200)

    const hasFiles = files.length > 0
    const hasCsv   = csvText.trim().length > 0

    // Must have data based on current mode
    if (mode === 'upload' && !hasFiles) {
      setError('Please upload at least one file before analyzing.')
      return
    }
    if (mode === 'paste' && !hasCsv) {
      setError('Please paste CSV data before analyzing.')
      return
    }

    // Validate CSV format when in paste mode
    if (mode === 'paste' && !isValidCSV(csvText)) {
      setError(
        'CSV format not recognized. Required columns: employee, project, month, year, hours, billing_rate, cost_rate',
      )
      return
    }

    setError(null)
    onAnalyze(mode === 'paste' ? csvText : '', mode === 'upload' ? files : [])
  }

  const hasData = mode === 'upload' ? files.length > 0 : csvText.trim().length > 0

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center px-4">
      <div className="max-w-xl mx-auto w-full">
        {/* Page header — stronger typography */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold leading-tight text-ink-primary mb-3 tracking-tight">
            Financial Intelligence
          </h1>
          <p className="text-[15px] text-ink-secondary leading-relaxed">
            Upload or paste your financial data to get started
          </p>
        </div>

        {/* Main card container */}
        <div 
          className="bg-surface-base rounded-2xl border border-[var(--border-default)] p-6 md:p-8"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {/* Required columns callout */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-light border border-accent-border mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <InfoIcon size={16} className="text-accent-text" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-ink-primary mb-0.5">Required columns</p>
              <p className="text-[11px] text-ink-secondary font-mono truncate">
                employee, project, month, year, hours, billing_rate, cost_rate
              </p>
            </div>
          </div>

          {/* Segmented control tabs */}
          <div className="flex justify-center mb-6">
            <div className={[
              'inline-flex p-1 bg-surface-raised rounded-full border border-[var(--border-default)]',
              isLoading ? 'opacity-60' : '',
            ].join(' ')}>
              <button
                onClick={() => handleModeChange('upload')}
                disabled={isLoading}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors duration-200',
                  mode === 'upload'
                    ? 'bg-accent text-accent-text shadow-sm dark:bg-surface-base dark:text-accent dark:border dark:border-accent-border'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-[var(--surface-base)]',
                  isLoading ? 'cursor-not-allowed' : '',
                ].join(' ')}
              >
                <UploadIcon size={14} strokeWidth={2} />
                Upload Files
              </button>
              <button
                onClick={() => handleModeChange('paste')}
                disabled={isLoading}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors duration-200',
                  mode === 'paste'
                    ? 'bg-accent text-accent-text shadow-sm dark:bg-surface-base dark:text-accent dark:border dark:border-accent-border'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-[var(--surface-base)]',
                  isLoading ? 'cursor-not-allowed' : '',
                ].join(' ')}
              >
                <FileTextIcon size={14} strokeWidth={2} />
                Raw Input
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {/* Tab content with smooth transitions */}
          <div className="min-h-[280px] relative overflow-hidden">
            <div 
              className={[
                'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                mode === 'upload' 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 -translate-x-8 scale-95 absolute inset-0 pointer-events-none',
              ].join(' ')}
            >
              <DropZone files={files} onFilesChange={setFiles} disabled={isLoading} />
            </div>
            <div 
              className={[
                'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                mode === 'paste' 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 translate-x-8 scale-95 absolute inset-0 pointer-events-none',
              ].join(' ')}
            >
              {/* Disabled state with work in progress message */}
              <div 
                className={[
                  'w-full h-[280px] flex flex-col items-center justify-center gap-3',
                  'border border-[var(--border-default)] rounded-xl bg-surface-raised',
                ].join(' ')}
              >
                <div className="w-12 h-12 rounded-full bg-warning-bg flex items-center justify-center">
                  <AlertTriangleIcon size={24} strokeWidth={2} className="text-warning-text" />
                </div>
                <p className="text-[14px] font-semibold text-ink-secondary">Work in progress</p>
                <p className="text-[12px] text-ink-tertiary">This feature is coming soon</p>
              </div>
            </div>
          </div>

          {/* Analyze button — full width, prominent with click feedback */}
          <div className="mt-6" ref={buttonRef}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              loading={isLoading}
              disabled={isLoading || !hasData}
              className={[
                'w-full justify-center text-[15px] py-3 transition-all duration-200',
                'hover:scale-[1.01] hover:shadow-lg',
                isButtonClicked ? 'scale-[0.98] shadow-inner' : '',
              ].join(' ')}
            >
              {isLoading ? 'Analyzing…' : 'Analyze Data'}
              {!isLoading && <ArrowRightIcon size={16} strokeWidth={2.5} />}
            </Button>
          </div>

          {/* Reset Data button — matches Analyze button styling */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleResetData}
              loading={isResetting}
              disabled={isLoading || isResetting}
              className={[
                'w-full justify-center text-[15px] py-3 transition-all duration-200',
                'hover:scale-[1.01] hover:shadow-lg',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
              ].join(' ')}
            >
              <TrashIcon size={16} strokeWidth={2.5} />
              {isResetting ? 'Resetting…' : 'Reset Data'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
