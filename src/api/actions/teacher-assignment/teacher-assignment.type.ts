export interface CodeFile {
  id: string
  name: string
  type: 'file' | 'folder'
  extension?: string
  content?: string
  children?: CodeFile[]
}

export type AuditTeacherAssignmentRequest = {
  title: string
  description: string
  locTarget: number
  dueDate: string
  file: File
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
  submissionId: string
}
