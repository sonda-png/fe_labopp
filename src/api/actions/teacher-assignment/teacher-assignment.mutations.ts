import { AxiosInstance } from 'axios'
import {
  AuditTeacherAssignmentRequest,
  TeacherAssignment,
  UpdateTeacherAssignmentRequest,
} from './teacher-assignment.type'

export const teacherAssignmentMutations = {
  createTeacherAssignment: (client: AxiosInstance) =>
    handleCreateSemesterClass(client),
  updateTeacherAssignment: (client: AxiosInstance) =>
    handleUpdateSemesterClass(client),
}

const handleCreateSemesterClass =
  (client: AxiosInstance) =>
  async ({
    params,
    body,
  }: {
    params: string
    body: AuditTeacherAssignmentRequest
  }) => {
    const formData = new FormData()
    formData.append('Title', body.title)
    formData.append('Description', body.description)
    formData.append('LocTarget', body.locTarget.toString())
    formData.append('DueDate', body.dueDate)
    formData.append('File', body.file)
    return (
      await client.post<TeacherAssignment>(
        `/teacher/assignments/${params}`,
        formData
      )
    ).data
  }

const handleUpdateSemesterClass =
  (client: AxiosInstance) => async (body: UpdateTeacherAssignmentRequest) => {
    const formData = new FormData()
    formData.append('Title', body.title)
    formData.append('Description', body.description)
    formData.append('LocTarget', body.locTarget.toString())
    formData.append('DueDate', body.dueDate)
    formData.append('File', body.file)
    return (
      await client.put<TeacherAssignment>(`/teacher/assignments`, formData)
    ).data
  }
