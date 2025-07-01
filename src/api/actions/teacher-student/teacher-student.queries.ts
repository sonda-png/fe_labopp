import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AdminAccountQueryParams } from "../admin-account/admin-account.type";
import { AxiosInstance } from "axios";
import { TeacherStudentInClassResponse } from "./teacher-student.type";

export const teacherStudentQueries = {
    all: () => ['teacher-student'],
    getAll: (
        params?: string
    ) =>
        queryFactoryOptions({
            queryKey: [
                ...teacherStudentQueries.all(),
                'list',
                params ?? {},
            ],
            queryFn: getStudentInClass(params),
            enabled: true,
        }),
    
};

const getStudentInClass = (
    params?: string
) =>
    (client: AxiosInstance) =>
        async () => {

            return (
                await client.get<TeacherStudentInClassResponse>(`/teacher/students/in-class/${params}`)
            ).data
        }