import { ReactNode, useState } from 'react'
import {
  Search,
  Trash2,
  Plus,
  UserX,
  Download,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AdminAccountResponse } from '@/api/actions/admin-account/admin-account.type'
import { useQuery } from '@/hooks'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { ManageAccountOverview } from '@/components/features/manage-account'
import { ManageAccountTable } from '@/components/features/manage-account/manage-account-table'
import DebouncedInput from '@/components/common/debounce-input'

export const ManageAccountPage = (): ReactNode => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<AdminAccountResponse | null>(
    null
  )

  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })

  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600">Quản lý tài khoản người dùng</p>
        </div>
      </div>
      <div>
        {/* Overview */}
        <ManageAccountOverview />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

              <DebouncedInput
                value={searchTerm}
                onChange={setSearchTerm}
                delay={3000}
                placeholder="Tìm kiếm theo tên, email, MSSV..."
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                {rolesData?.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3">
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedUsers.length} users
                </span>
                <Button size="sm" variant="outline">
                  <UserX className="mr-2 h-4 w-4" />
                  Khóa tài khoản
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            )}

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo tài khoản người dùng mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin để tạo tài khoản mới cho hệ thống
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Nhập họ và tên" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Nhập email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="Nhập số điện thoại" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="teacher">Giảng viên</SelectItem>
                        <SelectItem value="student">Sinh viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Khoa/Phòng ban</Label>
                    <Input id="department" placeholder="Nhập khoa/phòng ban" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Mã nhân viên/MSSV</Label>
                    <Input id="employee-id" placeholder="Nhập mã" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Tạo tài khoản
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin cho {userToEdit?.fullName}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Họ và tên</Label>
                    <Input id="edit-name" defaultValue={userToEdit?.fullName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      defaultValue={userToEdit?.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Số điện thoại</Label>
                    <Input id="edit-phone" defaultValue={userToEdit?.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Vai trò</Label>
                    <Select defaultValue={userToEdit?.roleName}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="teacher">Giảng viên</SelectItem>
                        <SelectItem value="student">Sinh viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Khoa/Phòng ban</Label>
                    <Input
                      id="edit-department"
                      defaultValue={userToEdit?.department}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-employee-id">Mã nhân viên/MSSV</Label>
                    <Input
                      id="edit-employee-id"
                      defaultValue={userToEdit?.code || userToEdit?.code}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Cập nhật
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Reset Password Modal */}
            <Dialog
              open={isResetPasswordModalOpen}
              onOpenChange={setIsResetPasswordModalOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Reset mật khẩu</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn reset mật khẩu cho{' '}
                    {userToEdit?.fullName}?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-600">
                    Mật khẩu mới sẽ được gửi qua email: {userToEdit?.email}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Xác nhận reset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Suspend User Modal */}
            <Dialog
              open={isSuspendModalOpen}
              onOpenChange={setIsSuspendModalOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                    Tạm khóa tài khoản
                  </DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn tạm khóa tài khoản của{' '}
                    {userToEdit?.fullName}?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <Label htmlFor="suspend-reason">Lý do tạm khóa</Label>
                    <Input
                      id="suspend-reason"
                      placeholder="Nhập lý do tạm khóa..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSuspendModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button variant="destructive">Tạm khóa</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete User Modal */}
            <Dialog
              open={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-red-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Xóa tài khoản
                  </DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của{' '}
                    {userToEdit?.fullName}?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Cảnh báo:</strong> Hành động này không thể hoàn
                      tác. Tất cả dữ liệu liên quan đến tài khoản này sẽ bị xóa
                      vĩnh viễn.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="delete-confirm">
                      Để xác nhận, vui lòng nhập tên người dùng
                    </Label>
                    <Input
                      id="delete-confirm"
                      placeholder={userToEdit?.fullName}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button variant="destructive">Xóa vĩnh viễn</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ManageAccountTable
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  )
}
