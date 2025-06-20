import axios, { AxiosResponse } from 'axios'
import { requestSuccessInterceptor } from '@/context/apiClient/apiClientContextController/interceptors/requestInterceptors'
import {
  useResponseFailureInterceptor,
  responseSuccessInterceptor,
} from '@/context/apiClient/apiClientContextController/interceptors/responseInterceptors'
import { ENV } from '@/config/env'
import { ApiResponse } from '@/context/apiClient/apiClientContext/ApiClientContext.types'

const axiosClient = axios.create({
  // Default headers will be attached dynamically by the request
  // interceptor (e.g., 'application/json' or appropriate multipart
  // headers when dealing with FormData).
  baseURL: ENV.BACK_END_URL,
  timeout: 10000,
})

axiosClient.interceptors.request.use(requestSuccessInterceptor)
axiosClient.interceptors.response.use(
  responseSuccessInterceptor as unknown as (
    response: AxiosResponse<ApiResponse<unknown>>
  ) => AxiosResponse | Promise<AxiosResponse>,
  useResponseFailureInterceptor
)

export default axiosClient
