// Response cho GET /waiting/{classId} và /{submissionId}
export interface TeacherSubmissionData {
  id: string
  studentName: string
  assignmentCode: string
  submittedAt: string
  loc: number
  status: string
  filePath: string
  comment: string
  studentId: string
}

export interface TeacherSubmissionApiResponse {
  success: boolean
  message: string | null
  data: TeacherSubmissionData[] | TeacherSubmissionDetailData
  errors: any
}
export interface TeacherSubmissionDetailApiResponse {
  success: boolean
  message: string | null
  data: TeacherSubmissionDetailData
  errors: any
}
// Request cho POST /grade
export interface GradeSubmissionArgs {
  submissionId: string
  isPass: boolean
}

// Request cho POST /feedback
export interface FeedbackSubmissionArgs {
  submissionId: string
  comment: string
}

// Response cho 2 API POST
export interface TeacherSubmissionActionResponse {
  success: boolean
  message: string | null
  data: string
  errors: any
}

export type SubmissionStatus = 'Drafted' | 'Passed' | 'Rejected'

export interface TestCaseResult {
  id: string
  testCaseId: string
  actualOutput: string
  isPassed: boolean
}

export interface TeacherSubmissionDetailData {
  id: string
  studentId: string
  studentName: string
  assignmentId: string
  assignmentTitle: string
  locTarget: number
  submittedAt: string
  loc: number
  status: SubmissionStatus
  filePath: string
  feedbacks: string[]
  testCaseResults: TestCaseResult[]
}
