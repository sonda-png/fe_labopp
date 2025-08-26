export interface Assignment {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: number
  status: 'Pending' | 'Active' | 'Inactive'
}

export interface AssignmentListResponse {
  success: boolean
  message: string
  data: Assignment[]
  errors: any // hoặc: errors?: string | null
}

export interface AssignmentRequest {
  id?: string
  title: string
  description: string
  locTotal: number
  teacherId: number
  status: 'Pending' | 'Active' | 'Inactive'
  classIds: string[]
  file: File
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

export type AssignmentAllClassResponse = AssignmentClass[]

export type AssignmentClass = {
  id: string
  classCode: string
  subjectCode: string
  semesterId: number
  academicYear: string
  isActive: boolean
  teacherId: number
  locToPass: number
  createdBy: string | null
  createdAt: string
  updatedBy: string | null
  updatedAt: string | null
}
