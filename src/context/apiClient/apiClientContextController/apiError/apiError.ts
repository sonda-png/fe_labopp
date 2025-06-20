import { AxiosError } from 'axios'
import { StandardizedApiError } from './apiError.types'

/**
 * Convert an AxiosError coming from the API to our unified `StandardizedApiError`.
 * The backend always returns the following JSON shape for failures:
 */
export const getStandardizedApiError = (
  error: AxiosError<unknown>
): StandardizedApiError => {
  // Try to read the API-provided error. Fallbacks ensure we always have sensible defaults.
  const responseData =
    (error.response?.data as Partial<StandardizedApiError>) ?? {}

  return {
    success: false,
    message:
      responseData.message ??
      'Đã xảy ra lỗi không xác định',
    data: responseData.data ?? null,
    errors: responseData.errors ?? [error.message],
    statusCode: error.response?.status,
    originalError: error,
  }
}
