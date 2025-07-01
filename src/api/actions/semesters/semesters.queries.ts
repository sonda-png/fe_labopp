import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios';
import { Semester } from './semesters.types';
/* Semesters queries */
export const semestersQueries = {
    all: () => ['semesters'],
    getAll: () =>
        queryFactoryOptions({
            queryKey: [
                ...semestersQueries.all(),
                'list',
            ],
            queryFn: getAllSemesters,
            enabled: true,
        }),
}

const getAllSemesters = (client: AxiosInstance) => async () => {
    return ((await client.get<Semester[]>('/head_subject/semester/semester')).data);
};