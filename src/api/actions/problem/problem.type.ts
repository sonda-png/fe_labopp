export type CreateTestCaseArgs = {
  assignmentId: string
  title: string
  testCases: TestCaseArgs[]
}

export type CreateTestCaseFromFileArgs = {
  assignmentId: string
  descriptions: string
  files: File[]
}

export type UpdateTestCaseFromFileArgs = CreateTestCaseFromFileArgs & {
  id: string
}

export type TestCaseArgs = {
  input: string
  expectedOutput: string
  loc: number
}

export type TestCaseResponse = {
  id: string
  assignmentId: string
  expectedOutput: string
  input: string
  loc: number
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}
