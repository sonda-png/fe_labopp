import { type AxiosError, AxiosResponse } from 'axios'
import { getStandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError'
import { ApiResponse } from '../../apiClientContext/ApiClientContext.types'
import { toast } from 'react-toastify'

export function responseSuccessInterceptor<T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> | Promise<never> {
  return response.data
}

export const useResponseFailureInterceptor = async (
  error: AxiosError<unknown>
) => {
  toast.error(error.message)
  // const { setAuthData, clearTokens, accessToken, refreshToken } = authStore.getState();
  const standarizedError = getStandardizedApiError(error)
  if (standarizedError.statusCode === 401) {
    // clearTokens();
    window.location.replace('/login')

    return Promise.reject(standarizedError)
  }
  if (standarizedError.statusCode === 403) {
    window.location.replace('/forbidden')
    return Promise.reject(standarizedError)
  }

  return Promise.reject(standarizedError)
}
