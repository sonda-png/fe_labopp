import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { TeacherClass, DashboardData } from './teacher-dashboard.type'

export const teacherDashboardQueries = {
  dashboard: (classId: string) =>
    queryFactoryOptions({
      queryKey: ['teacher-dashboard', classId],
      queryFn: getDashboard(classId),
      enabled: !!classId,
    }),
  classList: (teacherId: string) =>
    queryFactoryOptions({
      queryKey: ['teacher-class-list', teacherId],
      queryFn: getClassList(teacherId),
      enabled: !!teacherId,
    }),
}

function getDashboard(classId: string) {
  return (client: AxiosInstance) => async () => {
    return (
      await client.get<DashboardData>(
        `/teacher/dashboard/getDashboard/${classId}`
      )
    ).data
  }
}

function getClassList(teacherId: string) {
  return (client: AxiosInstance) => async () => {
    return (
      await client.get<TeacherClass[]>(
        `/teacher/dashboard/getClass/${teacherId}`
      )
    ).data
  }
}
