import { AxiosInstance } from 'axios'
import { AddStudentLabRequest, AddStudentLabResponse } from './student-assignment.type'

export const studentAssignmentMutations = {
  addStudentLab: (client: AxiosInstance) => addStudentLab(client),
}

const addStudentLab =
  (client: AxiosInstance) => async (
    studentId: number,
    params: AddStudentLabRequest
  ): Promise<AddStudentLabResponse> => {
    const res = await client.post<AddStudentLabResponse>(
      `/student/my-lab-list/${studentId}?semesterId=${params.semesterId}`,
      { assignmentId: params.assignmentId }
    )
   return res.data
  }