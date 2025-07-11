import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import {
  TeacherSubmissionApiResponse,
  
} from "./teacher-submit.type";

// Lấy danh sách submission chờ chấm theo classId
const getWaitingSubmissions = (classId: string) =>
  (client: AxiosInstance) =>
    async () => {
      return (
        await client.get<TeacherSubmissionApiResponse>(`/teacher/submissions/waiting/${classId}`)
      ).data;
    };

// Lấy chi tiết submission theo submissionId
const getSubmissionDetail = (submissionId: string) =>
  (client: AxiosInstance) =>
    async () => {
      return (
        await client.get<TeacherSubmissionApiResponse>(`/teacher/submissions/${submissionId}`)
      ).data;
    };

export const teacherSubmissionQueries = {
  all: () => ['teacher-submission'],
  getWaiting: (classId: string) =>
    queryFactoryOptions({
      queryKey: ['teacher-submission', 'waiting', classId],
      queryFn: getWaitingSubmissions(classId),
      enabled: !!classId,
    }),
  getDetail: (submissionId: string) =>
    queryFactoryOptions({
      queryKey: ['teacher-submission', 'detail', submissionId],
      queryFn: getSubmissionDetail(submissionId),
      enabled: !!submissionId,
    }),
};
