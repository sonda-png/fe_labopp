export type Student = {
  studentId: string
  fullName: string
  email: string
  totalAssignments: number
  passedAssignments: number
  totalLOC: number
}

export type TeacherStudentInClassResponse = {
  success: boolean
  message: string
  data: Student[]
  errors: null | any
}

export type Progress = {
  assignmentId: string
  title: string
  status: string
  loc: number
  submittedAt: string
}
export type StudentProgress = {
  studentId: string
  fullName: string
  email: string
  progress: Progress[]
}

export type StudentProgressResponse = {
  success: boolean
  message: string
  data: StudentProgress[]
  errors: null | any
}
