import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import {
  TeacherStudentInClassResponse,
  StudentProgressResponse,
} from './teacher-student.type'

export const teacherStudentQueries = {
  all: () => ['teacher-student'],
  getAll: (params?: string) =>
    queryFactoryOptions({
      queryKey: [...teacherStudentQueries.all(), 'list', params ?? {}],
      queryFn: getStudentInClass(params),
      enabled: !!params,
    }),

  getStudentDetail: (classId: string, studentId: string) =>
    queryFactoryOptions({
      queryKey: [...teacherStudentQueries.all(), 'detail', classId, studentId],
      queryFn: getStudentDetail(classId, studentId),
      enabled: !!(classId && studentId),
    }),
  exportData: (classId: string) =>
    queryFactoryOptions({
      queryKey: [...teacherStudentQueries.all(), 'export', classId],
      queryFn: exportData(classId),
      enabled: !!classId,
    }),
}

const exportData = (classId: string) => (client: AxiosInstance) => async () => {
  return (
    await client.get<StudentProgressResponse>(
      `/teacher/students/export/${classId}`
    )
  ).data
}

const getStudentInClass =
  (params?: string) =>
  (client: AxiosInstance) =>
  async (): Promise<TeacherStudentInClassResponse> => {
    return (
      await client.get<TeacherStudentInClassResponse>(
        `/teacher/students/in-class/${params}`
      )
    ).data
  }

const getStudentDetail =
  (classId: string, studentId: string) =>
  (client: AxiosInstance) =>
  async (): Promise<StudentProgressResponse> => {
    return (
      await client.get<StudentProgressResponse>(
        `/teacher/students/${classId}/${studentId}`
      )
    ).data
  }
