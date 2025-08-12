export type StartMultiWorkerArgs = {
    classCode: string
    count: number
}

export type WorkerResponse = {
    running: boolean
    activeWorkers: string[]
}

export type WorkerStatusResponse = {
    running: boolean
}