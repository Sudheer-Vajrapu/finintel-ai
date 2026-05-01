import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, MenuIcon, XIcon, MonitorIcon } from '../ui/Icons'

type ThemeMode = 'light' | 'dark' | 'system'

function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('theme') as ThemeMode) || 'system'
  })

  const [resolvedDark, setResolvedDark] = useState(() => {
    if (typeof window === 'undefined') return false
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return mode === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateTheme = (isDark: boolean) => {
      root.classList.add('theme-transition')
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      setResolvedDark(isDark)
      const timeout = setTimeout(() => root.classList.remove('theme-transition'), 350)
      return () => clearTimeout(timeout)
    }

    // Save preference
    localStorage.setItem('theme', mode)

    // Apply theme based on mode
    if (mode === 'system') {
      updateTheme(mediaQuery.matches)
      const handler = (e: MediaQueryListEvent) => updateTheme(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      updateTheme(mode === 'dark')
    }
  }, [mode])

  const cycleMode = () => {
    setMode(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  return { mode, setMode, cycleMode, isDark: resolvedDark }
}

export function Topbar() {
  const { mode, setMode, isDark } = useThemeMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Get icon based on current mode
  const themeIcon = mode === 'light' ? <SunIcon size={16} strokeWidth={2} /> 
    : mode === 'dark' ? <MoonIcon size={16} strokeWidth={2} />
    : <MonitorIcon size={16} strokeWidth={2} />

  return (
    <header className="px-4 pt-3 pb-2">
      {/* Floating pill navbar */}
      <nav
        className="max-w-4xl mx-auto rounded-full px-4 py-2 flex items-center justify-between transition-all duration-300"
        style={{
          background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-default)',
          boxShadow: isDark 
            ? '0 4px 24px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)' 
            : '0 4px 24px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.04)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-accent-text text-[11px] font-bold tracking-wide flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', 
              boxShadow: '0 2px 8px rgba(179,190,250,0.35)' 
            }}
          >
            FI
          </div>
          <span className="text-[15px] font-bold text-ink-primary tracking-tight hidden sm:block">
            FinIntel AI
          </span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-1">
          {/* Theme mode dropdown selector */}
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-2.5 text-ink-secondary">
              {themeIcon}
            </span>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as ThemeMode)}
              className="appearance-none h-8 pl-8 pr-3 rounded-full text-[11px] font-semibold text-ink-secondary bg-transparent hover:bg-surface-raised focus:bg-surface-raised transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-light"
              aria-label="Select theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 ml-2 mr-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-[13px] text-ink-secondary font-semibold">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all duration-200"
              >
                <LogOutIcon size={13} strokeWidth={2} />
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/login')}
                className="h-8 px-4 flex items-center justify-center rounded-full text-[12px] font-semibold text-ink-secondary hover:text-accent-text hover:bg-accent transition-all duration-200"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="h-8 px-4 flex items-center justify-center rounded-full text-[12px] font-semibold text-ink-secondary hover:text-accent-text hover:bg-accent transition-all duration-200"
              >
                Sign up
              </button>
            </div>
          )} */}
        </div>

        {/* Mobile: Theme dropdown + menu button */}
        <div className="md:hidden flex items-center gap-1">
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-2 text-ink-secondary">
              {themeIcon}
            </span>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as ThemeMode)}
              className="appearance-none w-9 h-9 pl-2 rounded-full text-transparent bg-transparent hover:bg-surface-raised transition-all duration-200 cursor-pointer focus:outline-none"
              aria-label="Select theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon size={18} strokeWidth={2} /> : <MenuIcon size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {/* <div 
        className={[
          'md:hidden mt-2 mx-auto max-w-4xl rounded-2xl p-4 transition-all duration-200 ease-out',
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none',
        ].join(' ')}
        style={{
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-default)',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0,0,0,0.4)' 
            : '0 8px 32px rgba(15,23,42,0.12)',
        }}
      >
          <div className="flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div 
                  className="flex items-center gap-3 px-3 py-2.5 animate-menu-item"
                  style={{ animationDelay: '0ms' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-[14px] text-ink-primary font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-ink-secondary hover:text-danger-mid hover:bg-danger-bg transition-all animate-menu-item"
                  style={{ animationDelay: '50ms' }}
                >
                  <LogOutIcon size={18} strokeWidth={2} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false) }}
                  className="w-full h-10 flex items-center justify-center rounded-full text-[14px] font-semibold text-ink-secondary hover:text-accent-text hover:bg-accent transition-all duration-200 animate-menu-item"
                  style={{ animationDelay: '0ms' }}
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate('/signup'); setMobileMenuOpen(false) }}
                  className="w-full h-10 flex items-center justify-center rounded-full text-[14px] font-semibold text-ink-secondary hover:text-accent-text hover:bg-accent transition-all duration-200 animate-menu-item"
                  style={{ animationDelay: '50ms' }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
      </div> */}
    </header>
  )
}
