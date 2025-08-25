import { AxiosInstance } from 'axios'
import { AddStudentLabRequest, AddStudentLabResponse } from './student-assignment.type'

export const studentAssignmentMutations = {
  addStudentLab: (client: AxiosInstance) => addStudentLab(client),
}

const addStudentLab =
  (client: AxiosInstance) => async (
    body: AddStudentLabRequest
  ): Promise<AddStudentLabResponse> => {
    const { assignmentId, semesterId } = body
    const res = await client.post<AddStudentLabResponse>(
      `/student/my-lab-list/${assignmentId}?semesterId=${semesterId}`,
      { assignmentId }
    )
    return res.data
  }