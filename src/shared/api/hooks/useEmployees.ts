import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformEmployeesResponse, buildRangeParam } from '../transforms'
import type { EmployeesApiResponse, Employee } from '../types'

interface UseEmployeesOptions {
  enabled?: boolean
  project?: string | null
}

/**
 * Query hook for /employees endpoint
 * Fetches and transforms employees data based on time range and optional project filter
 */
export function useEmployees(range: string, options: UseEmployeesOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<Employee[]>({
    queryKey: ['employees', range, project],
    queryFn: async () => {
      // Build query string with range and optional project filter
      let queryString = buildRangeParam(range)
      
      if (project) {
        const separator = queryString ? '&' : '?'
        queryString += `${separator}project=${encodeURIComponent(project)}`
      }
      
      const response = await api.get<EmployeesApiResponse>(`/employees${queryString}`)
      return transformEmployeesResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
