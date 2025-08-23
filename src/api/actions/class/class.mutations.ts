import { AxiosInstance } from 'axios'

export const classMutations = {
  startClassMutation: (client: AxiosInstance) => startClassMutation(client),
  stopClassMutation: (client: AxiosInstance) => stopClassMutation(client),
}

const startClassMutation =
  (client: AxiosInstance) => async (classId: string) => {
    return (await client.post<string>(`teacher/class/start?classId=${classId}`)).data
  }

const stopClassMutation = (client: AxiosInstance) => async (classId: string) => {
  return (await client.post<string>(`teacher/class/stop?classId=${classId}`)).data
}
