/**
 * Icons — inline SVG, no external dependency.
 * All icons are 16×16 by default, strokeWidth 1.8 for optical balance.
 * Pass size prop to override. Stroke color inherits from `currentColor`.
 */

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

const base = (
  d: string,
  { size = 16, className = '', strokeWidth = 1.8 }: IconProps = {},
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* biome-ignore lint: SVG path injection is safe here */}
    <g dangerouslySetInnerHTML={{ __html: d }} />
  </svg>
)

export const UploadIcon       = (p: IconProps) => base('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>', p)
export const DownloadIcon     = (p: IconProps) => base('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>', p)
export const FileIcon         = (p: IconProps) => base('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>', p)
export const FileTextIcon     = (p: IconProps) => base('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>', p)
export const TableIcon        = (p: IconProps) => base('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>', p)
export const FolderIcon       = (p: IconProps) => base('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>', p)
export const XIcon            = (p: IconProps) => base('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', p)
export const ChevronRightIcon = (p: IconProps) => base('<polyline points="9 18 15 12 9 6"/>', p)
export const ChevronLeftIcon  = (p: IconProps) => base('<polyline points="15 18 9 12 15 6"/>', p)
export const ArrowRightIcon   = (p: IconProps) => base('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', p)
export const CheckIcon        = (p: IconProps) => base('<polyline points="20 6 9 17 4 12"/>', p)
export const AlertCircleIcon  = (p: IconProps) => base('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', p)
export const AlertTriangleIcon= (p: IconProps) => base('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', p)
export const InfoIcon         = (p: IconProps) => base('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>', p)
export const TrendingUpIcon   = (p: IconProps) => base('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', p)
export const TrendingDownIcon = (p: IconProps) => base('<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>', p)
export const MinusIcon        = (p: IconProps) => base('<line x1="5" y1="12" x2="19" y2="12"/>', p)
export const LogOutIcon       = (p: IconProps) => base('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', p)
export const SparklesIcon     = (p: IconProps) => base('<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/>', p)
export const SunIcon          = (p: IconProps) => base('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>', p)
export const MoonIcon         = (p: IconProps) => base('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>', p)
export const MonitorIcon      = (p: IconProps) => base('<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', p)
export const TrashIcon        = (p: IconProps) => base('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>', p)
export const CheckCircleIcon  = (p: IconProps) => base('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', p)
export const MenuIcon         = (p: IconProps) => base('<line x1="4" y1="12" x2="20" y2="12" stroke-linecap="round"/><line x1="4" y1="6" x2="20" y2="6" stroke-linecap="round"/><line x1="4" y1="18" x2="20" y2="18" stroke-linecap="round"/>', p)
export const ChevronDownIcon  = (p: IconProps) => base('<polyline points="6 9 12 15 18 9"/>', p)
export const UsersIcon        = (p: IconProps) => base('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', p)
export const ArrowUpIcon      = (p: IconProps) => base('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>', p)
export const UserIcon         = (p: IconProps) => base('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', p)
export const CalendarIcon     = (p: IconProps) => base('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', p)
export const TargetIcon       = (p: IconProps) => base('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', p)
export const ClockIcon        = (p: IconProps) => base('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', p)
export const StarIcon         = (p: IconProps) => base('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', p)
export const AwardIcon        = (p: IconProps) => base('<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>', p)
export const BriefcaseIcon    = (p: IconProps) => base('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', p)
export const BrainIcon        = (p: IconProps) => base('<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>', p)
export const CircuitIcon      = (p: IconProps) => base('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>', p)

// ── File-type specific icons ───────────────────────────────────────────────
export function FileTypeIcon({ ext, size = 14 }: { ext: string; size?: number }) {
  const extConfig: Record<string, { icon: (p: IconProps) => JSX.Element; bg: string; color: string }> = {
    csv:  { icon: TableIcon,    bg: '#EBF5EE', color: '#2E6B3E' },
    xlsx: { icon: TableIcon,    bg: '#EBF5EE', color: '#2E6B3E' },
    xls:  { icon: TableIcon,    bg: '#EBF5EE', color: '#2E6B3E' },
    pdf:  { icon: FileIcon,     bg: '#FBF0EE', color: '#B03A2E' },
    docx: { icon: FileTextIcon, bg: '#EBF2FB', color: '#1B4F8A' },
    doc:  { icon: FileTextIcon, bg: '#EBF2FB', color: '#1B4F8A' },
    txt:  { icon: FileIcon,     bg: '#F7F6F2', color: '#6B6760' },
  }
  const cfg = extConfig[ext.toLowerCase()] ?? { icon: FileIcon, bg: '#F0EEE9', color: '#6B6760' }
  const IconComponent = cfg.icon

  return (
    <div
      className="rounded flex items-center justify-center flex-shrink-0"
      style={{ width: size + 8, height: size + 8, background: cfg.bg, color: cfg.color }}
    >
      <IconComponent size={size} strokeWidth={2} />
    </div>
  )
}
