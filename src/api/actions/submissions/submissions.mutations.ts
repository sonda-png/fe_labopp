import { AxiosInstance } from 'axios'
import { SubmitSubmissionArgs, SubmitSubmissionResponse } from './submissions.type'

export const submissionsMutations = {
  handleSubmitSubmission: (client: AxiosInstance) =>
    handleSubmitSubmission(client),
}

const handleSubmitSubmission =
  (client: AxiosInstance) => async (body: SubmitSubmissionArgs) => {
    const formData = new FormData()

    formData.append('ProblemId', body.problemId)
    formData.append('StudentId', body.studentId)
    formData.append('ZipFile', body.zipFile)
    formData.append('Status', body.status)

    return (
      await client.post<SubmitSubmissionResponse>(`/submit`, formData)
    ).data
  }
