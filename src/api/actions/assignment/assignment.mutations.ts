import { AxiosInstance } from 'axios'
import { AssignmentSubmitRequest } from './assignment.type'


// ADD assignment
const handleSubmitAssignment =
    (client: AxiosInstance) =>
        async (body: AssignmentSubmitRequest): Promise<void> => {
            const formData = new FormData();

            formData.append('AssignmentId', body.assignmentId);
            formData.append('ZipFile', body.zipFile);

            return (await client.post<void>('/assignment/submit', formData)).data;
        };




// Export mutations object
export const assignmentMutations = {
    handleSubmitAssignment: (client: AxiosInstance) => handleSubmitAssignment(client),
}
