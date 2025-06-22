export type AssignmentListResponse = {
    id : string,
    title: string,
    description: string,
    locTotal: number,
    teacherId : string
}[]

export type AssignmentRequest = {
    id : string,
    title: string,
    description: string,
    locTotal: number,
    teacherId : string
}
