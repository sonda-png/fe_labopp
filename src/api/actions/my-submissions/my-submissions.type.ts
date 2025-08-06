export type MySubmissionsResponse = MySubmissions[]

export type MySubmissions = {
    submissionId: string
    assignmentId: string
    fileName: string
    fileUrl: string
    status: string
    submittedAt: string
    locResult: number
    manuallyEdited: boolean
    manualReason: string | null
}

export type MySubmissionsQueryParams = {
    page: number
}
