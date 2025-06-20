import { AxiosInstance } from 'axios'

export type ApiResponse<TData = unknown> = {
  success: boolean
  message: string
  data: TData
  errors: string[]
}

export type ApiClientContextValue = {
  client: AxiosInstance
}
