import { useInfiniteQuery as useRQInfiniteQuery } from '@tanstack/react-query'

import { UseInfiniteQueryOptions } from './useInfiniteQuery.types'
import { useApiClient } from '@/hooks'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

/**
 * Fetching data using this hook doesn't require specifying query function like it's required in react-query
 * @see https://react-query.tanstack.com/guides/query-functions
 * This hook uses proper querying strategy provided via ApiClientContext
 * @see ApiClientContextController.ts
 * */
export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TError = StandardizedApiError,
  TPageParam = unknown,
>(
  params: UseInfiniteQueryOptions<TQueryFnData, TError, TPageParam>
) => {
  const { client } = useApiClient()
  const { queryFn, ...options } = params

  return useRQInfiniteQuery({
    ...options,
    queryFn: queryFn(client),
  })
}
