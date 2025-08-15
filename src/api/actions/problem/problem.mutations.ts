import { AxiosInstance } from 'axios'
import { CreateTestCaseArgs, CreateTestCaseFromFileArgs } from './problem.type'

export const problemMutations = {
  createTestCase: (client: AxiosInstance) => createTestCase(client),
  createTestCaseFromFile: (client: AxiosInstance) =>
    createTestCaseFromFile(client),
}

const createTestCase =
  (client: AxiosInstance) => async (body: CreateTestCaseArgs) => {
    return await client.post<string>(`/test-case`, body)
  }

const createTestCaseFromFile =
  (client: AxiosInstance) => async (body: CreateTestCaseFromFileArgs) => {
    const formData = new FormData()
    body.files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('problemId', body.assignmentId)

    return await client.post<string>(`/test-case/load-from-files`, formData)
  }
