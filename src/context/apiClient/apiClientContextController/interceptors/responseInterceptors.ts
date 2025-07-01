import { type AxiosError, AxiosResponse } from 'axios'
import { getStandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError'
import { ApiResponse } from '../../apiClientContext/ApiClientContext.types'
import { authStore } from '@/stores/authStore'
import { getLoginUrlWithRedirect } from '@/utils/helpers/redirectAfterLogin'
import { toast } from 'react-toastify'

export function responseSuccessInterceptor<T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> | Promise<never> {
  return response.data
}

export const useResponseFailureInterceptor = async (
  error: AxiosError<unknown>
) => {
  const { clearTokens } = authStore.getState();
  const loginUrl = getLoginUrlWithRedirect()
  const standarizedError = getStandardizedApiError(error)
  if (standarizedError.statusCode === 401) {
    clearTokens();
    window.location.replace(loginUrl)
    toast.error('Session expired, please login again')
    return Promise.reject(standarizedError)
  }
  if (standarizedError.statusCode === 403) {
    window.location.replace('/forbidden')
    return Promise.reject(standarizedError)
  }

  return Promise.reject(standarizedError)
}
