import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import {
  StudentLabAssignmentList,
  DeleteStudentLabRequest,
  DeleteStudentLabResponse,
} from './student-assignment.type'

export const studentAssignmentQueries = {
  all: () => ['studentLabAssignments'],
  getAll: () =>
    queryFactoryOptions({
      queryKey: [...studentAssignmentQueries.all(), 'list'],
      queryFn: (client: AxiosInstance) => getAll(client),
      enabled: true,
    }),
  delete: (assignmentId: number, params: DeleteStudentLabRequest) =>
    queryFactoryOptions({
      queryKey: [
        ...studentAssignmentQueries.all(),
        'delete',
        assignmentId,
        params.semesterId,
      ],
      queryFn: (client: AxiosInstance) => deleteLab(assignmentId, params)(client),
      enabled: !!assignmentId && !!params.semesterId,
    }),
}

const getAll = (client: AxiosInstance) => async () => {
  return (
    await client.get<StudentLabAssignmentList>(
      'http://188.166.212.41:5000/api-labopp/api/student/my-lab-list'
    )
  ).data
}

const deleteLab =
  (assignmentId: number, params: DeleteStudentLabRequest) =>
  (client: AxiosInstance) =>
  async () => {
    return (
      await client.delete<DeleteStudentLabResponse>(
        `/student/my-lab-list/${assignmentId}?semesterId=${params.semesterId}`
      )
    ).data
  }