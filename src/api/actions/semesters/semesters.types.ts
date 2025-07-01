export type CreateSemesterArgs = {
    name: string
    startDate: string
    endDate: string
}

export type SemesterResponse = {
    id: string
    name: string
    semester: number
    academicYear: string
    isActive: boolean
    createdAt: string
}