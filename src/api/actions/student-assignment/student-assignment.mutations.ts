import { AxiosInstance } from 'axios'
import { AddStudentLabRequest, AddStudentLabResponse } from './student-assignment.type'

export const studentAssignmentMutations = {
  addStudentLab: (client: AxiosInstance) => addStudentLab(client),
}

const addStudentLab =
  (client: AxiosInstance) => async (
    assignmentId: number,
    params: AddStudentLabRequest
  ): Promise<AddStudentLabResponse> => {
    const res = await client.post<AddStudentLabResponse>(
      `/student/my-lab-list/${assignmentId}?semesterId=${params.semesterId}`,
      { assignmentId }
    )
    return res.data
  }