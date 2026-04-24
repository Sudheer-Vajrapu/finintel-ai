import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { SignupPage } from '@/features/auth/components/SignupPage'

// ─── Route guard (currently pass-through; flip isAuthenticated check to enable) ──
// import { useAuth } from '@/app/providers/AuthProvider'
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading } = useAuth()
//   if (isLoading) return <FullPageLoader />
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   return <>{children}</>
// }

export function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Main app - publicly accessible now, protect later */}
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
