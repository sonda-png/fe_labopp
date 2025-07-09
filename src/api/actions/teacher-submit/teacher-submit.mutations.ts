import { AxiosInstance } from "axios";
import {
  GradeSubmissionArgs,
  FeedbackSubmissionArgs,
  TeacherSubmissionActionResponse,
} from "./teacher-submit.type";

export const teacherSubmissionMutations = {
  grade: (client: AxiosInstance) => handleGradeSubmission(client),
  feedback: (client: AxiosInstance) => handleFeedbackSubmission(client),
};

const handleGradeSubmission = (client: AxiosInstance) => async (body: GradeSubmissionArgs) => {
  return (
    await client.post<TeacherSubmissionActionResponse>('/teacher/submissions/grade', body)
  ).data;
};

const handleFeedbackSubmission = (client: AxiosInstance) => async (body: FeedbackSubmissionArgs) => {
  return (
    await client.post<TeacherSubmissionActionResponse>('/teacher/submissions/feedback', body)
  ).data;
};
