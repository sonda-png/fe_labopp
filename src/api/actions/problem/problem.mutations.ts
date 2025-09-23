import { AxiosInstance } from 'axios'
import {
  CreateTestCaseArgs,
  CreateTestCaseFromFileArgs,
  UpdateTestCaseFromFileArgs,
} from './problem.type'

export const problemMutations = {
  createTestCase: (client: AxiosInstance) => createTestCase(client),
  createTestCaseFromFile: (client: AxiosInstance) =>
    createTestCaseFromFile(client),
  updateTestCase: (client: AxiosInstance) => updateTestCaseFromFile(client),
  deleteTestCase: (client: AxiosInstance) => deleteTestCase(client),
}

const createTestCase =
  (client: AxiosInstance) => async (body: CreateTestCaseArgs) => {
    return await client.post<string>(`/test-case`, body)
  }

const deleteTestCase = (client: AxiosInstance) => async (id: string) => {
  return await client.delete<string>(`/test-case/testcase/${id}`)
}

const createTestCaseFromFile =
  (client: AxiosInstance) => async (body: CreateTestCaseFromFileArgs) => {
    const formData = new FormData()
    body.files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('descriptions', body.descriptions)
    formData.append('assignmentId', body.assignmentId)

    return await client.post<string>(`/test-case/load-from-files`, formData)
  }

const updateTestCaseFromFile =
  (client: AxiosInstance) => async (body: UpdateTestCaseFromFileArgs) => {
    const formData = new FormData()
    body.files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('description', body.descriptions)
    formData.append('assignmentId', body.assignmentId)

    return await client.put<string>(
       `/test-case/testcase/${body.id}/update-from-files`,
      formData
    )
  }
