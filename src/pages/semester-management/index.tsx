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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
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
    control: controlEdit,
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
  })

  const {
    mutateAsync: createSemesterClassMutation,
    isPending: isCreateSemesterClassPending,
  } = useMutation('createSemesterClass', {
    onSuccess: () => {
      toast.success('Create semester successfully')
      setIsCreateModalOpen(false)
      resetCreate()
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const updateSemesterMutation = () => {
    toast.error('Function is under development')
  }

  const deactivateSemesterMutation = () => {
    toast.error('Function is under development')
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
        return 'Current semester'
      case 'completed':
        return 'Completed'
      case 'upcoming':
        return 'Upcoming'
      case 'inactive':
        return 'Inactive'
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

  const openDetailModal = (semester: Semester) => {
    setSelectedSemester(semester)
    setIsDetailModalOpen(true)
  }

  const openEditModal = (semester: Semester) => {
    setSelectedSemester(semester)
    resetEdit({
      name: semester.name,
      subject: '', // Subject info not available, user needs to fill
      semester: semester.semester,
      academicYear: semester.academicYear,
      locToPass: 1000, // Default value, user should update
      teacherId: '', // User needs to select teacher
      isActive: semester.isActive,
    })
    setIsEditModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Semester Management
          </h1>
          <p className="text-gray-600">Manage semesters and classes</p>
        </div>
      </div>

      <div className="">
        <OverviewSemesterClass />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search semester..."
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
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="current">Current semester</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced filter
            </Button>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add new semester
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add new semester</DialogTitle>
                <DialogDescription>
                  Enter information to add a new semester to the system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitCreate(handleCreateSemester)}>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Semester name *</Label>
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
                      <Label htmlFor="subject">Subject *</Label>
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
                      <Label htmlFor="semester">Semester *</Label>
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
                      <Label htmlFor="academicYear">Academic year *</Label>
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
                      <Label htmlFor="locToPass">LOC to pass *</Label>
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
                      <Label htmlFor="teacherId">Teacher *</Label>
                      <Controller
                        name="teacherId"
                        control={controlCreate}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={
                                errorsCreate.teacherId ? 'border-red-500' : ''
                              }
                            >
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachersData?.map(teacher => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.fullName} ({teacher.email})
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
                      Activate semester
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isCreateSemesterClassPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isCreateSemesterClassPending
                      ? 'Creating...'
                      : 'Add semester'}
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
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Semester code:</span>
                          <div>{semester.academicYear}</div>
                        </div>
                        <div>
                          <span className="font-medium">Semester:</span>
                          <div>Semester {semester.semester}</div>
                        </div>
                        <div>
                          <span className="font-medium">Academic year:</span>
                          <div>{semester.academicYear}</div>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <div>{semester.isActive ? 'Active' : 'Inactive'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created on{' '}
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
                        <DropdownMenuItem
                          onClick={() => openDetailModal(semester)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(semester)}
                        >
                          {semester.isActive ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Inactive
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete semester
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
              <DialogTitle>Edit semester</DialogTitle>
              <DialogDescription>
                Update information for semester {selectedSemester?.name}
              </DialogDescription>
            </DialogHeader>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    Note when editing semester
                  </p>
                  <p className="text-sm text-amber-700">
                    Some information such as subject, LOC to pass and teacher
                    need to be filled again as they are not available in the
                    current data.
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmitEdit(handleEditSemester)}>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Semester name *</Label>
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
                    <Label htmlFor="editSubject">Subject *</Label>
                    <Input
                      id="editSubject"
                      placeholder="Please enter subject name (VD: Object-Oriented Programming)"
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
                    <Label htmlFor="editSemester">Semester *</Label>
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
                    <Label htmlFor="editAcademicYear">Academic year *</Label>
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
                    <Label htmlFor="editLocToPass">LOC to pass *</Label>
                    <Input
                      id="editLocToPass"
                      type="number"
                      min="0"
                      placeholder="Enter LOC to pass (VD: 1000)"
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
                    <Label htmlFor="editTeacherId">Teacher *</Label>
                    <Controller
                      name="teacherId"
                      control={controlEdit}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={
                              errorsEdit.teacherId ? 'border-red-500' : ''
                            }
                          >
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachersData?.map(teacher => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.fullName} ({teacher.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
                    Activate semester
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isCreateSemesterClassPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateSemesterClassPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Semester details</DialogTitle>
              <DialogDescription>
                Detailed information about semester {selectedSemester?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedSemester && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedSemester.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className={getStatusColor(
                          getSemesterStatus(selectedSemester)
                        )}
                      >
                        {getStatusIcon(getSemesterStatus(selectedSemester))}
                        <span className="ml-1">
                          {getStatusText(getSemesterStatus(selectedSemester))}
                        </span>
                      </Badge>
                      {!selectedSemester.isActive && (
                        <Badge
                          variant="outline"
                          className="border-red-200 text-red-700"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Basic information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester code:</span>
                          <span className="font-medium">
                            {selectedSemester.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester name:</span>
                          <span className="font-medium">
                            {selectedSemester.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester:</span>
                          <span className="font-medium">
                            Semester {selectedSemester.semester}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Academic year:</span>
                          <span className="font-medium">
                            {selectedSemester.academicYear}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${selectedSemester.isActive ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {selectedSemester.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Time information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created on:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedSemester.createdAt
                            ).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Semester status:
                          </span>
                          <span className="font-medium">
                            {getStatusText(getSemesterStatus(selectedSemester))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      setIsDetailModalOpen(false)
                      openEditModal(selectedSemester)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredSemesters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No semester found
              </h3>
              <p className="text-gray-600 mb-4">
                No semester found matching the search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Clear filter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
