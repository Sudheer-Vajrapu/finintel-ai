import { useQuery } from '@tanstack/react-query'
import type { Risk, Recommendation } from '../types'

interface UseRisksOptions {
  enabled?: boolean
}

interface RisksData {
  risks: Risk[]
  recommendations: Recommendation[]
}

/**
 * Stub hook for /risks endpoint
 * Returns empty data until API is implemented
 */
export function useRisks(_range: string, options: UseRisksOptions = {}) {
  const { enabled = false } = options

  return useQuery<RisksData>({
    queryKey: ['risks', _range],
    queryFn: async () => {
      // TODO: Implement when API is ready
      // const queryString = buildRangeParam(range)
      // const response = await api.get<RisksApiResponse>(`/risks${queryString}`)
      // return transformRisksResponse(response)
      return { risks: [], recommendations: [] }
    },
    enabled,
    staleTime: 30_000,
  })
}
