import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import { AdminAccountListResponse, AdminAccountQueryParams, AdminAccountResponse } from "./admin-account.type";
import { objectToQueryString } from "@/utils/helpers/convertToQueryString";

/* Admin account queries */
export const adminAccountQueries = {
    all: () => ['admin-account'],
    getAll: (
        params?: AdminAccountQueryParams
    ) =>
        queryFactoryOptions({
            queryKey: [
                ...adminAccountQueries.all(),
                'list',
                params ?? {},
            ],
            queryFn: getAdminAccountList(params),
            enabled: true,
        }),
    get: (id: string) =>
        queryFactoryOptions({
            queryKey: [...adminAccountQueries.all(), 'detail', id],
            queryFn: getAdminAccount(id),
            enabled: true,
        }),
};

/* Get all admin accounts */
const getAdminAccountList = (
    params?: AdminAccountQueryParams
) =>
    (client: AxiosInstance) =>
        async () => {

            return (
                await client.get<AdminAccountListResponse>(`/admin/accounts${objectToQueryString(params ?? {})}`)
            ).data
        }

/* Get admin account by id */
const getAdminAccount = (id: string) =>
    (client: AxiosInstance) =>
        async () =>
            (
                await client.get<AdminAccountResponse>(`/admin/accounts/${id}`)
            ).data;
