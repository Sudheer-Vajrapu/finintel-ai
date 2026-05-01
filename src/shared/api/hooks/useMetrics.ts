import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformMetricsResponse, buildRangeParam } from '../transforms'
import type { MetricsApiResponse, Metrics } from '../types'

interface UseMetricsOptions {
  enabled?: boolean
}

/**
 * Query hook for /metrics endpoint
 * Fetches and transforms metrics data based on time range
 * 
 * API Behavior:
 * - Default (All): /metrics (no query params)
 * - With range: /metrics?range=<value>
 * 
 * Note: This API does not support project filtering
 */
export function useMetrics(range: string, options: UseMetricsOptions = {}) {
  const { enabled = true } = options

  return useQuery<Metrics>({
    queryKey: ['metrics', range],
    queryFn: async () => {
      const queryString = buildRangeParam(range)
      const response = await api.get<MetricsApiResponse>(`/metrics${queryString}`)
      return transformMetricsResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
