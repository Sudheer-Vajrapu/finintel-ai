import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../client'

/**
 * Mutation hook for DELETE /dataset endpoint
 * Resets/clears all ingested data
 */
export function useResetDataset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete('/dataset')
    },
    onSuccess: () => {
      // Invalidate all data queries to clear cached data
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['risks'] })
    },
  })
}
