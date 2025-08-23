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
  delete: (studentId: number, params: DeleteStudentLabRequest) =>
    queryFactoryOptions({
      queryKey: [
        ...studentAssignmentQueries.all(),
        'delete',
        studentId,
        params.assignmentId,
        params.semesterId,
      ],
      queryFn: (client: AxiosInstance) => deleteLab(studentId, params)(client),
      enabled: !!studentId && !!params.assignmentId && !!params.semesterId,
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
  (studentId: number, params: DeleteStudentLabRequest) =>
  (client: AxiosInstance) =>
  async () => {
    return (
      await client.delete<DeleteStudentLabResponse>(
        `/student/my-lab-list/${studentId}?semesterId=${params.semesterId}`,
        { data: { assignmentId: params.assignmentId } }
      )
    ).data
  }