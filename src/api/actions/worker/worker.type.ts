export type StartMultiWorkerArgs = {
    classCode: string
}

export type WorkerResponse = {
    running: boolean
    activeWorkers: string[]
}

export type WorkerStatusResponse = {
    running: boolean
}