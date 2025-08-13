import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import { WorkerResponse, WorkerStatusResponse } from "./worker.type";

export const workerQueries = {
    all: () => ['worker'],
    getAllWorker: () =>
        queryFactoryOptions({
            queryKey: ['list'],
            queryFn: getAllWorker,
        }),
    getStatus: () =>
        queryFactoryOptions({
            queryKey: ['status'],
            queryFn: getStatus,
        }),
}

const getAllWorker = (client: AxiosInstance) => async () => {
    return (
        (await client.get<WorkerResponse>(
            '/admin/workers'
        )).data
    )
}

const getStatus = (client: AxiosInstance) => async () => {
    return (
        (await client.get<WorkerStatusResponse>(
            '/admin/status'
        )).data
    )
}