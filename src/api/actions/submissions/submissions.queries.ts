import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { SubmissionResult } from './submissions.type'

/* Submission queries */
export const submissionsQueries = {
  all: () => ['submissions'],
  getResult: (submissionId: string) =>
    queryFactoryOptions({
      queryKey: [...submissionsQueries.all(), 'list'],
      queryFn: (client: AxiosInstance) =>
        getSubmissionResult(submissionId)(client),
      enabled: true,
    }),
}

const getSubmissionResult =
  (submissionId: string) => (client: AxiosInstance) => async () => {
    return (
      await client.get<SubmissionResult>(`/submit/${submissionId}/result`)
    ).data
  }
