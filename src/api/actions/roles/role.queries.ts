import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { AxiosInstance } from "axios";
import { RoleListResponse } from "./role.type";

export const roleQueries = {
    all: () => ['roles'],
    getAll: () =>
        queryFactoryOptions({
            queryKey: [...roleQueries.all(), 'all'],
            queryFn: getRoleList,
            enabled: true,
        }),

};

const getRoleList = (client: AxiosInstance) => async () => {
    return ((await client.get<RoleListResponse>('/admin/roles')).data);
};
