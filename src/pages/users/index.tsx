import { ReactNode, useState } from 'react'
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Download,
  Upload,
  RefreshCw,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

// Mock data for users
type User = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  avatar: string
  createdAt: string
  lastLogin: string
  classesAssigned?: string[]
  department?: string
  employeeId?: string
  studentId?: string
  class?: string
  major?: string
  year?: string
}

const users: User[] = [
  {
    id: 1,
    name: 'Nguyễn Thị Hải Nàng',
    email: 'nangnth@fpt.edu.vn',
    phone: '0901234567',
    role: 'teacher',
    status: 'active',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20 14:30',
    classesAssigned: ['LAB211-SE1973', 'LAB211-SE1968'],
    department: 'Khoa Công nghệ Thông tin',
    employeeId: 'GV001',
  },
  {
    id: 2,
    name: 'Nguyễn Đình Mạnh Linh',
    email: 'linhnm@fpt.edu.vn',
    phone: '0901234568',
    role: 'teacher',
    status: 'active',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19 09:15',
    classesAssigned: ['LAB211-IA1908', 'LAB211-SE1967'],
    department: 'Khoa Công nghệ Thông tin',
    employeeId: 'GV002',
  },
  {
    id: 3,
    name: 'Trịnh Đình Dũng',
    email: 'dunghe173241@fpt.edu.vn',
    phone: '0901234569',
    role: 'student',
    status: 'active',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-20 16:45',
    studentId: 'HE173241',
    class: 'LAB211-SE1973',
    major: 'Kỹ thuật phần mềm',
    year: '2021',
  },
  {
    id: 4,
    name: 'Nguyễn Tuấn Hùng',
    email: 'hungnthe194829@fpt.edu.vn',
    phone: '0901234570',
    role: 'student',
    status: 'active',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-08',
    lastLogin: '2024-01-18 11:20',
    studentId: 'HE194829',
    class: 'LAB211-SE1973',
    major: 'Kỹ thuật phần mềm',
    year: '2021',
  },
  {
    id: 5,
    name: 'Nguyễn Văn Admin',
    email: 'admin@fpt.edu.vn',
    phone: '0901234571',
    role: 'admin',
    status: 'active',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-20 08:00',
    department: 'Phòng Đào tạo',
    employeeId: 'AD001',
  },
  {
    id: 6,
    name: 'Lê Hoàng Cường',
    email: 'cuonglh@fpt.edu.vn',
    phone: '0901234572',
    role: 'student',
    status: 'suspended',
    avatar: '/placeholder.svg?height=40&width=40',
    createdAt: '2024-01-12',
    lastLogin: '2024-01-15 13:30',
    studentId: 'HE181203',
    class: 'LAB211-IA1908',
    major: 'An toàn thông tin',
    year: '2021',
  },
]

export const UsersPage = (): ReactNode => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'teacher':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'student':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'teacher':
        return 'Giảng viên'
      case 'student':
        return 'Sinh viên'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động'
      case 'inactive':
        return 'Không hoạt động'
      case 'suspended':
        return 'Tạm khóa'
      default:
        return 'Không xác định'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId &&
        user.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.employeeId &&
        user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id))
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

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  }

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tạm khóa</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.suspended}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email, MSSV..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="teacher">Giảng viên</SelectItem>
                <SelectItem value="student">Sinh viên</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc nâng cao
            </Button>
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
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>

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
                    Cập nhật thông tin cho {userToEdit?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Họ và tên</Label>
                    <Input id="edit-name" defaultValue={userToEdit?.name} />
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
                    <Select defaultValue={userToEdit?.role}>
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
                      defaultValue={
                        userToEdit?.employeeId || userToEdit?.studentId
                      }
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
                    Bạn có chắc chắn muốn reset mật khẩu cho {userToEdit?.name}?
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
                    {userToEdit?.name}?
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
                    {userToEdit?.name}?
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
                    <Input id="delete-confirm" placeholder={userToEdit?.name} />
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

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 w-12">
                      <Checkbox
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Thông tin người dùng
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Liên hệ
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Vai trò
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Trạng thái
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Hoạt động cuối
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={checked =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatar || '/placeholder.svg'}
                            />
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {user.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.role === 'student'
                                ? `MSSV: ${user.studentId}`
                                : user.role === 'teacher'
                                  ? `Mã GV: ${user.employeeId}`
                                  : `Mã NV: ${user.employeeId}`}
                            </div>
                            {user.role === 'student' && (
                              <div className="text-xs text-gray-400">
                                Lớp: {user.class}
                              </div>
                            )}
                            {user.role === 'teacher' &&
                              user.classesAssigned && (
                                <div className="text-xs text-gray-400">
                                  {user.classesAssigned.length} lớp phụ trách
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleText(user.role)}
                        </Badge>
                        {user.department && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.department}
                          </div>
                        )}
                        {user.major && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.major}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={getStatusColor(user.status)}
                        >
                          {getStatusText(user.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">
                          {user.lastLogin}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tạo: {user.createdAt}
                        </div>
                      </td>
                      <td className="p-4">
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
                            {user.status === 'active' ? (
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Hiển thị {filteredUsers.length} trong tổng số {users.length} người
            dùng
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-orange-500 text-white"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
