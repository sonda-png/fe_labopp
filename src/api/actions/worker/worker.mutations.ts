import { AxiosInstance } from "axios"
import { StartMultiWorkerArgs } from "./worker.type"

export const adminWorkerMutations = {
    startMultiWorker: (client: AxiosInstance) => startMultiWorker(client),
    startSingleWorker: (client: AxiosInstance) => startSingleWorker(client),
    stopAllWorker: (client: AxiosInstance) => stopAllWorker(client),
    stopSingleWorker: (client: AxiosInstance) => stopSingleWorker(client),
}

const startMultiWorker =
    (client: AxiosInstance) => async (body: StartMultiWorkerArgs) => {
        return (
            await client.post<string>(
                '/admin/start-workers',
                body
            )
        )
    }

const startSingleWorker =
    (client: AxiosInstance) => async (name: string) => {
        return (
            await client.post<string>(
                `/admin/start-worker/${name}`
            )
        )
    }

const stopAllWorker =
    (client: AxiosInstance) => async () => {
        return (
            await client.post<string>(
                '/admin/stop-workers',
            )
        )
    }

const stopSingleWorker =
    (client: AxiosInstance) => async (name: string) => {
        return (
            await client.post<string>(
                `/admin/stop-worker/${name}`,
            )
        )
    }