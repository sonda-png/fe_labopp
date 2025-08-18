
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions';
import { AxiosInstance } from 'axios';
import { TeacherClass, DashboardData, TeacherStudentProgressResponse } from './teacher-dashboard.type';

const getDashboard = (classId: string) => (client: AxiosInstance) => async () => {
  return (await client.get<DashboardData>(`/teacher/dashboard/getDashboard/${classId}`)).data;
};

const getClassList = (teacherId: string) => (client: AxiosInstance) => async () => {
  return (await client.get<TeacherClass[]>(`/teacher/dashboard/getClass/${teacherId}`)).data;
};

const getStudentsProgressByClass = (classId: string) => (client: AxiosInstance) => async () => {
  return (
    await client.get<TeacherStudentProgressResponse>(
      `/teacher/students/class/${classId}/students-progress`
    )
  ).data;
};

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
  getStudentsProgressByClass: (classId: string) =>
    queryFactoryOptions<TeacherStudentProgressResponse>({
      queryKey: ['teacher-students-progress', classId],
      queryFn: getStudentsProgressByClass(classId),
    }),
};
