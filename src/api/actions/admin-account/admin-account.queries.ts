import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import {
  AdminAccountListResponse,
  AdminAccountQueryParams,
  AdminAccountResponse,
} from './admin-account.type'
import { objectToQueryString } from '@/utils/helpers/convertToQueryString'

/* Admin account queries */
export const adminAccountQueries = {
  all: () => ['admin-account'],
  getAll: (params?: AdminAccountQueryParams) =>
    queryFactoryOptions({
      queryKey: [...adminAccountQueries.all(), 'list', params ?? {}],
      queryFn: getAdminAccountList(params),
      enabled: true,
    }),
  getDetail: (id: string | undefined) =>
    queryFactoryOptions({
      queryKey: [...adminAccountQueries.all(), 'detail', id],
      queryFn: getAdminAccount(id),
      enabled: !!id,
    }),
}

/* Get all admin accounts */
const getAdminAccountList =
  (params?: AdminAccountQueryParams) => (client: AxiosInstance) => async () => {
    return (
      await client.get<AdminAccountListResponse>(
        `/admin/accounts${objectToQueryString(params ?? {})}`
      )
    ).data
  }

/* Get admin account by id */
const getAdminAccount =
  (id: string | undefined) => (client: AxiosInstance) => async () => {
    if (id) {
      return (await client.get<AdminAccountResponse>(`/admin/accounts/${id}`))
        .data
    }
    return Promise.reject(new Error('ID is required'))
  }
