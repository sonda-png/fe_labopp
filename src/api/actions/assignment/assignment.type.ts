export type Assignment = {
  id: string
  title: string
  description: string
  locTotal: number
  createdAt: string
}

export type AssignmentListResponse = Assignment[]

export type AssignmentSubmitRequest = {
  assignmentId: string
  zipFile: File
}