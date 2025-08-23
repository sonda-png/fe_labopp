import { AxiosInstance } from 'axios'
import {
  AdminDashboardTimelineResponse,
  AdminDashboardTimelineRequest,
} from './admin-dashboard.type'
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'

const getRecentTimelinePaged = (params: AdminDashboardTimelineRequest) => 
  (client: AxiosInstance) => async () => {
    const { pageNumber, pageSize } = params
    return await client.get<AdminDashboardTimelineResponse>(
      `/AdminDashboard/recent-timeline-paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
  }

export const adminDashboardQueries = {
  all: () => ['admin-dashboard'],
  
  getRecentTimelinePaged: (params: AdminDashboardTimelineRequest) =>
    queryFactoryOptions({
      queryKey: [...adminDashboardQueries.all(), 'recent-timeline-paged', params],
      queryFn: getRecentTimelinePaged(params),
      enabled: true,
    }),
}