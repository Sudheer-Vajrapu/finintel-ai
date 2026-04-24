import { useMutation } from '@tanstack/react-query'
import { api } from '../client'
import type { IngestResponse } from '../types'

interface IngestParams {
  files?: File[]
  csvText?: string
}

/**
 * Mutation hook for /ingest endpoint
 * Uploads files and triggers data processing
 */
export function useIngest() {
  return useMutation({
    mutationFn: async ({ files, csvText }: IngestParams): Promise<IngestResponse> => {
      const formData = new FormData()

      // Attach real File objects
      if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file))
      }

      // Attach pasted CSV text as a named CSV blob
      if (csvText?.trim()) {
        const blob = new Blob([csvText], { type: 'text/csv' })
        formData.append('files', blob, 'pasted_data.csv')
      }

      return api.upload<IngestResponse>('/ingest', formData)
    },
  })
}
