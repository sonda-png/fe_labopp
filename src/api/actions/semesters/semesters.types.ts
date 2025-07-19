export type Semester = {
  id: string
  name: string
  semester: number
  academicYear: string
  isActive: boolean
  createdAt: string
}

export interface CreateSemesterRequest {
  name: string
  subject: string
  semester: number
  academicYear: string
  locToPass: number
  teacherId: string
  isActive: boolean
}

export interface UpdateSemesterRequest {
  name?: string
  subject?: string
  semester?: number
  academicYear?: string
  locToPass?: number
  teacherId?: string
  isActive?: boolean
}

export type CreateSemesterArgs = {
  name: string
  startDate: string
  endDate: string
}

export type SemesterResponse = {
  id: string
  name: string
  semester: number
  academicYear: string
  isActive: boolean
  createdAt: string
}

export type SemesterByClassRequest = {
  semester?: number
  academicYear?: string
}
