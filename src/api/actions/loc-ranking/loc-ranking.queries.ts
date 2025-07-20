import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions"
import { AxiosInstance } from "axios"
import { LocRankingResponse, StudentRankingData } from "./loc-ranking.type"

export const locRankingQueries = {
    all: () => ['loc-ranking'],
    getLocRanking: (classId: string) =>
        queryFactoryOptions<LocRankingResponse>({
            queryKey: [...locRankingQueries.all(), 'getLocRanking', classId],
            queryFn: (client: AxiosInstance) => () =>
                client.get<StudentRankingData[]>(`/teacher/loc/ranking/${classId}`)
                    .then(res => ({
                        success: true,
                        message: "Success",
                        data: res.data,
                        errors: null
                    }))
        }),
}