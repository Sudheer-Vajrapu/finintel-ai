import { useQuery } from '@tanstack/react-query'
import { api } from '../client'
import { transformProjectsResponse, buildRangeParam } from '../transforms'
import type { ProjectsApiResponse, Project } from '../types'

interface UseProjectsOptions {
  enabled?: boolean
  project?: string | null
}

/**
 * Query hook for /projects endpoint
 * Fetches and transforms projects data based on time range and optional project filter
 * 
 * API Behavior:
 * - Default (All): /projects (no query params)
 * - With range: /projects?range=<value>
 * - With project: /projects?project=<project_name>
 * - Combined: /projects?range=<value>&project=<project_name>
 */
export function useProjects(range: string, options: UseProjectsOptions = {}) {
  const { enabled = true, project = null } = options

  return useQuery<Project[]>({
    queryKey: ['projects', range, project],
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
      
      const response = await api.get<ProjectsApiResponse>(`/projects${queryString}`)
      return transformProjectsResponse(response)
    },
    enabled,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  })
}
