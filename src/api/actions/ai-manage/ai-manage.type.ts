export type IngestPdfRequest = {
  assignmentId: number
  pdfFile: File
}

export type IngestPdfResponse = {
  success: boolean
  assignmentId: string
  chunks: number
  source: string
  status: string
  error: string
  rawResponse: string
}

export type ReviewCodeRequest = {
  assignmentId: string
  submissionId: string
}

export type ReviewCodeResponse = {
  success?: boolean
  assignmentId: string
  submissionId: string
  reviewAllowed?: boolean
  review: string
  hasErrors: boolean
  errorCount: number
  summary: string
  rawResponse: string
  error?: string
}

export type ReviewCodeRawResponse = {
  assignmentId: string
  submissionId: string
  reviewAllowed?: boolean
  review: string
  hasErrors: boolean
  errorCount: number
  summary: string
  rawResponse: RawResponse
}

export type RawResponse = {
  status: string
  issues: any[]
  evidence: Evidence[]
  ioCoverage: {
    provided: number
    used: number
    failed: number
  }
}

export type Evidence = {
  input: string
  expectedOutput: string
  actualOutput: string
  reason: string
}

export type SuggestTestCasesRequest = {
  assignmentId: number
  submissionId: number
  review: string
  hasErrors: boolean
  errorCount: number
  summary: string
  rawResponse: string
}

export type SuggestTestCasesResponse = {
  success: boolean
  assignmentId: string
  testCases: SuggestTestCases[]
  suggestions: string
  error: string
  rawResponse: string
}

export type SuggestTestCases = {
  input: string
  expectedOutput: string
}
