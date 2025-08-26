import { AxiosInstance } from 'axios'
import {
  AssignmentListResponse,
  AssignmentRequest,
  UploadAssignmentPdfRequest,
  // Thêm các type khác nếu cần
} from './assignment.types'

// ADD assignment
const handleAddAssignment =
  (client: AxiosInstance) => async (body: AssignmentRequest) => {
    const formData = new FormData()
    formData.append('Title', body.title)
    formData.append('Description', body.description)
    formData.append('LocTotal', body.locTotal.toString())
    formData.append('TeacherId', body.teacherId.toString())
    formData.append('Status', body.status)
    body.classIds.forEach((id: string | number) => {
      formData.append('ClassIds', id.toString())
    })
    formData.append('File', body.file)
    return (
      await client.post<string>(
        '/head_subject/assignment/add-with-pdf',
        formData
      )
    ).data
  }

// UPDATE assignment
const handleUpdateAssignment =
  (client: AxiosInstance) => async (body: AssignmentRequest) => {
    const formData = new FormData()
    formData.append('Id', body.id as string)
    formData.append('Title', body.title)
    formData.append('Description', body.description)
    formData.append('LocTotal', body.locTotal.toString())
    formData.append('TeacherId', body.teacherId.toString())
    formData.append('Status', body.status)
    body.classIds.forEach((id: string | number) => {
      formData.append('ClassIds', id.toString())
    })
    formData.append('File', body.file)
    return (
      await client.put<AssignmentListResponse>(
        `/head_subject/assignment/update/${body.id}`,
        formData
      )
    ).data
  }

// DELETE assignment
const handleDeleteAssignment =
  (client: AxiosInstance) => async (id: string) => {
    return (
      await client.delete<AssignmentListResponse>(
        `/head_subject/assignment/delete/${id}`
      )
    ).data
  }

const handleUploadAssignmentPdf =
  (client: AxiosInstance) => async (body: UploadAssignmentPdfRequest) => {
    const formData = new FormData()
    formData.append('file', body.file)
    formData.append('uploadedBy', body.uploadBy)
    formData.append('assignmentId', body.assignmentId)
    return (
      await client.post<AssignmentListResponse>(
        `/head_subject/assignment/pdf`,
        formData
      )
    ).data
  }

// Export mutations object
export const assignmentManageMutations = {
  addAssignmentMutation: (client: AxiosInstance) => handleAddAssignment(client),
  updateAssignmentMutation: (client: AxiosInstance) =>
    handleUpdateAssignment(client),
  deleteAssignmentMutation: (client: AxiosInstance) =>
    handleDeleteAssignment(client),
  uploadAssignmentPdfMutation: (client: AxiosInstance) =>
    handleUploadAssignmentPdf(client),
}
