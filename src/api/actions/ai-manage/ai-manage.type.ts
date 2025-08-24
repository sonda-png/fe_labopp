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
  studentCode: string
}

export type ReviewCodeResponse = {
  reviewAllowed: boolean
  assignmentId: string
  review: string
  hasErrors: boolean
  errorCount: number
  summary: string
  error: string
  rawResponse: string
}

export type SuggestTestCasesRequest = {
  assignmentId: number
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