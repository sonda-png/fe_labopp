import { AxiosInstance } from "axios";
import { AuditTeacherAssignmentRequest, TeacherAssignment, UpdateTeacherAssignmentRequest } from "./teacher-assignment.type";

export const teacherAssignmentMutations = {
    createTeacherAssignment: (client: AxiosInstance) => handleCreateSemesterClass(client),
    updateTeacherAssignment: (client: AxiosInstance) => handleUpdateSemesterClass(client),
}

const handleCreateSemesterClass = (client: AxiosInstance) => async ({ params, body }: { params: string, body: AuditTeacherAssignmentRequest }) => {
    console.log(params, body)
    return (await client.post<TeacherAssignment>(`/teacher/assignments/${params}`, body)).data
}

const handleUpdateSemesterClass = (client: AxiosInstance) => async (body: UpdateTeacherAssignmentRequest) => {
    return (await client.put<TeacherAssignment>(`/teacher/assignments`, body)).data
}
