import { accountMutations } from './admin-account/admin-account.mutations'
import { authMutations } from './auth/auth.mutations'

export const mutations = {
  ...authMutations,
  ...accountMutations,

  // API_COLLECTION_MUTATIONS
} as const

export type AxiosMutationsType = typeof mutations
