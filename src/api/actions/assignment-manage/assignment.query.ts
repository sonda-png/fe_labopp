import { AxiosInstance } from 'axios'
import {
  AssignmentListResponse,
  AssignmentStatisticResponse,
  // MUTATION_TYPE_IMPORTS
} from './assignment.types'
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'

const getAssignment = (client: AxiosInstance) => async () => {
  return await client.get<AssignmentListResponse>(
    '/head_subject/assignment/list'
  )
}

const getStatistic = (client: AxiosInstance) => async () => {
  return (
    await client.get<AssignmentStatisticResponse>(
      '/head_subject/assignment/statistic'
    )
  ).data
}

export const assignmentManageQueries = {
  all: () => ['assignments'],
  get: () =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'get'],
      queryFn: getAssignment,
      enabled: true,
    }),
  getStatistic: () =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'statistic'],
      queryFn: getStatistic,
      enabled: true,
    }),
}
