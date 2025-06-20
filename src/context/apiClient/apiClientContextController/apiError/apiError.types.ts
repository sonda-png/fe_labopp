import { AxiosError } from 'axios'

// ----------------------
// Unified API error type
// ----------------------

export type ApiErrorResponse = {
  success: false
  message: string
  data: unknown | null
  errors: string[]
}

export interface StandardizedApiError extends ApiErrorResponse {
  /** HTTP status code */
  statusCode?: number
  /** Original Axios error for debugging */
  originalError: AxiosError<unknown> | Error
}
