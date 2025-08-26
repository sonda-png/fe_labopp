import { AxiosInstance } from 'axios'
import {
  Assignment,
  AssignmentAllClassResponse,
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
      '/head_subject/assignment/statistics/all'
    )
  ).data
}

const getAssignmentById =
  (id: string | undefined) => (client: AxiosInstance) => async () => {
    return (await client.get<Assignment>(`/head_subject/assignment/${id}`)).data
  }

const getAllClass = (client: AxiosInstance) => async () => {
  return (
    await client.get<AssignmentAllClassResponse>(
      `/head_subject/assignment/allclasses`
    )
  )
}

export const assignmentManageQueries = {
  all: () => ['assignments'],
  get: () =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'get'],
      queryFn: getAssignment,
      enabled: true,
    }),
  getDetail: (id: string | undefined) =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'detail', id],
      queryFn: getAssignmentById(id),
      enabled: !!id,
    }),
  getStatistic: () =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'statistic'],
      queryFn: getStatistic,
      enabled: true,
    }),
  getAllClass: () =>
    queryFactoryOptions({
      queryKey: [...assignmentManageQueries.all(), 'class'],
      queryFn: getAllClass,
      enabled: true,
    }),
}
