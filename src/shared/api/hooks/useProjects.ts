import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformProjectsResponse, buildRangeParam } from '../transforms'
import type { ProjectsApiResponse, Project } from '../types'

interface UseProjectsOptions {
  enabled?: boolean
}

/**
 * Query hook for /projects endpoint
 * Fetches and transforms projects data based on time range
 */
export function useProjects(range: string, options: UseProjectsOptions = {}) {
  const { enabled = true } = options

  return useQuery<Project[]>({
    queryKey: ['projects', range],
    queryFn: async () => {
      const queryString = buildRangeParam(range)
      const response = await api.get<ProjectsApiResponse>(`/projects${queryString}`)
      return transformProjectsResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
