import { AxiosInstance } from 'axios'
import {
  IngestPdfRequest,
  ReviewCodeRequest,
  ReviewCodeResponse,
  SuggestTestCasesRequest,
  SuggestTestCasesResponse,
} from './ai-manage.type'

const handleIngestPdf =
  (client: AxiosInstance) =>
  async (body: IngestPdfRequest): Promise<void> => {
    const formData = new FormData()

    formData.append('AssignmentId', body.assignmentId.toString())
    formData.append('PdfFile', body.pdfFile)

    return (await client.post<void>('/ai/ingest-pdf', formData)).data
  }

const handleReviewCode =
  (client: AxiosInstance) =>
  async (body: ReviewCodeRequest): Promise<ReviewCodeResponse> => {
    return (await client.post<ReviewCodeResponse>('/ai/review-code', body)).data
  }

const handleSuggestTestCases =
  (client: AxiosInstance) =>
  async (body: SuggestTestCasesRequest): Promise<SuggestTestCasesResponse> => {
    return (
      await client.post<SuggestTestCasesResponse>('/ai/suggest-testcases', body)
    ).data
  }
// Export mutations object
export const aiManageMutations = {
  handleIngestPdf: (client: AxiosInstance) => handleIngestPdf(client),
  handleReviewCode: (client: AxiosInstance) => handleReviewCode(client),
  handleSuggestTestCases: (client: AxiosInstance) =>
    handleSuggestTestCases(client),
}
