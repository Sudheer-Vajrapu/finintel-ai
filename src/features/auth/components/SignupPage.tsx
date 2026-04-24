import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSignup } from '../hooks/useAuthMutations'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { ErrorBanner } from '@/shared/components/ui/EmptyState'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: signup, isPending, error } = useSignup()

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); signup({ name, email, password }) }
  const errorMessage = error instanceof Error ? error.message : error ? 'Signup failed' : null

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white text-[13px] font-bold mx-auto mb-3">
            FI
          </div>
          <h1 className="font-serif text-[22px] text-ink-primary mb-1">Create your account</h1>
          <p className="text-[13px] text-ink-secondary">Get started with FinIntel AI</p>
        </div>

        <div className="bg-surface-base border border-[var(--border-default)] rounded-[16px] p-6">
          {errorMessage && <ErrorBanner message={errorMessage} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" type="text"     placeholder="Jane Smith"        value={name}     onChange={e => setName(e.target.value)}     required autoComplete="name" />
            <Input label="Email"     type="email"    placeholder="you@company.com"   value={email}    onChange={e => setEmail(e.target.value)}    required autoComplete="email" />
            <Input label="Password"  type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" hint="At least 8 characters" />
            <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full justify-center mt-1">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-ink-secondary mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-ink-primary font-semibold underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
