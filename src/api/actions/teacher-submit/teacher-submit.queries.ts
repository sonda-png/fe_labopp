import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import {
  TeacherSubmissionApiResponse,
  SubmissionStatus,
  TeacherSubmissionDetailData
} from "./teacher-submit.type";

// Lấy danh sách submission chờ chấm theo classId và status
const getWaitingSubmissions = (classId: string, status?: SubmissionStatus) =>
  (client: AxiosInstance) =>
    async () => {
      const params = status ? { params: { status } } : undefined
      return (
        await client.get<TeacherSubmissionApiResponse>(`/teacher/submissions/waiting/${classId}`, params)
      ).data;
    };

// Lấy chi tiết submission theo submissionId
const getSubmissionDetail = (submissionId: string) =>
  (client: AxiosInstance) =>
    async () => {
      return (
        await client.get<TeacherSubmissionDetailData>(`/teacher/submissions/${submissionId}`)
      ).data;
    };

export const teacherSubmissionQueries = {
  all: () => ['teacher-submission'],
  getWaiting: (classId: string, status?: SubmissionStatus) =>
    queryFactoryOptions({
      queryKey: ['teacher-submission', 'waiting', classId, status],
      queryFn: getWaitingSubmissions(classId, status),
      enabled: !!classId,
    }),
  getDetail: (submissionId: string) =>
    queryFactoryOptions({
      queryKey: ['teacher-submission', 'detail', submissionId],
      queryFn: getSubmissionDetail(submissionId),
      enabled: !!submissionId,
    }),
};
