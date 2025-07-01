import { useState } from 'react'
import {
  Calendar,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Trash2,
  Save,
  X,
  Edit,
  Eye,
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
import { Switch } from '@/components/ui/switch'
import { useQuery, useMutation } from '@/hooks'
import { semestersQueries } from '@/api/actions/semesters/semesters.queries'
import { Semester } from '@/api/actions/semesters/semesters.types'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SemesterFormData, semesterSchema } from '@/schema/semesterSchema'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { OverviewSemesterClass } from '@/components/features/semester-class/overview-semester-class'

export const SemesterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  )

  const { data: semestersData, isLoading } = useQuery({
    ...semestersQueries.getAll(),
  })

  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })

  const { data: teachersData } = useQuery({
    ...adminAccountQueries.getAll({
      roleId: rolesData?.find(role => role.name === 'Teacher')?.id,
      isActive: 'true',
    }),
  })

  // Create form
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
    control: controlCreate,
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: '',
      subject: '',
      semester: 1,
      academicYear: '',
      locToPass: 0,
      teacherId: '',
      isActive: true,
    },
  })

  // Edit form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
  })

  const {
    mutateAsync: createSemesterClassMutation,
    isPending: isCreateSemesterClassPending,
  } = useMutation('createSemesterClass', {
    onSuccess: (res: Semester) => {
      console.log(res)
      toast.success('Tạo học kỳ thành công')
      setIsCreateModalOpen(false)
      resetCreate()
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const updateSemesterMutation = () => {
    toast.error('Chức năng đang phát triển')
  }

  const deactivateSemesterMutation = () => {
    toast.error('Chức năng đang phát triển')
  }

  const semesters: Semester[] = semestersData || []

  const getSemesterStatus = (semester: Semester) => {
    if (!semester.isActive) return 'inactive'
    const year = parseInt(semester.academicYear.split('-')[0])
    const currentYear = new Date().getFullYear()
    if (year === currentYear) return 'current'
    if (year < currentYear) return 'completed'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-500 hover:bg-green-600'
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'upcoming':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'inactive':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current':
        return 'Current Semester'
      case 'completed':
        return 'Đã hoàn thành'
      case 'upcoming':
        return 'Sắp diễn ra'
      case 'inactive':
        return 'Không hoạt động'
      default:
        return 'Unknown'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <Star className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'upcoming':
        return <Clock className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const filteredSemesters = semesters.filter(semester => {
    const matchesSearch =
      semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.academicYear.toLowerCase().includes(searchTerm.toLowerCase())

    const status = getSemesterStatus(semester)
    const matchesStatus = statusFilter === 'all' || status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateSemester = async (data: SemesterFormData) => {
    console.log(data)
    await createSemesterClassMutation(data)
  }

  const handleEditSemester = (data: SemesterFormData) => {
    console.log('Edit data:', data)
    updateSemesterMutation()
  }

  const handleToggleActive = (semester: Semester) => {
    if (semester.isActive) {
      deactivateSemesterMutation()
    } else {
      // Activate functionality
    }
  }

  const openEditModal = (semester: Semester) => {
    setSelectedSemester(semester)
    resetEdit({
      name: semester.name,
      subject: '', // Will need to get from API
      semester: semester.semester,
      academicYear: semester.academicYear,
      locToPass: 0, // Will need to get from API
      teacherId: '', // Will need to get from API
      isActive: semester.isActive,
    })
    setIsEditModalOpen(true)
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
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semester Management</h1>
          <p className="text-gray-600">Manage semesters and classes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <OverviewSemesterClass />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search semesters..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="current">Học kỳ hiện tại</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add New Semester
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Semester</DialogTitle>
                <DialogDescription>
                  Enter information to create a new semester for the system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitCreate(handleCreateSemester)}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên học kỳ *</Label>
                      <Input
                        id="name"
                        placeholder="VD: OOP K19"
                        {...registerCreate('name')}
                        className={errorsCreate.name ? 'border-red-500' : ''}
                      />
                      {errorsCreate.name && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Môn học *</Label>
                      <Input
                        id="subject"
                        placeholder="VD: Object-Oriented Programming"
                        {...registerCreate('subject')}
                        className={errorsCreate.subject ? 'border-red-500' : ''}
                      />
                      {errorsCreate.subject && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Học kỳ *</Label>
                      <Input
                        id="semester"
                        type="number"
                        min="1"
                        max="8"
                        placeholder="VD: 1, 2, 3"
                        {...registerCreate('semester', { valueAsNumber: true })}
                        className={
                          errorsCreate.semester ? 'border-red-500' : ''
                        }
                      />
                      {errorsCreate.semester && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.semester.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Năm học *</Label>
                      <Input
                        id="academicYear"
                        placeholder="VD: 2023-2024"
                        {...registerCreate('academicYear')}
                        className={
                          errorsCreate.academicYear ? 'border-red-500' : ''
                        }
                      />
                      {errorsCreate.academicYear && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.academicYear.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locToPass">LOC để pass *</Label>
                      <Input
                        id="locToPass"
                        type="number"
                        min="0"
                        placeholder="VD: 1000"
                        {...registerCreate('locToPass', {
                          valueAsNumber: true,
                        })}
                        className={
                          errorsCreate.locToPass ? 'border-red-500' : ''
                        }
                      />
                      {errorsCreate.locToPass && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.locToPass.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherId">ID Giảng viên *</Label>
                      <Controller
                        name="teacherId"
                        control={controlCreate}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giảng viên" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachersData?.map(teacher => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsCreate.teacherId && (
                        <p className="text-sm text-red-600">
                          {errorsCreate.teacherId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                    <Switch id="isActive" {...registerCreate('isActive')} />
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Kích hoạt học kỳ
                    </Label>
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
                    disabled={isCreateSemesterClassPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isCreateSemesterClassPending
                      ? 'Đang tạo...'
                      : 'Tạo học kỳ'}
                  </Button>
                </div>
              </form>
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
                        <Badge
                          className={getStatusColor(
                            getSemesterStatus(semester)
                          )}
                        >
                          {getStatusIcon(getSemesterStatus(semester))}
                          <span className="ml-1">
                            {getStatusText(getSemesterStatus(semester))}
                          </span>
                        </Badge>
                        {!semester.isActive && (
                          <Badge
                            variant="outline"
                            className="border-red-200 text-red-700"
                          >
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Mã học kỳ:</span>
                          <div>{semester.academicYear}</div>
                        </div>
                        <div>
                          <span className="font-medium">Học kỳ:</span>
                          <div>Học kỳ {semester.semester}</div>
                        </div>
                        <div>
                          <span className="font-medium">Năm học:</span>
                          <div>{semester.academicYear}</div>
                        </div>
                        <div>
                          <span className="font-medium">Trạng thái:</span>
                          <div>
                            {semester.isActive
                              ? 'Hoạt động'
                              : 'Không hoạt động'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Tạo ngày{' '}
                        {new Date(semester.createdAt).toLocaleDateString(
                          'en-US'
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
                          onClick={() => openEditModal(semester)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(semester)}
                        >
                          {semester.isActive ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa học kỳ
                        </DropdownMenuItem>
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Semester</DialogTitle>
              <DialogDescription>
                Update information for semester {selectedSemester?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit(handleEditSemester)}>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Tên học kỳ *</Label>
                    <Input
                      id="editName"
                      placeholder="VD: OOP K19"
                      {...registerEdit('name')}
                      className={errorsEdit.name ? 'border-red-500' : ''}
                    />
                    {errorsEdit.name && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editSubject">Môn học *</Label>
                    <Input
                      id="editSubject"
                      placeholder="VD: Object-Oriented Programming"
                      {...registerEdit('subject')}
                      className={errorsEdit.subject ? 'border-red-500' : ''}
                    />
                    {errorsEdit.subject && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editSemester">Học kỳ *</Label>
                    <Input
                      id="editSemester"
                      type="number"
                      min="1"
                      max="8"
                      placeholder="VD: 1, 2, 3"
                      {...registerEdit('semester', { valueAsNumber: true })}
                      className={errorsEdit.semester ? 'border-red-500' : ''}
                    />
                    {errorsEdit.semester && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.semester.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editAcademicYear">Năm học *</Label>
                    <Input
                      id="editAcademicYear"
                      placeholder="VD: 2023-2024"
                      {...registerEdit('academicYear')}
                      className={
                        errorsEdit.academicYear ? 'border-red-500' : ''
                      }
                    />
                    {errorsEdit.academicYear && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.academicYear.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLocToPass">LOC để pass *</Label>
                    <Input
                      id="editLocToPass"
                      type="number"
                      min="0"
                      placeholder="VD: 1000"
                      {...registerEdit('locToPass', { valueAsNumber: true })}
                      className={errorsEdit.locToPass ? 'border-red-500' : ''}
                    />
                    {errorsEdit.locToPass && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.locToPass.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTeacherId">ID Giảng viên *</Label>
                    <Input
                      id="editTeacherId"
                      placeholder="VD: teacher123"
                      {...registerEdit('teacherId')}
                      className={errorsEdit.teacherId ? 'border-red-500' : ''}
                    />
                    {errorsEdit.teacherId && (
                      <p className="text-sm text-red-600">
                        {errorsEdit.teacherId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                  <Switch id="editIsActive" {...registerEdit('isActive')} />
                  <Label htmlFor="editIsActive" className="text-sm font-medium">
                    Kích hoạt học kỳ
                  </Label>
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
                  disabled={isCreateSemesterClassPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateSemesterClassPending
                    ? 'Đang cập nhật...'
                    : 'Cập nhật'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredSemesters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No semesters found
              </h3>
              <p className="text-gray-600 mb-4">
                No semesters match your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
