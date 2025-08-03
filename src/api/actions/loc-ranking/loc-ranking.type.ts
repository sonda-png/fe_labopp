export interface StudentRankingData {
  rank: number
  studentId: string
  fullName: string
  email: string
  passedAssignments: number
  totalLOC: number
}

export interface LocRankingResponse {
  success: boolean
  message: string
  data: StudentRankingData[]
  errors: null | string
}
