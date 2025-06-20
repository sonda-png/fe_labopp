export type LoginMutationArguments = {
  idToken: string
}

export type LoginMutationResponse = {
  userId: string
  email: string
  role: string
  token: string
}

export type GoogleLoginReturn = {
  clientId: string
  credential: string
  select_by: string
}

export type GetMeQueryResponse = {
  firstName: string
  lastName: string
  userName: string
}

export type User = {
  id: string
  name: string
}

export type GetUsersResponse = {
  users: User[]
  nextPage?: number | null
}

export type GetUsersInfiniteArgs = {
  count?: string
}

export type GetUsersListArgs = {
  page?: string
}

export type RefreshTokenMutationResponse = {
  accessToken: string
  refreshToken: string
}

export type RegisterMutationArguments = {
  userName: string
  password: string
  email: string
  captchaText: string
  captchaId?: number
}

export type LogoutMutationRequest = {
  accessToken: string
}

// API_ACTION_TYPES
