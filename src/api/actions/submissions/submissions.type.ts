export type SubmitSubmissionArgs = {
  problemId: string
  studentId: string
  zipFile: File
  status: 'Draft' | 'Submit'
}

export type SubmissionResult = {
  submissionId: string
  result: string
}
