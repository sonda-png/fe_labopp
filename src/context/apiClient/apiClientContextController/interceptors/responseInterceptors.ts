import axios, { type AxiosError, AxiosResponse } from 'axios'
import { getStandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError'
import { ExtendedAxiosRequestConfig } from '@/api/types/types'
import { ApiResponse } from '../../apiClientContext/ApiClientContext.types'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { getLoginUrlWithRedirect } from '@/utils/helpers/redirectAfterLogin'

export function responseSuccessInterceptor<T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> | Promise<never> {
  const { success, message } = response.data

  if (success) {
    if (!response.config.method?.toLowerCase().includes('get') && message) {
      toast.success(message)
    }
    return response.data
  }

  // If `success` is false, treat it as an error
  toast.error(message || 'Đã xảy ra lỗi')

  const standardizedError: StandardizedApiError = {
    ...(response.data as unknown as StandardizedApiError),
    statusCode: response.status,
    originalError: new Error(message),
  }

  return Promise.reject(standardizedError)
}

export const useResponseFailureInterceptor = async (
  error: AxiosError<unknown>
) => {
  const { clearTokens } = authStore.getState()

  const standarizedError = getStandardizedApiError(error)

  const originalRequest = error.config as ExtendedAxiosRequestConfig
  if (standarizedError.statusCode === 401 && originalRequest?._retry) {
    // Clear tokens and save current page for redirect after login
    clearTokens()
    
    const loginUrl = getLoginUrlWithRedirect()
    window.location.replace(loginUrl)

    return Promise.reject(standarizedError)
  }
  if (standarizedError.statusCode === 401 && originalRequest) {
    originalRequest._retry = true
    try {
      // const { data } = await axios.post<RefreshTokenMutationResponse>(refreshTokenUrl, {
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // });
      //
      // setAuthData(data.accessToken ?? '', refreshToken ?? '', '', '', '', '');

      return axios(originalRequest)
    } catch {
      // Clear tokens and save current page for redirect after login
      clearTokens()
      
      const loginUrl = getLoginUrlWithRedirect()
      window.location.replace(loginUrl)

      return Promise.reject(standarizedError)
    }
  }
  return Promise.reject(standarizedError)
}
