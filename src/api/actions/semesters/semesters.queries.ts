import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { SemesterResponse } from "./semesters.types";
import { AxiosInstance } from "axios";

/* Semesters queries */
export const semestersQueries = {
    all: () => ['semesters'],
    getAll: (
    ) =>
        queryFactoryOptions({
            queryKey: [
                ...semestersQueries.all(),
                'list',
            ],
            queryFn: getSemestersList,
            enabled: true,
        }),
}

const getSemestersList = (client: AxiosInstance) => async () => {
    return (await client.get<SemesterResponse[]>('/head_subject/semester/semester')).data
}