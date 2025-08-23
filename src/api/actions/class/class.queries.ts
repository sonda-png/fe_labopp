import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { ClassStatus } from './class.type'

const getCurrentStatus =
  (classId: string) => (client: AxiosInstance) => async () => {
    return (await client.get<ClassStatus>(`/teacher/class/status/${classId}`))
      .data
  }

const getAllClasses = () => (client: AxiosInstance) => async () => {
  return (await client.get<ClassStatus[]>(`/teacher/class/status/all`)).data
}

export const classQueries = {
  all: () => ['class'],
  getCurrentStatus: (classId: string) =>
    queryFactoryOptions({
      queryKey: ['current', classId],
      queryFn: getCurrentStatus(classId),
    }),
  getAll: () =>
    queryFactoryOptions({
      queryKey: ['all'],
      queryFn: getAllClasses(),
    }),
}
