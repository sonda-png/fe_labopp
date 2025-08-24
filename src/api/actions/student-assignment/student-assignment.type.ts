export interface StudentLabAssignment {
  id: number
  assignmentId: number
  semesterId: number
  status: 'Passed' | 'Draft'
  submittedAt: string // ISO date string
}

export type StudentLabAssignmentList = StudentLabAssignment[]

export interface AddStudentLabRequest {
  assignmentId: number
  semesterId: number
}

export interface AddStudentLabResponse {
  success: boolean
  message: string
  data: number // id của bản ghi vừa thêm
  errors: string[] | null
}

export interface DeleteStudentLabRequest {
  assignmentId: number
  semesterId: number
}

export interface DeleteStudentLabResponse {
  success: boolean
  message: string | null
  data: string // "Xóa bài thành công"
  errors: string[] | null
}