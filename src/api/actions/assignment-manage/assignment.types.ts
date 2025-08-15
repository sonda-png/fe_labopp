export interface Assignment {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: string
  status: 'Pending' | 'Active' | 'Inactive'
}

export interface AssignmentListResponse {
  success: boolean
  message: string
  data: Assignment[]
  errors: any // hoặc: errors?: string | null
}

export interface AssignmentRequest {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: string
  status: 'Pending' | 'Active' | 'Inactive'
}

export type AssignmentStatistic = {
  classId: string
  className: string
  totalStudents: number
  studentsPassed: number
  passRate: number
}

export type AssignmentStatisticResponse = AssignmentStatistic[]

export type UploadAssignmentPdfRequest = {
  file: File
  uploadBy: string
  assignmentId: string
}

export type UploadAssignmentPdfResponse = {
  success: boolean
  message: string
}
