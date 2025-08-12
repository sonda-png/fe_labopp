import { accountMutations } from './admin-account/admin-account.mutations'
import { authMutations } from './auth/auth.mutations'
import { semestersMutations } from './semesters/semesters.mutations'
import { assignmentManageMutations } from './assignment-manage/assignment.mutation'
import { teacherSubmissionMutations } from './teacher-submit/teacher-submit.mutations'
import { teacherAssignmentMutations } from './teacher-assignment/teacher-assignment.mutations'
import { assignmentMutations } from './assignment/assignment.mutations'
import { adminWorkerMutations } from './worker/worker.mutations'

export const mutations = {
  ...authMutations,
  ...assignmentManageMutations,
  ...accountMutations,
  ...semestersMutations,
  ...teacherSubmissionMutations,
  ...teacherAssignmentMutations,
  ...assignmentMutations,
  ...adminWorkerMutations,
  // API_COLLECTION_MUTATIONS
} as const

export type AxiosMutationsType = typeof mutations
