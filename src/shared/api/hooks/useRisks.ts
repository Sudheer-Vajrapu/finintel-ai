import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformRisksResponse, buildRangeParam } from '../transforms'
import type { RisksApiResponse, RisksData } from '../types'

interface UseRisksOptions {
  enabled?: boolean
  project?: string | null
}

/**
 * Query hook for /risks-recommendations endpoint
 * Fetches and transforms risks data based on time range and optional project filter
 * 
 * API Behavior:
 * - Default (All): /risks-recommendations (no query params)
 * - With range: /risks-recommendations?range=<value>
 * - With project: /risks-recommendations?project=<project_name>
 * - Combined: /risks-recommendations?range=<value>&project=<project_name>
 */
export function useRisks(range: string, options: UseRisksOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<RisksData>({
    queryKey: ['risks', range, project],
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
      
      const response = await api.get<RisksApiResponse>(`/risks-recommendations${queryString}`)
      return transformRisksResponse(response)
    },
    enabled,
    staleTime: 30_000,
  })
}
