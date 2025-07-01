import { AxiosInstance } from "axios";
import { AuditAccountArgs, ChangePassArgs, ChangeStatusAccountArgs, UpdateAccountArgs } from "./admin-account.type";

export const accountMutations = {
    createAccount: (client: AxiosInstance) => handleCreateAccount(client),
    updateAccount: (client: AxiosInstance) => handleUpdateAccount(client),
    changeStatusAccount: (client: AxiosInstance) => handleChangeStatusAccount(client),
    changePass: (client: AxiosInstance) => handleChangePass(client),
}


const handleCreateAccount = (client: AxiosInstance) => async (body: AuditAccountArgs) => {
    return await client.post<void>('/admin/accounts', body)
}

const handleUpdateAccount = (client: AxiosInstance) => async (body: UpdateAccountArgs) => {
    return await client.put<void>('/admin/accounts', body)
}

const handleChangeStatusAccount = (client: AxiosInstance) => async (body: ChangeStatusAccountArgs) => {
    return await client.post<void>('/admin/accounts/status', body)
}

const handleChangePass = (client: AxiosInstance) => async (body: ChangePassArgs) => {
    return await client.post<void>('/admin/accounts/change-password', body)
}