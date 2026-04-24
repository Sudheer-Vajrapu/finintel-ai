import { useRef, useState } from 'react'
import { useToast } from '@/shared/components/ui/Toast'
import { UploadIcon, TrashIcon, CheckCircleIcon, FileTypeIcon } from '@/shared/components/ui/Icons'

// ─── Constants ────────────────────────────────────────────────────────────────
export const ALLOWED_EXTENSIONS = ['csv', 'xls', 'xlsx', 'txt'] as const
export const ACCEPTED_FILE_TYPES = ALLOWED_EXTENSIONS.map(e => `.${e}`).join(',')

function getExt(name: string): string {
  return (name.split('.').pop() ?? '').toLowerCase()
}

function isAllowed(name: string): boolean {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(getExt(name))
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1_048_576) return `${Math.round(bytes / 1024)}KB`
  return `${(bytes / 1_048_576).toFixed(1)}MB`
}

function truncateMiddle(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  const ext = str.lastIndexOf('.') > 0 ? str.slice(str.lastIndexOf('.')) : ''
  const name = str.slice(0, str.length - ext.length)
  const available = maxLen - ext.length - 3 // 3 for '...'
  if (available < 4) return str.slice(0, maxLen - 3) + '...'
  const front = Math.ceil(available / 2)
  const back = Math.floor(available / 2)
  return name.slice(0, front) + '...' + name.slice(-back) + ext
}

// ─── Component ────────────────────────────────────────────────────────────────
interface DropZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function DropZone({ files, onFilesChange }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [blinking, setBlinking] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const { warning, success } = useToast()

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
    inputRef.current?.click()
  }

  const triggerBlink = (name: string) => {
    setBlinking(prev => new Set(prev).add(name))
    setTimeout(() => setBlinking(prev => { const n = new Set(prev); n.delete(name); return n }), 1150)
  }

  const processFiles = (incoming: File[]) => {
    const rejected: string[] = []
    const dupes: string[] = []
    const toAdd: File[] = []

    incoming.forEach(f => {
      if (!isAllowed(f.name)) { rejected.push(f.name); return }
      if (files.some(x => x.name === f.name)) { dupes.push(f.name); triggerBlink(f.name); return }
      toAdd.push(f)
    })

    rejected.forEach(name => {
      warning('Unsupported file type', `"${name}" — .${getExt(name)} is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`)
    })

    if (dupes.length > 0) {
      warning(
        `Duplicate file${dupes.length > 1 ? 's' : ''} skipped`,
        dupes.length === 1
          ? `"${dupes[0]}" is already in your list`
          : `${dupes.length} files are already in your list`,
      )
    }

    if (toAdd.length > 0) {
      onFilesChange([...files, ...toAdd])
      success(`${toAdd.length} file${toAdd.length > 1 ? 's' : ''} added`, 'Ready to analyze')
    }
  }

  return (
    <div>
      {/* Drop zone — fixed height to match textarea (280px) */}
      <div
        className={[
          'relative rounded-xl p-8 text-center cursor-pointer h-[280px] flex flex-col items-center justify-center',
          'bg-surface-base transition-all duration-200 select-none',
          isDragging
            ? 'border-2 border-solid border-accent bg-accent-light scale-[1.02] shadow-md'
            : 'border-[1.5px] border-dashed border-[var(--border-strong)] hover:border-accent hover:bg-surface-raised',
        ].join(' ')}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); processFiles(Array.from(e.dataTransfer.files)) }}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          onChange={e => { processFiles(Array.from(e.target.files ?? [])); if (inputRef.current) inputRef.current.value = '' }}
          className="hidden"
        />

        <div 
          className={[
            'w-12 h-12 bg-surface-raised border border-[var(--border-default)] rounded-xl flex items-center justify-center mb-3.5 pointer-events-none',
            'transition-all duration-200',
            isDragging ? 'scale-110 bg-accent text-accent-text border-accent animate-pulse' : '',
            isClicked ? 'scale-90 bg-accent text-accent-text border-accent' : 'text-ink-secondary',
          ].join(' ')}
        >
          <UploadIcon size={22} strokeWidth={1.6} />
        </div>
        <p className="text-[15px] font-semibold text-ink-primary mb-1.5 tracking-tight pointer-events-none">
          {isDragging ? 'Drop to upload' : 'Drop your files here'}
        </p>
        <p className="text-[13px] text-ink-secondary pointer-events-none">
          {isDragging ? 'Release to add files' : 'or click to browse from your computer'}
        </p>
        <div className="flex gap-1.5 justify-center flex-wrap mt-3 pointer-events-none">
          {ALLOWED_EXTENSIONS.map(ext => (
            <span key={ext} className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-surface-raised border border-[var(--border-default)] rounded-full text-ink-tertiary tracking-wide">
              {ext}
            </span>
          ))}
        </div>
      </div>

      {/* File list - row-based layout with max height */}
      {files.length > 0 && (
        <div className="mt-4 border border-[var(--border-default)] rounded-xl overflow-hidden bg-surface-base">
          <div className="max-h-64 overflow-y-auto">
            {files.map((f, idx) => (
              <div
                key={f.name}
                className={[
                  'flex items-center gap-3 px-3 py-2.5',
                  'transition-all duration-150',
                  idx !== files.length - 1 ? 'border-b border-[var(--border-subtle)]' : '',
                  blinking.has(f.name) ? 'animate-dup-blink bg-warning-bg' : 'hover:bg-surface-raised',
                ].join(' ')}
              >
                {/* File type icon */}
                <FileTypeIcon ext={getExt(f.name)} size={14} />
                
                {/* Filename with middle truncation */}
                <span 
                  className="flex-1 text-[13px] font-medium text-ink-primary truncate" 
                  title={f.name}
                >
                  {truncateMiddle(f.name, 32)}
                </span>
                
                {/* File size */}
                <span className="text-[11px] text-ink-tertiary font-medium flex-shrink-0 tabular-nums">
                  {fmtSize(f.size)}
                </span>
                
                {/* Status indicator */}
                <div className="flex-shrink-0 text-success-mid">
                  <CheckCircleIcon size={14} strokeWidth={2} />
                </div>
                
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); onFilesChange(files.filter(x => x.name !== f.name)) }}
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-ink-tertiary hover:text-danger-mid hover:bg-danger-bg transition-all"
                  aria-label={`Remove ${f.name}`}
                >
                  <TrashIcon size={14} strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
          
          {/* File count footer */}
          <div className="px-3 py-2 bg-surface-raised border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[11px] font-medium text-ink-secondary">
              {files.length} file{files.length !== 1 ? 's' : ''} ready
            </span>
            <button
              onClick={() => onFilesChange([])}
              className="text-[11px] font-medium text-ink-tertiary hover:text-danger-mid transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
