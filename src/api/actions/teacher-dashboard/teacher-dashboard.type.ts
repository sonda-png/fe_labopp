
// Students progress in a class
export interface TeacherStudentProgressItem {
  studentId: string;
  studentName: string;
  totalLoc: number;
  completedAssignments: number;
  totalAssignments: number;
}

export type TeacherStudentProgressResponse = TeacherStudentProgressItem[];
// Dashboard for a specific class
export interface RecentAssignment {
  title: string
  code: string
  targetLOC: number
  passedCount: number
  totalSubmission: number
}

export interface RecentSubmission {
  studentName: string
  assignmentCode: string
  submittedAt: string
  status: string
  loc: number
}

export interface DashboardData {
  totalStudents: number
  totalAssignments: number
  submissionsWaitingReview: number
  passRate: number
  recentAssignments: RecentAssignment[]
  recentSubmissions: RecentSubmission[]
}

export interface DashboardResponse {
  success: boolean
  message: string
  data: DashboardData
  errors: any
}

// Class list for a teacher
export interface TeacherClass {
  id: string
  name: string
  subject: string
  semester: number
  academicYear: string
  locToPass: number
  isActive: boolean
}

export interface TeacherClassListResponse {
  success: boolean
  message: string
  data: TeacherClass[]
  errors: any
}
