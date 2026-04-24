import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuthMutations'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { ErrorBanner } from '@/shared/components/ui/EmptyState'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, error } = useLogin()

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); login({ email, password }) }
  const errorMessage = error instanceof Error ? error.message : error ? 'Login failed' : null

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white text-[13px] font-bold mx-auto mb-3">
            FI
          </div>
          <h1 className="font-serif text-[22px] text-ink-primary mb-1">Welcome back</h1>
          <p className="text-[13px] text-ink-secondary">Sign in to FinIntel AI</p>
        </div>

        <div className="bg-surface-base border border-[var(--border-default)] rounded-[16px] p-6">
          {errorMessage && <ErrorBanner message={errorMessage} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email"    type="email"    placeholder="you@company.com" value={email}    onChange={e => setEmail(e.target.value)}    required autoComplete="email" />
            <Input label="Password" type="password" placeholder="••••••••"        value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full justify-center mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-ink-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ink-primary font-semibold underline underline-offset-2">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
