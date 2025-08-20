import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Eye,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AdminAccountResponse } from '@/api/actions/admin-account/admin-account.type'
import { Fragment, useState } from 'react'
import { useQuery } from '@/hooks'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { convertLocalTime } from '@/utils/helpers/convertLocalTime'
import { Button } from '@/components/ui/button'
import { parseStatusFilter } from '@/utils/parseStatusFilter'
import { TableSkeleton } from '@/components/common/table-loading'
import { ManageAccountAudit } from '../manage-account-audit'
import { ManageAccountSuspend } from '../manage-account-suspend'
import { ManageAccountDetail } from '../manage-account-detail'
import { ManageAccountChangePass } from '../manage-account-change-pass'

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<AdminAccountResponse | null>(
    null
  )
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false)
  const [userToChangePass, setUserToChangePass] =
    useState<AdminAccountResponse | null>(null)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [userToSuspend, setUserToSuspend] =
    useState<AdminAccountResponse | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [userToView, setUserToView] = useState<AdminAccountResponse | null>(
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
        return 'Active'
      case false:
        return 'Inactive'
      default:
        return 'Unknown'
    }
  }
  return (
    <Fragment>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10 text-center">#</TableHead>
                  <TableHead className="min-w-[200px]">
                    User Information
                  </TableHead>
                  <TableHead className="min-w-[180px]">Contact</TableHead>
                  <TableHead className="w-[160px]">Role</TableHead>
                  <TableHead className="w-[120px] text-center">
                    Status
                  </TableHead>
                  <TableHead className="w-[160px] text-center">
                    Last Activity
                  </TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton columns={6} rows={5} />
                ) : (
                  adminAccounts?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
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
                            <div
                              className="font-medium text-gray-900 cursor-pointer"
                              onClick={() => {
                                setUserToView(user)
                                setIsDetailModalOpen(true)
                              }}
                            >
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.id}
                            </div>
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
                          className={
                            getStatusColor(user.isActive) + ' text-center'
                          }
                        >
                          {getStatusText(user.isActive)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 text-center">
                          {convertLocalTime(user.lastActive)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={user.roleName === 'Admin'}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setUserToView(user)
                                setIsDetailModalOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setUserToEdit(user)
                                setIsEditModalOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setUserToChangePass(user)
                                setIsChangePassModalOpen(true)
                              }}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Change Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {user?.isActive ? (
                              <DropdownMenuItem
                                className="text-orange-600"
                                onSelect={e => {
                                  e.preventDefault()
                                  setUserToSuspend(user)
                                  setIsSuspendModalOpen(true)
                                }}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onSelect={e => {
                                  e.preventDefault()
                                  setUserToSuspend(user)
                                  setIsSuspendModalOpen(true)
                                }}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
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
      <ManageAccountSuspend
        isSuspendModalOpen={isSuspendModalOpen}
        setIsSuspendModalOpen={setIsSuspendModalOpen}
        id={userToSuspend?.id}
      />
      <ManageAccountChangePass
        isOpen={isChangePassModalOpen}
        setIsOpen={setIsChangePassModalOpen}
        userId={userToChangePass?.id}
        userName={userToChangePass?.fullName}
      />
      <ManageAccountAudit
        auditMode="update"
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        id={userToEdit?.id}
      />
      <ManageAccountDetail
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        id={userToView?.id}
      />
    </Fragment>
  )
}
