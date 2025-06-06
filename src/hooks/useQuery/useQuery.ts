import { useQuery as useRQQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks'
import { UseQueryOptions } from '@/hooks/useQuery/useQuery.types'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

export const useQuery = <TQueryFnData = unknown, TError = StandardizedApiError>(
  params: UseQueryOptions<TQueryFnData, TError>
) => {
  const { client } = useApiClient()
  const { queryFn, ...options } = params

  const result = useRQQuery({
    queryFn: args => queryFn(client)(args),
    ...options,
  })

  return {
    ...result,
    isLoadingAndEnabled: result.isPending && result.fetchStatus !== 'idle',
  }
}
