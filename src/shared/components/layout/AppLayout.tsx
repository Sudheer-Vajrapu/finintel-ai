import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-page">
      <Topbar />
      <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-4 sm:py-7">
        <Outlet />
      </main>
    </div>
  )
}
