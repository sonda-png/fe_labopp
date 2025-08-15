import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { TestCaseResponse } from './problem.type'

/* Submission queries */
export const problemQueries = {
  all: () => ['problem'],
  getDetail: (id: string) =>
    queryFactoryOptions({
      queryKey: [...problemQueries.all(), 'list'],
      queryFn: (client: AxiosInstance) => getDetail(id)(client),
      enabled: true,
    }),
  getByAssignment: (assignmentId: string | undefined) =>
    queryFactoryOptions({
      queryKey: [...problemQueries.all(), 'assignment', assignmentId],
      queryFn: (client: AxiosInstance) => getByAssignment(assignmentId)(client),
      enabled: !!assignmentId,
    }),
}

const getDetail = (id: string) => (client: AxiosInstance) => async () => {
  return (await client.get<TestCaseResponse>(`/test-case/test-case/${id}`)).data
}

const getByAssignment =
  (assignmentId: string | undefined) => (client: AxiosInstance) => async () => {
    return (
      await client.get<TestCaseResponse[]>(
        `/test-case/${assignmentId}/testcases`
      )
    ).data
  }
