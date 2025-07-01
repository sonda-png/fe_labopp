import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";


/* Teacher assignment queries */
export const teacherAssignmentQueries = {
    all: () => ['teacher-assignment'],
    getAll: (classId?: string) =>
        queryFactoryOptions({
            queryKey: [
                ...teacherAssignmentQueries.all(),
                'list',
            ],
            queryFn: getByClassId(classId),
            enabled: !!classId,
        }),
}


const getByClassId = (
    classId?: string
) =>
    (client: AxiosInstance) =>
        async () => {

            return (
                await client.get<void>(`/teacher/assignments/${classId}`)
            ).data
        }
