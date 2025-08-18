
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions';
import { AxiosInstance } from 'axios';
import { HeadSubjectAssignmentStatisticsResponse, HeadSubjectOverviewResponse } from './headsubject_dashboard.types';
// Query lấy tổng quan head subject
const getHeadSubjectOverview = (client: AxiosInstance) => async () => {
	return (
		await client.get<HeadSubjectOverviewResponse>(
			'/head_subject/dashboard/overview'
		)
	).data;
};

const getAssignmentStatisticsAll = (client: AxiosInstance) => async () => {
	return (
		await client.get<HeadSubjectAssignmentStatisticsResponse>(
			'/head_subject/assignment/statistics/all'
		)
	).data;
};

export const headSubjectDashboardQueries = {
	getAssignmentStatisticsAll: () =>
		queryFactoryOptions<HeadSubjectAssignmentStatisticsResponse>({
			queryKey: ['headsubject-assignment-statistics-all'],
			queryFn: getAssignmentStatisticsAll,
		}),
	getOverview: () =>
		queryFactoryOptions<HeadSubjectOverviewResponse>({
			queryKey: ['headsubject-overview'],
			queryFn: getHeadSubjectOverview,
		}),
};
