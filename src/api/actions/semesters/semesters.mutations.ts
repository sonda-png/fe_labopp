import { AxiosInstance } from 'axios'
import { CreateSemesterRequest, Semester } from './semesters.types'

export const semestersMutations = {
  createSemesterClass: (client: AxiosInstance) =>
    handleCreateSemesterClass(client),
}

const handleCreateSemesterClass =
  (client: AxiosInstance) => async (body: CreateSemesterRequest) => {
    return (await client.post<Semester>('/head_subject/semester/class', body))
      .data
  }
