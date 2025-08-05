import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { MySubmissionsResponse } from './my-submissions.type'

/* Admin account queries */
export const mySubmissionsQueries = {
  all: () => ['admin-account'],
  getAll: () =>
    queryFactoryOptions({
      queryKey: [...mySubmissionsQueries.all(), 'list'],
      queryFn: getAllMySubmissions(),
      enabled: true,
    }),

}

/* Get all admin accounts */
const getAllMySubmissions =
  () => (client: AxiosInstance) => async () => {
    return (
      await client.get<MySubmissionsResponse>(
        `/assignment/my-submissions`
      )
    ).data
  }

