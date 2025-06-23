export interface Assignment {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: string
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
}
