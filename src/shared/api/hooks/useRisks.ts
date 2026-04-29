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
 */
export function useRisks(range: string, options: UseRisksOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<RisksData>({
    queryKey: ['risks', range, project],
    queryFn: async () => {
      let queryString = buildRangeParam(range)
      if (project) {
        queryString += `&project=${encodeURIComponent(project)}`
      }
      const response = await api.get<RisksApiResponse>(`/risks-recommendations${queryString}`)
      return transformRisksResponse(response)
    },
    enabled,
    staleTime: 30_000,
  })
}
