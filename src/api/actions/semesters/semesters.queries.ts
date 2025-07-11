import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios';
import { Semester, SemesterByClassRequest } from './semesters.types';
import { objectToQueryString } from '@/utils/helpers/convertToQueryString';
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
    getSemesterByClass: (params: SemesterByClassRequest) =>
        queryFactoryOptions({
            queryKey: [
                ...semestersQueries.all(),
                'class',
                params,
            ],
            queryFn: (client: AxiosInstance) => getSemesterByClass(params)(client),
        }),
}

const getAllSemesters = (client: AxiosInstance) => async () => {
    return ((await client.get<Semester[]>('/head_subject/semester/semester')).data);
};

const getSemesterByClass = (
    params?: SemesterByClassRequest
) =>
    (client: AxiosInstance) =>
        async () => {

            return (
                await client.get<Semester>(`/head_subject/semester/classes${objectToQueryString(params ?? {})}`)
            ).data
        }
