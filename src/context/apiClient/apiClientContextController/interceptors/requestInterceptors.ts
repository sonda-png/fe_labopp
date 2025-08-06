import { authStore } from '@/stores/authStore'
import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

export const useRequestSuccessInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const { authValues } = authStore.getState()

  const headers = (config.headers ?? {}) as AxiosRequestHeaders

  const isBrowser = typeof FormData !== 'undefined'
  const isFormData =
    isBrowser && config.data instanceof FormData

  // 👇 Handle FormData (single or multiple file uploads)
  if (isFormData) {
    // Let the browser set the correct multipart/form-data boundary automatically
    delete headers['Content-Type']
  } else {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  // 👇 Attach Authorization header if token exists
  if (authValues.isAuthenticated) {
    headers['Authorization'] = `Bearer ${authValues.token}`
  }

  return {
    ...config,
    withCredentials: true,
  }
}
