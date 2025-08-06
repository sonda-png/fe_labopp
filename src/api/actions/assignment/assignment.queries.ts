import { AxiosInstance } from "axios"
import { Assignment, AssignmentListResponse } from "./assignment.type"
import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions"

/* My submissions queries */
export const assignmentQueries = {
    all: () => ['assignmentQueries'],
    getAll: () =>
        queryFactoryOptions({
            queryKey: [...assignmentQueries.all(), 'list'],
            queryFn: getAllAssignments(),
            enabled: true,
        }),
    getById: (id: string) =>
        queryFactoryOptions({
            queryKey: [...assignmentQueries.all(), 'detail', id],
            queryFn: getAssignmentById(id),
            enabled: !!id,
        }),

}

/* Get all my submissions */
const getAllAssignments =
    () => (client: AxiosInstance) => async () => {
        return (
            await client.get<AssignmentListResponse>(
                `/assignment/student`
            )
        ).data
    }

/* Get assignment by id */
export const getAssignmentById =
    (id: string) => (client: AxiosInstance) => async () => {
        return (
            await client.get<Assignment>(
                `/assignment/${id}`
            )
        ).data
    }
