import { useState } from 'react'
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  Star,
  Trash2,
  Save,
  X,
  Edit,
  Eye,
  Users,
  Code,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation } from '@/hooks'
import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeacherAssignment } from '@/api/actions/teacher-assignment/teacher-assignment.type'
import { useParams } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getStatusText } from '@/utils/helpers/getStatusData'
import { StatusIcon } from '@/components/common/status-icon'
import { getAssignmentStatus } from '@/utils/helpers/teacher-assignment-helper'
import {
  TeacherAssignmentFormValues,
  teacherAssignmentSchema,
} from '@/schema/teacherAssignment'
import { TeacherAssignmentDetail } from '@/components/features/teacher-assignment/teacher-assignment-detail'

export const TeacherAssignmentPage = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] =
    useState<TeacherAssignment | null>(null)
  const { classId } = useParams({ from: '/_auth/teacher-assignment/$classId/' })

  const { data: assignmentsData, isLoading } = useQuery({
    ...teacherAssignmentQueries.getAll(classId),
  })

  // Create form
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<TeacherAssignmentFormValues>({
    resolver: zodResolver(teacherAssignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      locTarget: 0,
      dueDate: '',
    },
  })

  // Edit form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<TeacherAssignmentFormValues>({
    resolver: zodResolver(teacherAssignmentSchema),
  })

  const {
    mutateAsync: createAssignmentMutation,
    isPending: isCreateAssignmentPending,
  } = useMutation('createTeacherAssignment', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentQueries.getAll(classId).queryKey,
      })
      toast.success('Create assignment successfully')
      setIsCreateModalOpen(false)
      resetCreate()
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const {
    mutateAsync: updateAssignmentMutation,
    isPending: isUpdateAssignmentPending,
  } = useMutation('updateTeacherAssignment', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentQueries.getAll(classId).queryKey,
      })
      toast.success('Update assignment successfully')
      setIsCreateModalOpen(false)
      resetCreate()
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const deleteAssignmentMutation = () => {
    toast.error('Chức năng đang phát triển')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600'
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'draft':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'archived':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const handleCreateAssignment = async (data: TeacherAssignmentFormValues) => {
    await createAssignmentMutation({ params: classId, body: data })
  }

  const handleEditAssignment = (data: TeacherAssignmentFormValues) => {
    console.log('Edit data:', data)
    updateAssignmentMutation({
      assignmentId: selectedAssignment?.id,
      ...data,
    })
  }

  const handleDeleteAssignment = (assignment: TeacherAssignment) => {
    if (
      confirm(`Bạn có chắc chắn muốn xóa assignment "${assignment.title}"?`)
    ) {
      deleteAssignmentMutation()
    }
  }

  const openEditModal = (assignment: TeacherAssignment) => {
    setSelectedAssignment(assignment)
    resetEdit({
      title: assignment.title,
      description: assignment.description,
      locTarget: assignment.locTarget,
      dueDate: assignment.dueDate,
    })
    setIsEditModalOpen(true)
  }

  const openDetailModal = (assignment: TeacherAssignment) => {
    setSelectedAssignment(assignment)
    setIsDetailModalOpen(true)
  }

  const calculatePassRate = (assignment: TeacherAssignment) => {
    if (!assignment.totalSubmissions || assignment.totalSubmissions === 0)
      return 0
    return Math.round(
      (assignment.passedCount / assignment.totalSubmissions) * 100
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Assignment Management
          </h1>
          <p className="text-gray-600">Quản lý assignments cho lớp {classId}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng Assignments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assignmentsData?.length || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang hoạt động
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      assignmentsData?.filter(
                        a => getAssignmentStatus(a) === 'active'
                      ).length
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      assignmentsData?.filter(
                        a => getAssignmentStatus(a) === 'draft'
                      ).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng LOC</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {assignmentsData?.reduce((sum, a) => sum + a.locTarget, 0)}
                  </p>
                </div>
                <Code className="h-8 w-8 text-blue-500" />
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
                placeholder="Tìm kiếm assignments..."
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
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
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
                Tạo Assignment mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Tạo Assignment mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo assignment mới cho lớp {classId}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitCreate(handleCreateAssignment)}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      placeholder="VD: Lab 1: Basic OOP Concepts"
                      {...registerCreate('title')}
                      className={errorsCreate.title ? 'border-red-500' : ''}
                    />
                    {errorsCreate.title && (
                      <p className="text-sm text-red-600">
                        {errorsCreate.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về assignment..."
                      rows={4}
                      {...registerCreate('description')}
                      className={
                        errorsCreate.description ? 'border-red-500' : ''
                      }
                    />
                    {errorsCreate.description && (
                      <p className="text-sm text-red-600">
                        {errorsCreate.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locTarget">LOC yêu cầu *</Label>
                      <Input
                        id="locTarget"
                        type="number"
                        min="1"
                        placeholder="VD: 500"
                        {...registerCreate('locTarget', {
                          valueAsNumber: true,
                        })}
                        className={
                          errorsCreate.locTarget ? 'border-red-500' : ''
                        }
                      />
                      {errorsCreate.locTarget && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.locTarget.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Ngày hạn nộp *</Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        {...registerCreate('dueDate')}
                        className={errorsCreate.dueDate ? 'border-red-500' : ''}
                      />
                      {errorsCreate.dueDate && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      resetCreate()
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={
                      isCreateAssignmentPending || isUpdateAssignmentPending
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isCreateAssignmentPending || isUpdateAssignmentPending
                      ? 'Đang tạo...'
                      : 'Tạo Assignment'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assignments Grid */}
        <div className="grid gap-6">
          {assignmentsData?.map((assignment: TeacherAssignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge
                          className={getStatusColor(
                            getAssignmentStatus(assignment)
                          )}
                        >
                          <StatusIcon
                            status={getAssignmentStatus(assignment)}
                          />
                          <span className="ml-1">
                            {getStatusText(getAssignmentStatus(assignment))}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {assignment.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">LOC yêu cầu:</span>
                          <div className="text-blue-600 font-semibold">
                            {assignment.locTarget}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Submissions:</span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {assignment.totalSubmissions}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Đã pass:</span>
                          <div className="text-green-600 font-semibold">
                            {assignment.passedCount}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Tỷ lệ pass:</span>
                          <div className="text-green-600 font-semibold">
                            {calculatePassRate(assignment)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Hạn nộp:{' '}
                        {new Date(assignment.dueDate).toLocaleDateString(
                          'vi-VN'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditModal(assignment)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDetailModal(assignment)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Xem submissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteAssignment(assignment)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa assignment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        <TeacherAssignmentDetail
          isDetailModalOpen={isDetailModalOpen}
          setIsDetailModalOpen={setIsDetailModalOpen}
          assignmentId={selectedAssignment?.id}
          openEditModal={openEditModal}
        />

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Assignment</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin assignment "{selectedAssignment?.title}"
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit(handleEditAssignment)}>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Tiêu đề *</Label>
                  <Input
                    id="editTitle"
                    placeholder="VD: Lab 1: Basic OOP Concepts"
                    {...registerEdit('title')}
                    className={errorsEdit.title ? 'border-red-500' : ''}
                  />
                  {errorsEdit.title && (
                    <p className="text-sm text-red-600">
                      {errorsEdit.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editDescription">Mô tả *</Label>
                  <Textarea
                    id="editDescription"
                    placeholder="Mô tả chi tiết về assignment..."
                    rows={4}
                    {...registerEdit('description')}
                    className={errorsEdit.description ? 'border-red-500' : ''}
                  />
                  {errorsEdit.description && (
                    <p className="text-sm text-red-600">
                      {errorsEdit.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLocTarget">LOC yêu cầu *</Label>
                    <Input
                      id="editLocTarget"
                      type="number"
                      min="1"
                      placeholder="VD: 500"
                      {...registerEdit('locTarget', { valueAsNumber: true })}
                      className={errorsEdit.locTarget ? 'border-red-500' : ''}
                    />
                    {errorsEdit.locTarget && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.locTarget.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDueDate">Ngày hạn nộp *</Label>
                    <Input
                      id="editDueDate"
                      type="datetime-local"
                      {...registerEdit('dueDate')}
                      className={errorsEdit.dueDate ? 'border-red-500' : ''}
                    />
                    {errorsEdit.dueDate && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.dueDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    resetEdit()
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isCreateAssignmentPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateAssignmentPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {assignmentsData?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy assignment nào
              </h3>
              <p className="text-gray-600 mb-4">
                Không có assignment nào phù hợp với tiêu chí tìm kiếm.
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
