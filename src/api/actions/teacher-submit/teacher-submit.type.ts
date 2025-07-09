// Response cho GET /waiting/{classId} và /{submissionId}
export interface TeacherSubmissionData {
  id: string;
  studentName: string;
  assignmentCode: string;
  submittedAt: string;
  loc: number;
  status: string;
  filePath: string;
  comment: string;
}

export interface TeacherSubmissionApiResponse {
  success: boolean;
  message: string | null;
  data: TeacherSubmissionData[];
  errors: any;
}

// Request cho POST /grade
export interface GradeSubmissionArgs {
  submissionId: string;
  isPass: boolean;
}

// Request cho POST /feedback
export interface FeedbackSubmissionArgs {
  submissionId: string;
  comment: string;
}

// Response cho 2 API POST
export interface TeacherSubmissionActionResponse {
  success: boolean;
  message: string | null;
  data: string;
  errors: any;
}
