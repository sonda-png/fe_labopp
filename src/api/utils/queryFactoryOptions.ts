import { UseInfiniteQueryOptions } from '@tanstack/react-query'
import { UseQueryOptions } from '@/hooks/useQuery/useQuery.types'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

export const queryFactoryOptions = <
  TQueryFnData = unknown,
  TError = StandardizedApiError,
>(
  options: UseQueryOptions<TQueryFnData, TError>
) => options

export const infiniteQueryFactoryOptions = <
  TQueryFnData = unknown,
  TPageParam = unknown,
  TError = StandardizedApiError,
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TPageParam>
) => options
