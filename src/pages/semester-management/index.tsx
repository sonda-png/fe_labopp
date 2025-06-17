import { useState } from 'react'
import {
  Calendar,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Eye,
  Edit,
  Plus,
  Filter,
  MoreHorizontal,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Trash2,
  Save,
  X,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// Mock data for semesters
const semesters = [
  {
    id: 1,
    name: 'HK1 2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-01-15',
    status: 'current',
    isActive: true,
    createdAt: '2024-08-15',
    createdBy: 'Trưởng bộ môn CNTT',
    totalClasses: 45,
    totalStudents: 1250,
  },
  {
    id: 2,
    name: 'HK2 2023-2024',
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    status: 'completed',
    isActive: true,
    createdAt: '2024-01-15',
    createdBy: 'Trưởng bộ môn CNTT',
    totalClasses: 42,
    totalStudents: 1180,
  },
  {
    id: 3,
    name: 'HK1 2023-2024',
    startDate: '2023-09-01',
    endDate: '2024-01-15',
    status: 'completed',
    isActive: true,
    createdAt: '2023-08-15',
    createdBy: 'Trưởng bộ môn CNTT',
    totalClasses: 38,
    totalStudents: 1100,
  },
  {
    id: 4,
    name: 'HK2 2022-2023',
    startDate: '2023-02-01',
    endDate: '2023-06-30',
    status: 'archived',
    isActive: false,
    createdAt: '2023-01-15',
    createdBy: 'Trưởng bộ môn CNTT',
    totalClasses: 35,
    totalStudents: 980,
  },
]

export default function SemesterManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  })
  const [errors, setErrors] = useState({})

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-500 hover:bg-green-600'
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'archived':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current':
        return 'Học kỳ hiện tại'
      case 'completed':
        return 'Đã hoàn thành'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return 'Không xác định'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <Star className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'archived':
        return <Clock className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const filteredSemesters = semesters.filter(semester => {
    const matchesSearch = semester.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || semester.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateSemester = () => {
    setErrors({})

    // Validation
    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: 'Vui lòng nhập tên học kỳ' }))
      return
    }
    if (!formData.startDate) {
      setErrors(prev => ({ ...prev, startDate: 'Vui lòng chọn ngày bắt đầu' }))
      return
    }
    if (!formData.endDate) {
      setErrors(prev => ({ ...prev, endDate: 'Vui lòng chọn ngày kết thúc' }))
      return
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setErrors(prev => ({
        ...prev,
        endDate: 'Ngày kết thúc phải sau ngày bắt đầu',
      }))
      return
    }

    // Simulate API call
    console.log('Creating semester:', formData)
    setIsCreateModalOpen(false)
    setFormData({ name: '', startDate: '', endDate: '', isCurrent: false })
  }

  const handleEditSemester = () => {
    setErrors({})

    // Validation similar to create
    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: 'Vui lòng nhập tên học kỳ' }))
      return
    }

    // Simulate API call
    console.log('Updating semester:', formData)
    setIsEditModalOpen(false)
    setSelectedSemester(null)
    setFormData({ name: '', startDate: '', endDate: '', isCurrent: false })
  }

  const handleSetCurrent = (semesterId: number) => {
    // Simulate API call to set current semester
    console.log('Setting current semester:', semesterId)
  }

  const handleToggleActive = (semesterId: number) => {
    // Simulate API call to toggle active status
    console.log('Toggling active status for semester:', semesterId)
  }

  const openEditModal = (semester: any) => {
    setSelectedSemester(semester)
    setFormData({
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate,
      isCurrent: semester.status === 'current',
    })
    setIsEditModalOpen(true)
  }

  const stats = {
    total: semesters.length,
    current: semesters.filter(s => s.status === 'current').length,
    completed: semesters.filter(s => s.status === 'completed').length,
    archived: semesters.filter(s => s.status === 'archived').length,
    active: semesters.filter(s => s.isActive).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-orange-500" />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý học kỳ</h1>
          <p className="text-gray-600">Quản lý học kỳ và lớp học</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng học kỳ
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hiện tại</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.current}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Hoàn thành
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lưu trữ</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.archived}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang hoạt động
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
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
                placeholder="Tìm kiếm học kỳ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="current">Học kỳ hiện tại</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="archived">Đã lưu trữ</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc nâng cao
            </Button>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Thêm học kỳ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo học kỳ mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo học kỳ mới cho hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên học kỳ *</Label>
                  <Input
                    id="name"
                    placeholder="VD: HK1 2024-2025"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={e =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={e =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className={errors.endDate ? 'border-red-500' : ''}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                  <Switch
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onCheckedChange={checked =>
                      setFormData({ ...formData, isCurrent: checked })
                    }
                  />
                  <Label htmlFor="isCurrent" className="text-sm font-medium">
                    Đặt làm học kỳ hiện tại
                  </Label>
                </div>

                {formData.isCurrent && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Chỉ được phép có 1 học kỳ hiện tại
                      tại một thời điểm. Học kỳ hiện tại trước đó sẽ được chuyển
                      sang trạng thái "Đã hoàn thành".
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleCreateSemester}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Tạo học kỳ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Semesters Grid */}
        <div className="grid gap-6">
          {filteredSemesters.map(semester => (
            <Card
              key={semester.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {semester.name}
                        </h3>
                        <Badge className={getStatusColor(semester.status)}>
                          {getStatusIcon(semester.status)}
                          <span className="ml-1">
                            {getStatusText(semester.status)}
                          </span>
                        </Badge>
                        {!semester.isActive && (
                          <Badge
                            variant="outline"
                            className="border-red-200 text-red-700"
                          >
                            Đã vô hiệu hóa
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Bắt đầu:</span>
                          <div>
                            {new Date(semester.startDate).toLocaleDateString(
                              'vi-VN'
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Kết thúc:</span>
                          <div>
                            {new Date(semester.endDate).toLocaleDateString(
                              'vi-VN'
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Số lớp:</span>
                          <div>{semester.totalClasses} lớp</div>
                        </div>
                        <div>
                          <span className="font-medium">Sinh viên:</span>
                          <div>{semester.totalStudents} người</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Tạo bởi {semester.createdBy} •{' '}
                        {new Date(semester.createdAt).toLocaleDateString(
                          'vi-VN'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {semester.status !== 'current' && semester.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetCurrent(semester.id)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Đặt hiện tại
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditModal(semester)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(semester.id)}
                        >
                          {semester.isActive ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Vô hiệu hóa
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        {semester.status !== 'current' && (
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa học kỳ
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa học kỳ</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin học kỳ {selectedSemester?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Tên học kỳ *</Label>
                <Input
                  id="editName"
                  placeholder="VD: HK1 2024-2025"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartDate">Ngày bắt đầu *</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={formData.startDate}
                    onChange={e =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndDate">Ngày kết thúc *</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                <Switch
                  id="editIsCurrent"
                  checked={formData.isCurrent}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, isCurrent: checked })
                  }
                />
                <Label htmlFor="editIsCurrent" className="text-sm font-medium">
                  Đặt làm học kỳ hiện tại
                </Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleEditSemester}
              >
                <Save className="mr-2 h-4 w-4" />
                Cập nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredSemesters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy học kỳ
              </h3>
              <p className="text-gray-600 mb-4">
                Không có học kỳ nào phù hợp với tiêu chí tìm kiếm.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
