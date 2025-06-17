import { useState } from 'react'
import {
  FileText,
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
  Code,
  Trash2,
  Save,
  X,
  Copy,
  Download,
  Upload,
  BookOpen,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// Mock data for assignments
const assignments = [
  {
    id: 1,
    title: 'Selection Sort Algorithm',
    code: 'J1.S.P0002',
    description:
      'Design a program that allows users to input the number of array. Generate random integer in number range input. Display unsorted array and sorted array using selection sort.',
    topic: 'Java OOP manual grading',
    background:
      'Selection sort is one of the O(n²) sorting algorithms, which makes it quite inefficient for sorting large data volumes. Selection sort is notable for its programming simplicity and it can over perform other sorts in certain situations.',
    targetLOC: 50,
    difficulty: 3,
    estimatedTime: 120,
    status: 'active',
    isPublic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    createdBy: 'Trưởng bộ môn CNTT',
    usageCount: 15,
    passRate: 75,
    specifications: [
      'Display a screen to prompt users to input a positive decimal number.',
      'Users run the program, display a screen to ask users to enter a positive decimal number.',
      'Users input a positive decimal number. Then, perform Function 2.',
      'Display & sort array.',
    ],
    tags: ['sorting', 'algorithm', 'java', 'beginner'],
    category: 'Algorithm Implementation',
  },
  {
    id: 2,
    title: 'Binary Search Implementation',
    code: 'J1.S.P0003',
    description:
      'Implement binary search algorithm with recursive and iterative approaches',
    topic: 'Java Algorithm Implementation',
    background:
      'Binary search is a search algorithm that finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array.',
    targetLOC: 75,
    difficulty: 4,
    estimatedTime: 180,
    status: 'active',
    isPublic: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    createdBy: 'Trưởng bộ môn CNTT',
    usageCount: 12,
    passRate: 68,
    specifications: [
      'Implement recursive binary search',
      'Implement iterative binary search',
      'Compare performance between both approaches',
      'Handle edge cases properly',
    ],
    tags: ['search', 'algorithm', 'java', 'intermediate'],
    category: 'Algorithm Implementation',
  },
  {
    id: 3,
    title: 'Student Management System',
    code: 'J1.S.P0010',
    description:
      'Create a comprehensive student management system with CRUD operations',
    topic: 'Java OOP Application Development',
    background:
      'Object-oriented programming principles applied to real-world scenarios. This assignment focuses on encapsulation, inheritance, and polymorphism concepts.',
    targetLOC: 200,
    difficulty: 5,
    estimatedTime: 300,
    status: 'draft',
    isPublic: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    createdBy: 'Trưởng bộ môn CNTT',
    usageCount: 0,
    passRate: 0,
    specifications: [
      'Design Student class with appropriate attributes',
      'Implement CRUD operations for student records',
      'Create menu-driven interface',
      'Implement data validation and error handling',
      'Add search and filter functionality',
    ],
    tags: ['oop', 'crud', 'java', 'advanced', 'system'],
    category: 'Application Development',
  },
  {
    id: 4,
    title: 'Calculator Application',
    code: 'J1.S.P0001',
    description: 'Build a simple calculator with basic arithmetic operations',
    topic: 'Java Basic Programming',
    background:
      'Introduction to Java programming fundamentals including variables, operators, and control structures.',
    targetLOC: 30,
    difficulty: 2,
    estimatedTime: 90,
    status: 'archived',
    isPublic: true,
    createdAt: '2023-12-01',
    updatedAt: '2023-12-15',
    createdBy: 'Trưởng bộ môn CNTT',
    usageCount: 25,
    passRate: 85,
    specifications: [
      'Implement basic arithmetic operations (+, -, *, /)',
      'Handle division by zero',
      'Create user-friendly interface',
      'Add input validation',
    ],
    tags: ['basic', 'calculator', 'java', 'beginner'],
    category: 'Basic Programming',
  },
]

export default function AssignmentBank() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    topic: '',
    background: '',
    targetLOC: '',
    difficulty: '',
    estimatedTime: '',
    category: '',
    specifications: [''],
    tags: '',
    isPublic: true,
  })
  const [errors, setErrors] = useState({})

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600'
      case 'draft':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'archived':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang sử dụng'
      case 'draft':
        return 'Bản nháp'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return 'Không xác định'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'draft':
        return <Clock className="h-4 w-4" />
      case 'archived':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-700 border-green-200'
    if (difficulty <= 3)
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (difficulty <= 4)
      return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'Dễ'
    if (difficulty <= 3) return 'Trung bình'
    if (difficulty <= 4) return 'Khó'
    return 'Rất khó'
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus =
      statusFilter === 'all' || assignment.status === statusFilter
    const matchesCategory =
      categoryFilter === 'all' || assignment.category === categoryFilter
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      assignment.difficulty.toString() === difficultyFilter

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesDifficulty
    )
  })

  const resetForm = () => {
    setFormData({
      title: '',
      code: '',
      description: '',
      topic: '',
      background: '',
      targetLOC: '',
      difficulty: '',
      estimatedTime: '',
      category: '',
      specifications: [''],
      tags: '',
      isPublic: true,
    })
    setErrors({})
  }

  const handleCreateAssignment = () => {
    setErrors({})

    // Validation
    if (!formData.title) {
      setErrors(prev => ({ ...prev, title: 'Vui lòng nhập tiêu đề bài tập' }))
      return
    }
    if (!formData.code) {
      setErrors(prev => ({ ...prev, code: 'Vui lòng nhập mã bài tập' }))
      return
    }
    if (!formData.description) {
      setErrors(prev => ({
        ...prev,
        description: 'Vui lòng nhập mô tả bài tập',
      }))
      return
    }

    // Simulate API call
    console.log('Creating assignment:', formData)
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditAssignment = () => {
    setErrors({})

    // Validation similar to create
    if (!formData.title) {
      setErrors(prev => ({ ...prev, title: 'Vui lòng nhập tiêu đề bài tập' }))
      return
    }

    // Simulate API call
    console.log('Updating assignment:', formData)
    setIsEditModalOpen(false)
    setSelectedAssignment(null)
    resetForm()
  }

  const handleDeleteAssignment = (assignmentId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      console.log('Deleting assignment:', assignmentId)
    }
  }

  const handleDuplicateAssignment = (assignment: any) => {
    setFormData({
      title: `${assignment.title} (Copy)`,
      code: `${assignment.code}_COPY`,
      description: assignment.description,
      topic: assignment.topic,
      background: assignment.background,
      targetLOC: assignment.targetLOC.toString(),
      difficulty: assignment.difficulty.toString(),
      estimatedTime: assignment.estimatedTime.toString(),
      category: assignment.category,
      specifications: assignment.specifications,
      tags: assignment.tags.join(', '),
      isPublic: assignment.isPublic,
    })
    setIsCreateModalOpen(true)
  }

  const openEditModal = (assignment: any) => {
    setSelectedAssignment(assignment)
    setFormData({
      title: assignment.title,
      code: assignment.code,
      description: assignment.description,
      topic: assignment.topic,
      background: assignment.background,
      targetLOC: assignment.targetLOC.toString(),
      difficulty: assignment.difficulty.toString(),
      estimatedTime: assignment.estimatedTime.toString(),
      category: assignment.category,
      specifications: assignment.specifications,
      tags: assignment.tags.join(', '),
      isPublic: assignment.isPublic,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (assignment: any) => {
    setSelectedAssignment(assignment)
    setIsViewModalOpen(true)
  }

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, ''],
    })
  }

  const updateSpecification = (index: number, value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: newSpecs })
  }

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    draft: assignments.filter(a => a.status === 'draft').length,
    archived: assignments.filter(a => a.status === 'archived').length,
    avgUsage: Math.round(
      assignments.reduce((sum, a) => sum + a.usageCount, 0) / assignments.length
    ),
  }

  const categories = [...new Set(assignments.map(a => a.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-orange-500" />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý ngân hàng đề
          </h1>
          <p className="text-gray-600">Quản lý ngân hàng đề thi</p>
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
                    Tổng bài tập
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang sử dụng
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.draft}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
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
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sử dụng TB
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.avgUsage}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
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
                placeholder="Tìm kiếm bài tập, mã, tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang sử dụng</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="1">Dễ (1-2)</SelectItem>
                <SelectItem value="3">TB (3)</SelectItem>
                <SelectItem value="4">Khó (4)</SelectItem>
                <SelectItem value="5">Rất khó (5)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc nâng cao
            </Button>
          </div>

          <div className="flex items-center space-x-3">
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
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={resetForm}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm bài tập mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tạo bài tập mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin để tạo bài Lab Assignment mới
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề bài tập *</Label>
                      <Input
                        id="title"
                        placeholder="VD: Selection Sort Algorithm"
                        value={formData.title}
                        onChange={e =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Mã bài tập *</Label>
                      <Input
                        id="code"
                        placeholder="VD: J1.S.P0002"
                        value={formData.code}
                        onChange={e =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                        className={errors.code ? 'border-red-500' : ''}
                      />
                      {errors.code && (
                        <p className="text-sm text-red-600">{errors.code}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả bài tập *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về bài tập..."
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Chủ đề</Label>
                      <Input
                        id="topic"
                        placeholder="VD: Java OOP manual grading"
                        value={formData.topic}
                        onChange={e =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Select
                        value={formData.category}
                        onValueChange={value =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Algorithm Implementation">
                            Algorithm Implementation
                          </SelectItem>
                          <SelectItem value="Application Development">
                            Application Development
                          </SelectItem>
                          <SelectItem value="Basic Programming">
                            Basic Programming
                          </SelectItem>
                          <SelectItem value="Data Structure">
                            Data Structure
                          </SelectItem>
                          <SelectItem value="Database">Database</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">Background</Label>
                    <Textarea
                      id="background"
                      placeholder="Kiến thức nền tảng và bối cảnh của bài tập..."
                      value={formData.background}
                      onChange={e =>
                        setFormData({ ...formData, background: e.target.value })
                      }
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetLOC">Target LOC</Label>
                      <Input
                        id="targetLOC"
                        type="number"
                        placeholder="50"
                        value={formData.targetLOC}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            targetLOC: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Độ khó (1-5)</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={value =>
                          setFormData({ ...formData, difficulty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ khó" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Rất dễ</SelectItem>
                          <SelectItem value="2">2 - Dễ</SelectItem>
                          <SelectItem value="3">3 - Trung bình</SelectItem>
                          <SelectItem value="4">4 - Khó</SelectItem>
                          <SelectItem value="5">5 - Rất khó</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedTime">
                        Thời gian ước tính (phút)
                      </Label>
                      <Input
                        id="estimatedTime"
                        type="number"
                        placeholder="120"
                        value={formData.estimatedTime}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            estimatedTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Program Specifications</Label>
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Specification ${index + 1}`}
                          value={spec}
                          onChange={e =>
                            updateSpecification(index, e.target.value)
                          }
                        />
                        {formData.specifications.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSpecification(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSpecification}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm specification
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                    <Input
                      id="tags"
                      placeholder="VD: sorting, algorithm, java, beginner"
                      value={formData.tags}
                      onChange={e =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg">
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={checked =>
                        setFormData({ ...formData, isPublic: checked })
                      }
                    />
                    <Label htmlFor="isPublic" className="text-sm font-medium">
                      Công khai bài tập (cho phép giảng viên khác sử dụng)
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleCreateAssignment}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Tạo bài tập
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid gap-6">
          {filteredAssignments.map(assignment => (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Code className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          {assignment.code}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1">
                            {getStatusText(assignment.status)}
                          </span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(assignment.difficulty)}
                        >
                          {getDifficultyText(assignment.difficulty)} (
                          {assignment.difficulty}/5)
                        </Badge>
                        {!assignment.isPublic && (
                          <Badge
                            variant="outline"
                            className="border-gray-200 text-gray-700"
                          >
                            Riêng tư
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {assignment.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Chủ đề:</span>
                          <div className="text-gray-900">
                            {assignment.topic}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Target LOC:</span>
                          <div className="text-gray-900">
                            {assignment.targetLOC}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Thời gian:</span>
                          <div className="text-gray-900">
                            {assignment.estimatedTime} phút
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Sử dụng:</span>
                          <div className="text-gray-900">
                            {assignment.usageCount} lần
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Tỷ lệ pass:</span>
                          <div className="text-gray-900">
                            {assignment.passRate}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-600">Tags:</span>
                        {assignment.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500">
                        Tạo:{' '}
                        {new Date(assignment.createdAt).toLocaleDateString(
                          'vi-VN'
                        )}{' '}
                        • Cập nhật:{' '}
                        {new Date(assignment.updatedAt).toLocaleDateString(
                          'vi-VN'
                        )}{' '}
                        • Bởi: {assignment.createdBy}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openViewModal(assignment)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Xem
                    </Button>

                    <DropdownMenu>
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
                          onClick={() => handleDuplicateAssignment(assignment)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Nhân bản
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa bài tập
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài tập</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin bài tập {selectedAssignment?.title}
              </DialogDescription>
            </DialogHeader>
            {/* Form content similar to create modal */}
            <div className="grid grid-cols-1 gap-4 py-4">
              {/* Same form fields as create modal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Tiêu đề bài tập *</Label>
                  <Input
                    id="editTitle"
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCode">Mã bài tập *</Label>
                  <Input
                    id="editCode"
                    value={formData.code}
                    onChange={e =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className={errors.code ? 'border-red-500' : ''}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-600">{errors.code}</p>
                  )}
                </div>
              </div>
              {/* Add other form fields as needed */}
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
                onClick={handleEditAssignment}
              >
                <Save className="mr-2 h-4 w-4" />
                Cập nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <span>{selectedAssignment?.title}</span>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  {selectedAssignment?.code}
                </Badge>
              </DialogTitle>
              <DialogDescription>Chi tiết bài Lab Assignment</DialogDescription>
            </DialogHeader>
            {selectedAssignment && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Chủ đề:</span>{' '}
                        {selectedAssignment.topic}
                      </div>
                      <div>
                        <span className="font-medium">Danh mục:</span>{' '}
                        {selectedAssignment.category}
                      </div>
                      <div>
                        <span className="font-medium">Target LOC:</span>{' '}
                        {selectedAssignment.targetLOC}
                      </div>
                      <div>
                        <span className="font-medium">Độ khó:</span>{' '}
                        {selectedAssignment.difficulty}/5
                      </div>
                      <div>
                        <span className="font-medium">Thời gian ước tính:</span>{' '}
                        {selectedAssignment.estimatedTime} phút
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thống kê sử dụng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Số lần sử dụng:</span>{' '}
                        {selectedAssignment.usageCount}
                      </div>
                      <div>
                        <span className="font-medium">Tỷ lệ pass:</span>{' '}
                        {selectedAssignment.passRate}%
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái:</span>{' '}
                        {getStatusText(selectedAssignment.status)}
                      </div>
                      <div>
                        <span className="font-medium">Công khai:</span>{' '}
                        {selectedAssignment.isPublic ? 'Có' : 'Không'}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mô tả</h4>
                  <p className="text-gray-700 text-sm">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Background</h4>
                  <p className="text-gray-700 text-sm">
                    {selectedAssignment.background}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Program Specifications
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {selectedAssignment.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Đóng
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setIsViewModalOpen(false)
                  openEditModal(selectedAssignment)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy bài tập
              </h3>
              <p className="text-gray-600 mb-4">
                Không có bài tập nào phù hợp với tiêu chí tìm kiếm.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setCategoryFilter('all')
                  setDifficultyFilter('all')
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
