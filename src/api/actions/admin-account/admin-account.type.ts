export type AdminAccountResponse = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    /** Optional unique code (e.g., student/employee ID) */
    code?: string;
    roleName: string;
    department: string;
    isActive: boolean;
    lastActive: string;
};

export type AdminAccountListResponse = AdminAccountResponse[]

export type AdminAccountQueryParams = {
    keyword?: string;
    roleId?: string;
    isActive?: string;
}