import { AxiosInstance } from 'axios'
import { SyncFapResponse } from './sync-fap.type'

export const syncFapMutations = {
  handleSyncFap: (client: AxiosInstance) => handleSyncFap(client),
}

const handleSyncFap = (client: AxiosInstance) => async () => {
  return (await client.post<SyncFapResponse>(`/fap-sync/sync`))
}
