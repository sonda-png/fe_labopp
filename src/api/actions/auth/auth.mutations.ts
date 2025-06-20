import { AxiosInstance } from 'axios'
import {
  LoginMutationArguments,
  LoginMutationResponse,
  LogoutMutationRequest,
  // MUTATION_TYPE_IMPORTS
} from './auth.types'
import { ENV } from '@/config/env'

export const authMutations = {
  loginMutation: (client: AxiosInstance) => handleLogin(client),
  logoutMutation:
    (client: AxiosInstance) => async (body: LogoutMutationRequest) => {
      return await client.post<void>('/auth/logout', body)
    },
  // MUTATION_FUNCTIONS_SETUP
}

const handleLogin =
  (client: AxiosInstance) => async (body: LoginMutationArguments) => {
    const formData = new FormData()
    formData.append('idToken', body.idToken)
    return (
      await client.post<LoginMutationResponse>('/auth/google-login', formData)
    ).data
  }

export const refreshTokenUrl = `${ENV.BACK_END_URL}/users/refresh-token`
