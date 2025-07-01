import { type AxiosError, AxiosResponse } from 'axios'
import { getStandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError'
import { ApiResponse } from '../../apiClientContext/ApiClientContext.types'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { getLoginUrlWithRedirect } from '@/utils/helpers/redirectAfterLogin'

export function responseSuccessInterceptor<T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> | Promise<never> {
  return response.data
}

export const useResponseFailureInterceptor = async (
  error: AxiosError<unknown>
) => {
  // const { setAuthData, clearTokens, accessToken, refreshToken } = authStore.getState();
  const loginUrl = getLoginUrlWithRedirect()
  const standarizedError = getStandardizedApiError(error)
  if (standarizedError.statusCode === 401) {
    // clearTokens();
    window.location.replace(loginUrl)
    return Promise.reject(standarizedError)
  }
  if (standarizedError.statusCode === 403) {
    window.location.replace('/forbidden')
    return Promise.reject(standarizedError)
  }

  return Promise.reject(standarizedError)
}
