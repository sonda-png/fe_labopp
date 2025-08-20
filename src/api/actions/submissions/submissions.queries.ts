import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { SubmissionResultResponse } from './submissions.type'

/* Submission queries */
export const submissionsQueries = {
  all: () => ['submissions'],
  getResult: (submissionId: string) =>
    queryFactoryOptions({
      queryKey: [...submissionsQueries.all(), 'result', submissionId],
      queryFn: (client: AxiosInstance) =>
        getSubmissionResult(submissionId)(client),
      enabled: !!submissionId,
    }),
}

const getSubmissionResult =
  (submissionId: string) => (client: AxiosInstance) => async () => {
    return (
      await client.get<SubmissionResultResponse>(
        `/submit/${submissionId}/result`
      )
    ).data
  }
