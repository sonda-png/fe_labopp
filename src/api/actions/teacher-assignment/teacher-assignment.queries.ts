import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import { TeacherAssignment } from "./teacher-assignment.type";


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
    getDetail: (assignmentId?: string) =>
        queryFactoryOptions({
            queryKey: [
                ...teacherAssignmentQueries.all(),
                'detail',
            ],
            queryFn: getByAssignmentId(assignmentId),
            enabled: !!assignmentId,
        }),
}


const getByClassId = (
    classId?: string
) =>
    (client: AxiosInstance) =>
        async () => {

            return (
                await client.get<TeacherAssignment[]>(`/teacher/assignments/${classId}`)
            ).data
        }


const getByAssignmentId = (
    assignmentId?: string
) =>
    (client: AxiosInstance) =>
        async () => {
            return (await client.get<TeacherAssignment>(`/teacher/assignments/detail/${assignmentId}`)).data
        }