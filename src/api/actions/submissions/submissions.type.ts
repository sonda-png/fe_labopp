export type SubmitSubmissionArgs = {
  problemId: string
  studentId: string
  semesterId: number
  zipFile: File
  status: 'Draft' | 'Submit'
}

export type SubmitSubmissionResponse = {
  submissionId: string
}

export type SubmissionResult = {
  testCaseId: string
  status: 'PASS' | 'FAIL'
  actualOutput: string
  expectedOutput: string
  durationMs: number
  errorLog: string
}

export type SubmissionResultResponse = SubmissionResult[]
