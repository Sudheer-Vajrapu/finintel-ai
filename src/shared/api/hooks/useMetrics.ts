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
 */
export function useMetrics(range: string, options: UseMetricsOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<Metrics>({
    queryKey: ['metrics', range, project],
    queryFn: async () => {
      // Build query string with range and optional project filter
      let queryString = buildRangeParam(range)
      
      if (project) {
        const separator = queryString ? '&' : '?'
        queryString += `${separator}project=${encodeURIComponent(project)}`
      }
      
      const response = await api.get<MetricsApiResponse>(`/metrics${queryString}`)
      return transformMetricsResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
