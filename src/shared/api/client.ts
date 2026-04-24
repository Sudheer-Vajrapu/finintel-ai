// ─── API Configuration ────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// ─── Token management ─────────────────────────────────────────────────────────
const TOKEN_KEY = 'finintel_token'

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

// ─── Error types ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed. Check your connection.') {
    super(message)
    this.name = 'NetworkError'
  }
}

// ─── Request options ──────────────────────────────────────────────────────────
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /**
   * Set true to skip attaching the Authorization header entirely.
   * Use for auth endpoints (login/signup) and any endpoint that
   * doesn't require a JWT yet (e.g. /upload during early dev).
   */
  skipAuth?: boolean
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, skipAuth = false, headers: extraHeaders = {}, ...rest } = options

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  }

  // Only attach JWT when: not skipped AND a token actually exists.
  // This prevents sending "Authorization: Bearer null" to the backend.
  if (!skipAuth) {
    const token = tokenStore.get()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    // No token → no header. Backend treats request as unauthenticated.
  }

  // Auto-set Content-Type for JSON bodies only (not FormData — let browser set boundary).
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const requestInit: RequestInit = {
    ...rest,
    headers,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, requestInit)
  } catch {
    throw new NetworkError()
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T
  }

  // Parse response body
  const contentType = response.headers.get('content-type') ?? ''
  let data: unknown
  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'detail' in data
        ? String((data as { detail: string }).detail)
        : `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, data)
  }

  return data as T
}

// ─── Convenience methods ──────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<ApiFetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),

  /**
   * Multipart file upload. FormData body — browser sets Content-Type + boundary.
   * skipAuth defaults to true so no JWT header is sent until backend requires it.
   */
  upload: <T>(
    path: string,
    formData: FormData,
    options?: Omit<ApiFetchOptions, 'method' | 'body'>,
  ) =>
    apiFetch<T>(path, {
      skipAuth: true,   // ← No JWT until backend implements auth
      ...options,
      method: 'POST',
      body: formData,
    }),
}
