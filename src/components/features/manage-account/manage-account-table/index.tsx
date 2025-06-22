import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  UserCheck,
  UserX,
  RefreshCw,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AdminAccountResponse } from '@/api/actions/admin-account/admin-account.type'
import { useState } from 'react'
import { useQuery } from '@/hooks'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { convertLocalTime } from '@/utils/helpers/convertLocalTime'
import { Button } from '@/components/ui/button'
import { parseStatusFilter } from '@/utils/parseStatusFilter'
import { TableSkeleton } from '@/components/common/table-loading'

interface ManageAccountTableProps {
  searchTerm: string
  roleFilter: string | undefined
  statusFilter: string | undefined
}

export const ManageAccountTable = ({
  searchTerm,
  roleFilter,
  statusFilter,
}: ManageAccountTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [userToEdit, setUserToEdit] = useState<AdminAccountResponse | null>(
    null
  )

  const { data: adminAccounts, isLoading } = useQuery({
    ...adminAccountQueries.getAll({
      keyword: searchTerm,
      roleId: roleFilter,
      isActive: parseStatusFilter(statusFilter),
    }),
  })

  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(adminAccounts?.map(user => Number(user.id)) || [])
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'role_admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'role_head':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'role_student':
        return 'bg-green-500 hover:bg-green-600'
      case 'role_teacher':
        return 'bg-yellow-500 hover:bg-yellow-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return 'bg-green-100 text-green-700 border-green-200'
      case false:
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: boolean) => {
    switch (status) {
      case true:
        return 'Hoạt động'
      case false:
        return 'Không hoạt động'
      default:
        return 'Không xác định'
    }
  }
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === adminAccounts?.length &&
                      adminAccounts?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Thông tin người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={6} rows={5} />
              ) : (
                adminAccounts?.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(Number(user.id))}
                        onCheckedChange={checked =>
                          handleSelectUser(Number(user.id), checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={'/placeholder.svg'} />
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {user.fullName
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-gray-500">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="mr-2 h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="mr-2 h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getRoleColor(
                          rolesData?.find(role => role.name === user.roleName)
                            ?.id || ''
                        )}
                      >
                        {
                          rolesData?.find(role => role.name === user.roleName)
                            ?.name
                        }
                      </Badge>
                      {user.department && (
                        <div className="text-xs text-gray-500 mt-1">
                          {user.department}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(user.isActive)}
                      >
                        {getStatusText(user.isActive)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {convertLocalTime(user.lastActive)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setUserToEdit(user)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setUserToEdit(user)
                              setIsResetPasswordModalOpen(true)
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset mật khẩu
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isActive ? (
                            <DropdownMenuItem
                              className="text-orange-600"
                              onClick={() => {
                                setUserToEdit(user)
                                setIsSuspendModalOpen(true)
                              }}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Tạm khóa
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setUserToEdit(user)
                              setIsDeleteModalOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa tài khoản
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
