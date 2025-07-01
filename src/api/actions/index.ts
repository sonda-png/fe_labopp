import { accountMutations } from './admin-account/admin-account.mutations'
import { authMutations } from './auth/auth.mutations'
import { semestersMutations } from './semesters/semesters.mutations'
import { assignmentMutations } from './assignment-manage/assignment.mutation'

export const mutations = {
  ...authMutations,
  ...assignmentMutations,
  ...accountMutations,
  ...semestersMutations,

  // API_COLLECTION_MUTATIONS
} as const

export type AxiosMutationsType = typeof mutations
