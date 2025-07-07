import { AxiosInstance } from 'axios'
import {
  CredentialLoginMutationArguments,
  LoginMutationArguments,
  LoginMutationResponse,
  LogoutMutationRequest,
  // MUTATION_TYPE_IMPORTS
} from './auth.types'

export const authMutations = {
  loginGoogleMutation: (client: AxiosInstance) => handleGoogleLogin(client),
  logoutMutation:
    (client: AxiosInstance) => async (body: LogoutMutationRequest) => {
      return await client.post<void>('/auth/logout', body)
    },
  credentialLogin: (client: AxiosInstance) => handleCredentialLogin(client),
  // MUTATION_FUNCTIONS_SETUP
}

const handleGoogleLogin =
  (client: AxiosInstance) => async (body: LoginMutationArguments) => {
    const formData = new FormData()
    formData.append('idToken', body.idToken)
    return (
      await client.post<LoginMutationResponse>('/auth/google-login', formData)
    ).data
  }

const handleCredentialLogin =
  (client: AxiosInstance) => async (body: CredentialLoginMutationArguments) => {
    return (
      await client.post<LoginMutationResponse>('/auth/login', body)
    ).data
  }

