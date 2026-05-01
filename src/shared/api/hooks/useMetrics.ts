import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformMetricsResponse, buildRangeParam } from '../transforms'
import type { MetricsApiResponse, Metrics } from '../types'

interface UseMetricsOptions {
  enabled?: boolean
  project?: string | null
}

/**
 * Query hook for /metrics endpoint
 * Fetches and transforms metrics data based on time range and optional project filter
 * 
 * API Behavior:
 * - Default (All): /metrics (no query params)
 * - With range: /metrics?range=<value>
 * - With project: /metrics?project=<project_name>
 * - Combined: /metrics?range=<value>&project=<project_name>
 */
export function useMetrics(range: string, options: UseMetricsOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<Metrics>({
    queryKey: ['metrics', range, project],
    queryFn: async () => {
      // Build query params array
      const params: string[] = []
      
      // Add range param only if not "all"
      const rangeParam = buildRangeParam(range)
      if (rangeParam) {
        // Extract just the range value from "?range=X"
        params.push(rangeParam.replace('?', ''))
      }
      
      // Add project param if specified
      if (project) {
        params.push(`project=${encodeURIComponent(project)}`)
      }
      
      // Build final query string
      const queryString = params.length > 0 ? `?${params.join('&')}` : ''
      
      const response = await api.get<MetricsApiResponse>(`/metrics${queryString}`)
      return transformMetricsResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
