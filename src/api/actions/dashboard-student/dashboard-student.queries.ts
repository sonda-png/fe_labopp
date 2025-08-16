
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions';
import { AxiosInstance } from 'axios';
import { StudentProgressResponse, StudentProfileResponse } from './dashboard-student.types';

const getProgress = (client: AxiosInstance) => async () => {
	const { data } = await client.get<StudentProgressResponse>('/Assignment/my-progress');
	return data;
};

const getProfile = (client: AxiosInstance) => async () => {
	const { data } = await client.get<StudentProfileResponse>('/user/me');
	return data;
};

export const dashboardStudentQueries = {
	getProgress: () =>
		queryFactoryOptions<StudentProgressResponse>({
			queryKey: ['student-progress'],
			queryFn: getProgress,
		}),
	getProfile: () =>
		queryFactoryOptions<StudentProfileResponse>({
			queryKey: ['student-profile'],
			queryFn: getProfile,
		}),
};
