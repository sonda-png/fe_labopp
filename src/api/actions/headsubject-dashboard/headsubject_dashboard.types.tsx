
export interface HeadSubjectCreateClassResponse {
	success: boolean;
	message: string;
	data: string; // id của lớp học vừa tạo
	errors: any;
}

export interface HeadSubjectCreateAssignmentRequest {
	name: string;
	subject: string;
	semester: number;
	academicYear: string;
	locToPass: number;
	teacherId: string;
	isActive: boolean;
}

export interface HeadSubjectOverview {
	totalTeachers: number;
	totalClasses: number;
	totalStudents: number;
}

export type HeadSubjectOverviewResponse = HeadSubjectOverview;

export interface HeadSubjectAssignmentStatisticsItem {
	classId: string;
	className: string;
	totalStudents: number;
	studentsPassed: number;
	passRate: number;
}

export type HeadSubjectAssignmentStatisticsResponse = HeadSubjectAssignmentStatisticsItem[];
