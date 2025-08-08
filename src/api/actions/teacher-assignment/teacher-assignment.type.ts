export type AuditTeacherAssignmentRequest = {
  title: string
  description: string
  locTarget: number
  dueDate: string
}

export type UpdateTeacherAssignmentRequest = AuditTeacherAssignmentRequest & {
  assignmentId?: string
}

export type TeacherAssignment = {
  id: string
  title: string
  description: string
  locTarget: number
  dueDate: string
  status: string
  totalSubmissions: number
  passedCount: number
}

export type ViewSubmissionRequest = {
  zipPath: string
  javaFileName: string
}

export type ViewJavaFileResponse = {
  [filePath: string]: string
}

export type ViewJavaFileRequest = {
  studentId: string
  classId: string
  assignmentId: string
}
