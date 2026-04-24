import { useQuery } from '@tanstack/react-query'
import type { Employee } from '../types'

interface UseEmployeesOptions {
  enabled?: boolean
}

/**
 * Stub hook for /employees endpoint
 * Returns empty data until API is implemented
 */
export function useEmployees(_range: string, options: UseEmployeesOptions = {}) {
  const { enabled = false } = options

  return useQuery<Employee[]>({
    queryKey: ['employees', _range],
    queryFn: async () => {
      // TODO: Implement when API is ready
      // const queryString = buildRangeParam(range)
      // const response = await api.get<EmployeesApiResponse>(`/employees${queryString}`)
      // return transformEmployeesResponse(response)
      return []
    },
    enabled,
    staleTime: 30_000,
  })
}
