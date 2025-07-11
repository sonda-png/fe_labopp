import { accountMutations } from './admin-account/admin-account.mutations'
import { authMutations } from './auth/auth.mutations'
import { semestersMutations } from './semesters/semesters.mutations'
import { assignmentMutations } from './assignment-manage/assignment.mutation'
import { teacherAssignmentMutations } from './teacher-assignment/teacher-assignment.mutations'

export const mutations = {
  ...authMutations,
  ...assignmentMutations,
  ...accountMutations,
  ...semestersMutations,
  ...teacherAssignmentMutations,
  // API_COLLECTION_MUTATIONS
} as const

export type AxiosMutationsType = typeof mutations
