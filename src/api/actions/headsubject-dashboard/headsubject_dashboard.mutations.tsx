
import { AxiosInstance } from 'axios';
import { HeadSubjectCreateAssignmentRequest, HeadSubjectCreateClassResponse } from './headsubject_dashboard.types';

export const headSubjectDashboardMutations = {
	createClass: (data: HeadSubjectCreateAssignmentRequest) =>
		async (client: AxiosInstance): Promise<HeadSubjectCreateClassResponse> => {
			const res = await client.post<HeadSubjectCreateClassResponse>(
				'/head_subject/semester/class',
				data
			);
			return res.data;
		},
};
