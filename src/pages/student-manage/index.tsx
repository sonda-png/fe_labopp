import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Eye,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowLeft,
  Filter,
  Download,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Dữ liệu cứng cho lớp học
const classInfo = {
  name: 'Summer2025 - LAB211 - SE1973',
  subject: 'LAB 02- Java OOP',
  status: 'Active',
  mentors: 'Nguyễn Thị Hải Nang - nangnth',
  totalStudents: 30,
  totalAssignments: 127,
}

// Dữ liệu cứng cho sinh viên
const studentsData = [
  {
    id: 1,
    studentCode: 'SE171234',
    fullName: 'Nguyễn Văn An',
    email: 'anNV@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 25,
    totalAssignments: 30,
    averageScore: 8.5,
    lastActivity: '2 giờ trước',
    status: 'Active',
    progress: 83,
  },
  {
    id: 2,
    studentCode: 'SE171235',
    fullName: 'Trần Thị Bình',
    email: 'binhTT@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 28,
    totalAssignments: 30,
    averageScore: 9.2,
    lastActivity: '1 ngày trước',
    status: 'Active',
    progress: 93,
  },
  {
    id: 3,
    studentCode: 'SE171236',
    fullName: 'Lê Minh Cường',
    email: 'cuongLM@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 20,
    totalAssignments: 30,
    averageScore: 7.8,
    lastActivity: '3 ngày trước',
    status: 'Warning',
    progress: 67,
  },
  {
    id: 4,
    studentCode: 'SE171237',
    fullName: 'Phạm Thu Dung',
    email: 'dungPT@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 30,
    totalAssignments: 30,
    averageScore: 9.8,
    lastActivity: '30 phút trước',
    status: 'Active',
    progress: 100,
  },
  {
    id: 5,
    studentCode: 'SE171238',
    fullName: 'Hoàng Văn Em',
    email: 'emHV@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 15,
    totalAssignments: 30,
    averageScore: 6.5,
    lastActivity: '1 tuần trước',
    status: 'Inactive',
    progress: 50,
  },
  {
    id: 6,
    studentCode: 'SE171239',
    fullName: 'Vũ Thị Giang',
    email: 'giangVT@fpt.edu.vn',
    avatar: '/placeholder.svg?height=40&width=40',
    completedAssignments: 27,
    totalAssignments: 30,
    averageScore: 8.9,
    lastActivity: '4 giờ trước',
    status: 'Active',
    progress: 90,
  },
]

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredStudents, setFilteredStudents] = useState(studentsData)

  // Lọc sinh viên theo tìm kiếm và trạng thái
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterStudents(value, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterStudents(searchTerm, status)
  }

  const filterStudents = (search: string, status: string) => {
    let filtered = studentsData

    if (search) {
      filtered = filtered.filter(
        student =>
          student.fullName.toLowerCase().includes(search.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(
        student => student.status.toLowerCase() === status.toLowerCase()
      )
    }

    setFilteredStudents(filtered)
  }

  const handleViewStudent = (studentId: number) => {
    console.log(`Viewing student details for ID: ${studentId}`)
    // Xử lý xem chi tiết sinh viên
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoạt động
          </Badge>
        )
      case 'Warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Cảnh báo
          </Badge>
        )
      case 'Inactive':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Không hoạt động
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header với thông tin lớp */}
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {classInfo.name}
            </h1>
            <p className="text-gray-600">{classInfo.subject}</p>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
            {classInfo.status === 'Active'
              ? 'Đang hoạt động'
              : 'Không hoạt động'}
          </Badge>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classInfo.totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredStudents.filter(s => s.status === 'Active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cảnh báo</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      filteredStudents.filter(s => s.status === 'Warning')
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bài tập</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classInfo.totalAssignments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <Card className="w-full">
        <CardHeader className="px-6">
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách sinh viên</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, mã sinh viên hoặc email..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="warning">Cảnh báo</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bảng danh sách sinh viên */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Mã sinh viên</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Điểm TB</TableHead>
                  <TableHead>Hoạt động cuối</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.avatar || '/placeholder.svg'}
                            alt={student.fullName}
                          />
                          <AvatarFallback>
                            {student.fullName
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.studentCode}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {student.completedAssignments}/
                            {student.totalAssignments}
                          </span>
                          <span className="text-gray-500">
                            {student.progress}%
                          </span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {student.averageScore}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            student.averageScore >= 8
                              ? 'bg-green-500'
                              : student.averageScore >= 6.5
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {student.lastActivity}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewStudent(student.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sinh viên
              </h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
