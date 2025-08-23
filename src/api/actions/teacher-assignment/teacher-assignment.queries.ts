import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import {
  TeacherAssignment,
  ViewJavaFileRequest,
  ViewJavaFileResponse,
  ViewSubmissionRequest,
} from './teacher-assignment.type'
import { objectToQueryString } from '@/utils/helpers/convertToQueryString'

/* Teacher assignment queries */
export const teacherAssignmentQueries = {
  all: () => ['teacher-assignment'],
  getAll: (classId?: string) =>
    queryFactoryOptions({
      queryKey: [...teacherAssignmentQueries.all(), 'list'],
      queryFn: getByClassId(classId),
      enabled: !!classId,
    }),
  getDetail: (assignmentId?: string) =>
    queryFactoryOptions({
      queryKey: [...teacherAssignmentQueries.all(), 'detail'],
      queryFn: getByAssignmentId(assignmentId),
      enabled: !!assignmentId,
    }),
  viewSubmission: (params?: ViewSubmissionRequest) =>
    queryFactoryOptions({
      queryKey: [...teacherAssignmentQueries.all(), 'view-submission'],
      queryFn: getViewSubmission(params),
      enabled: !!params,
    }),
  getViewJavaFile: (params?: ViewJavaFileRequest) =>
    queryFactoryOptions({
      queryKey: [...teacherAssignmentQueries.all(), 'view-java-file'],
      queryFn: getViewJavaFile(params),
      // enabled: !!params?.studentId && !!params?.classId && !!params?.assignmentId,
    }),
}

const getByClassId =
  (classId?: string) => (client: AxiosInstance) => async () => {
    return (
      await client.get<TeacherAssignment[]>(`/teacher/assignments/${classId}`)
    ).data
  }

const getByAssignmentId =
  (assignmentId?: string) => (client: AxiosInstance) => async () => {
    return (
      await client.get<TeacherAssignment>(
        `/teacher/assignments/detail/${assignmentId}`
      )
    ).data
  }

const getViewSubmission =
  (params?: ViewSubmissionRequest) => (client: AxiosInstance) => async () => {
    return (
      await client.get<string>(
        `/teacher/assignments/view-submission${objectToQueryString(params || {})}`
      )
    ).data
  }

const getViewJavaFile =
  (params?: ViewJavaFileRequest) => (client: AxiosInstance) => async () => {
    return (
      await client.get<ViewJavaFileResponse>(
        `/teacher/assignments/view-java/${params?.submissionId}`
      )
    ).data
  }
