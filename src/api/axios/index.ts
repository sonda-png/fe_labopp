import axios from 'axios'
import { requestSuccessInterceptor } from '@/context/apiClient/apiClientContextController/interceptors/requestInterceptors'
import {
  useResponseFailureInterceptor,
  responseSuccessInterceptor,
} from '@/context/apiClient/apiClientContextController/interceptors/responseInterceptors'
import { ENV } from '@/config/env'

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: ENV.BACK_END_URL,
})

axiosClient.interceptors.request.use(requestSuccessInterceptor)
axiosClient.interceptors.response.use(
  responseSuccessInterceptor,
  useResponseFailureInterceptor
)

export default axiosClient
