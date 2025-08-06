import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { MySubmissionsResponse } from './my-submissions.type'

/* My submissions queries */
export const mySubmissionsQueries = {
  all: () => ['my-submissions'],
  getAll: () =>
    queryFactoryOptions({
      queryKey: [...mySubmissionsQueries.all(), 'list'],
      queryFn: getAllMySubmissions(),
      enabled: true,
    }),

}

/* Get all my submissions */
const getAllMySubmissions =
  () => (client: AxiosInstance) => async () => {
    return (
      await client.get<MySubmissionsResponse>(
        `/assignment/my-submissions`
      )
    ).data
  }

