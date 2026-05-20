import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, XIcon, FilterIcon } from '@/shared/components/ui/Icons'
import type { Project } from '@/shared/api/types'

interface ProjectFilterDropdownProps {
  projects: Project[]
  selectedProject: string | null
  onProjectChange: (project: string | null) => void
  isLoading?: boolean
}

export function ProjectFilterDropdown({
  projects,
  selectedProject,
  onProjectChange,
  isLoading = false,
}: ProjectFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (projectName: string | null) => {
    onProjectChange(projectName)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={[
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium',
          'border transition-all duration-150 cursor-pointer',
          selectedProject
            ? 'bg-accent/10 text-ink-primary border-accent/30 dark:bg-accent/20 dark:border-accent/40'
            : 'bg-surface-base text-ink-secondary border-[var(--border-default)] hover:bg-surface-raised hover:text-ink-primary',
          isLoading ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
        aria-label="Filter by project"
      >
        <FilterIcon size={14} strokeWidth={2} className="flex-shrink-0" />
        <span className="truncate max-w-[140px]">
          {selectedProject || 'All Projects'}
        </span>
        {selectedProject ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleSelect(null)
            }}
            className="p-0.5 rounded-full hover:bg-accent/20 transition-colors"
            aria-label="Clear project filter"
          >
            <XIcon size={10} strokeWidth={2.5} />
          </button>
        ) : (
          <ChevronDownIcon
            size={12}
            strokeWidth={2}
            className={[
              'transition-transform duration-200',
              isOpen ? 'rotate-180' : '',
            ].join(' ')}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={[
            'absolute top-full left-0 mt-1 z-50 min-w-[200px] max-w-[280px]',
            'bg-surface-base border border-[var(--border-default)] rounded-lg shadow-lg',
            'overflow-hidden',
          ].join(' ')}
        >
          <div className="p-2 border-b border-[var(--border-subtle)]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className={[
                'w-full px-2.5 py-1.5 text-[12px] rounded-md',
                'bg-surface-sunken border border-[var(--border-subtle)]',
                'text-ink-primary placeholder:text-ink-tertiary',
                'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
              ].join(' ')}
            />
          </div>

          <div className="max-h-[240px] overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={[
                'w-full text-left px-3 py-2 text-[12px] transition-colors',
                !selectedProject
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-ink-secondary hover:bg-surface-raised hover:text-ink-primary',
              ].join(' ')}
            >
              All Projects
            </button>

            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleSelect(project.name)}
                  className={[
                    'w-full text-left px-3 py-2 text-[12px] transition-colors',
                    selectedProject === project.name
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-ink-secondary hover:bg-surface-raised hover:text-ink-primary',
                  ].join(' ')}
                >
                  <span className="block truncate">{project.name}</span>
                  <span className="text-[10px] text-ink-tertiary">
                    {project.status}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-[11px] text-ink-tertiary text-center">
                No projects found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
