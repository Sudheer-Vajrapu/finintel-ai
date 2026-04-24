import React, { createContext, useContext, useState } from 'react'

interface TabsContextValue { activeTab: string; setActiveTab: (id: string) => void }
const TabsContext = createContext<TabsContextValue | null>(null)
function useTabsCtx() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab components must be inside <Tabs>')
  return ctx
}

export function Tabs({ defaultTab, children, onChange }: {
  defaultTab: string; children: React.ReactNode; onChange?: (t: string) => void
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const handleChange = (id: string) => { setActiveTab(id); onChange?.(id) }
  return <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>{children}</TabsContext.Provider>
}

export function TabList({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex mb-3 sm:mb-5"
      style={{ borderBottom: '2px solid var(--border-default)' }}
    >
      {children}
    </div>
  )
}

export function TabTrigger({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabsCtx()
  const active = activeTab === id
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={[
        'px-3 py-2 sm:px-4 sm:py-2.5 text-[12px] sm:text-[13px] font-bold font-sans cursor-pointer outline-none whitespace-nowrap',
        'border-b-2 -mb-[2px] transition-all duration-150 tracking-tight',
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page rounded-t-md',
        active
          ? 'text-ink-primary border-accent dark:text-accent'
          : 'text-ink-tertiary border-transparent hover:text-ink-secondary hover:border-[var(--border-default)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab } = useTabsCtx()
  const isActive = activeTab === id
  
  return (
    <div 
      className={[
        'transition-all duration-200 ease-out',
        isActive 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2 absolute pointer-events-none h-0 overflow-hidden',
      ].join(' ')}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  )
}
