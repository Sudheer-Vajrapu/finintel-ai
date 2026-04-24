import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/shared/api/client'
import { useAuth } from '@/app/providers/AuthProvider'
import type { LoginRequest, SignupRequest, AuthResponse } from '@/shared/api/types'

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      api.post<AuthResponse>('/auth/login', data, { skipAuth: true }),
    onSuccess: (data) => {
      login(data.access_token, data.user)
      navigate('/')
    },
  })
}

export function useSignup() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: SignupRequest) =>
      api.post<AuthResponse>('/auth/signup', data, { skipAuth: true }),
    onSuccess: (data) => {
      login(data.access_token, data.user)
      navigate('/')
    },
  })
}
