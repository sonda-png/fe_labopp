import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

export const requestSuccessInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  // const { accessToken } = authStore.getState();
  const accessToken = ''

  // Dynamically adjust the `Content-Type` header so that callers can
  // freely send either JSON bodies or FormData without manually
  // overriding headers each time. If the payload is an instance of
  // `FormData`, we REMOVE the `Content-Type` header and let the
  // browser/axios set the appropriate multipart boundary. Otherwise we
  // default to `application/json`.
  const headers = (config.headers ?? {}) as AxiosRequestHeaders
  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData

  if (isFormData) {
    // Let the browser set the correct multipart boundary automatically.
    delete headers['Content-Type']
  } else {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  // Attach authorization header if token is available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  return {
    ...config,
    withCredentials: false,
    headers: headers,
  }
}
