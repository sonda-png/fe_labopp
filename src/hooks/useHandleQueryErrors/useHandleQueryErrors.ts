import { logger } from '@/integration/logger'
import { ExtendedQueryMeta } from '@/types/data/api'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { isClientError, isServerError } from '@/utils/helper/apiErrorStatuses'

export const useHandleQueryErrors = () => {
  const handleErrors = (error: StandardizedApiError) => {
    if (isServerError(error.statusCode)) {
      // show translated error message in toast/snackbar
      logger.error(
        typeof error.originalError === 'string'
          ? error.originalError
          : error.originalError.message
      )
    }

    if (isClientError(error.statusCode)) {
      // show translated error message in toast/snackbar
      logger.error(
        typeof error.originalError === 'string'
          ? error.originalError
          : error.originalError.message
      )
    }
  }

  const shouldHandleGlobalError = (
    metaError?: ExtendedQueryMeta['error'],
    errorCode?: number
  ) => {
    if (!errorCode || !metaError) {
      return false
    }

    return (
      metaError.showGlobalError && !metaError.excludedCodes.includes(errorCode)
    )
  }

  return { handleErrors, shouldHandleGlobalError }
}
