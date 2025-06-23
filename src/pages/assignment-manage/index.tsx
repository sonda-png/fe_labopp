'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Code,
  User,
} from 'lucide-react'
import { useQuery, useMutation } from '@/hooks'
import { getAssignmentList } from '@/api/actions/assignment-manage/assignment.query'
import { assignmentMutations } from '@/api/actions/assignment-manage/assignment.mutation'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

interface Lab {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: string
}

export default function AssignmentManagement() {
  const {
    data: assignmentsData,
    isLoading,
    refetch,
  } = useQuery({
    ...getAssignmentList.get(),
  })

  const { mutateAsync: addAssignmentMutation } = useMutation(
    'addAssignmentMutation',
    {
      onSuccess: () => {
        console.log('onSuccess addAssignmentMutation')
        setIsAddDialogOpen(false)
        resetForm()

        refetch()
      },
      onError: (error: StandardizedApiError) => {
        console.log('onError addAssignmentMutation', error)
        toast.error(error.message || 'Có lỗi xảy ra khi thêm đề bài', {
          toastId: 'add-error',
        })
      },
    }
  )

  const { mutateAsync: updateAssignmentMutation } = useMutation(
    'updateAssignmentMutation',
    {
      onSuccess: () => {
        handleEditDialogChange(false)

        refetch()
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'Có lỗi xảy ra khi cập nhật đề bài', {
          toastId: 'update-error',
        })
      },
    }
  )

  const { mutateAsync: deleteAssignmentMutation } = useMutation(
    'deleteAssignmentMutation',
    {
      onSuccess: () => {
        refetch()
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'Có lỗi xảy ra khi xóa đề bài', {
          toastId: 'delete-error',
        })
      },
    }
  )

  const [labs, setLabs] = useState<Lab[]>([])

  useEffect(() => {
    if (assignmentsData?.data) {
      setLabs(Array.isArray(assignmentsData.data) ? assignmentsData.data : [])
    }
  }, [assignmentsData])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLab, setEditingLab] = useState<Lab | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locTotal: 0,
    teacherId: '',
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      locTotal: 0,
      teacherId: '',
    })
  }

  const handleEditDialogChange = (isOpen: boolean) => {
    setIsEditDialogOpen(isOpen)
    if (!isOpen) {
      setEditingLab(null)
      resetForm()
    }
  }

  const handleAdd = async () => {
    console.log('handleAdd called')
    await addAssignmentMutation({
      ...formData,
      id: `lab${labs.length + 1}`,
    })
  }

  const handleEdit = (lab: Lab) => {
    console.log('handleEdit called', lab)
    setEditingLab(lab)
    setFormData({
      title: lab.title,
      description: lab.description,
      locTotal: lab.locTotal,
      teacherId: lab.teacherId,
    })
    setTimeout(() => {
      setIsEditDialogOpen(true)
      console.log('setIsEditDialogOpen(true) called')
    }, 10)
  }

  const handleUpdate = async () => {
    if (editingLab) {
      try {
        await updateAssignmentMutation({
          ...formData,
          id: editingLab.id,
        })
      } catch (error) {
        console.error('Error updating assignment:', error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignmentMutation(id)
    } catch (error) {
      console.error('Error deleting assignment:', error)
    }
  }

  const stats = [
    {
      title: 'Tổng đề bài',
      value: labs.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Tổng LOC',
      value: labs.reduce((sum, lab) => sum + lab.locTotal, 0).toString(),
      icon: Code,
      color: 'text-green-600',
    },
    {
      title: 'Giảng viên',
      value: new Set(labs.map(lab => lab.teacherId)).size.toString(),
      icon: User,
      color: 'text-orange-600',
    },
  ]

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        openButtonRef.current?.focus()
      }, 0)
    }
  }

  // Log dialog open state for debugging
  if (isEditDialogOpen) {
    console.log('DialogContent rendered, isEditDialogOpen:', isEditDialogOpen)
  }

  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý đề bài
            </h1>
            <p className="text-gray-600">Danh sách các đề bài lab</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, mô tả..."
                className="pl-10 w-80"
              />
            </div>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tất cả giảng viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giảng viên</SelectItem>
                <SelectItem value="HE183210">HE183210</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc nâng cao
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="gap-2 bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Thêm đề bài
            </Button>
          </div>
        </div>

        {/* Labs Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead>Thông tin đề bài</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>LOC</TableHead>
                  <TableHead>Giảng viên</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-4" colSpan={5}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : labs.map(lab => (
                      <TableRow
                        key={lab.id}
                        className="border-b border-gray-100"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-medium text-sm">
                                {lab.id.substring(0, 6).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {lab.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {lab.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {lab.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {lab.locTotal} LOC
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-900">
                              {lab.teacherId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={e => {
                                  e.preventDefault()
                                  handleEdit(lab)
                                }}
                                onSelect={e => e.preventDefault()}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                              <DropdownMenuItem>Sao chép</DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={e => e.preventDefault()}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Xác nhận xóa
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn xóa đề bài "
                                      {lab.title}"? Hành động này không thể hoàn
                                      tác.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(lab.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm đề bài mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin cho đề bài mới
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề đề bài"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả đề bài"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="locTotal">Tổng số dòng code</Label>
                <Input
                  id="locTotal"
                  type="number"
                  value={formData.locTotal}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      locTotal: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Nhập tổng số dòng code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Mã giáo viên</Label>
                <Input
                  id="teacherId"
                  value={formData.teacherId}
                  onChange={e =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  placeholder="Nhập mã giáo viên"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  resetForm()
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa đề bài</DialogTitle>
              <DialogDescription>Cập nhật thông tin đề bài</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề đề bài"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả đề bài"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-locTotal">Tổng số dòng code</Label>
                <Input
                  id="edit-locTotal"
                  type="number"
                  value={formData.locTotal}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      locTotal: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Nhập tổng số dòng code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-teacherId">Mã giáo viên</Label>
                <Input
                  id="edit-teacherId"
                  value={formData.teacherId}
                  onChange={e =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  placeholder="Nhập mã giáo viên"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleEditDialogChange(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
