'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/useApiClient/useApiClient'
import { teacherDashboardQueries } from '@/api/actions/teacher-dashboard/teacher-dashboard.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GraduationCap,
  Search,
  BookOpen,
  Calendar,
  Code,
  Filter,
  Eye,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { authStore } from '@/stores/authStore'
import { TeacherClass } from '@/api/actions/teacher-dashboard/teacher-dashboard.type'
import { useNavigate } from '@tanstack/react-router'

export default function TeacherSubmissionClassList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')

  const teacherId = authStore.getState().authValues.userId
  const { client } = useApiClient()
  const queryOptions = teacherDashboardQueries.classList(teacherId)
  const { data: classList = [], isLoading } = useQuery({
    ...queryOptions,
    queryFn: queryOptions.queryFn(client),
  })

  const navigate = useNavigate()
  const handleViewSubmission = (classId: string) => {
    navigate({ to: '/teacher-grade', search: { classId } })
  }

  const filteredClasses = classList.filter(classItem => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester =
      selectedSemester === 'all' ||
      classItem.semester?.toString() === selectedSemester
    const matchesYear =
      selectedYear === 'all' || classItem.academicYear === selectedYear

    return matchesSearch && matchesSemester && matchesYear
  })

  const activeClasses = classList.filter(c => c.isActive).length
  const totalClasses = classList.length
  const uniqueSubjects = [...new Set(classList.map(c => c.subject))].length
  const uniqueYears = [...new Set(classList.map(c => c.academicYear))]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (classList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có lớp học nào
            </h3>
            <p className="text-gray-600">
              Bạn chưa được phân công lớp học nào.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách lớp học
            </h1>
            <p className="text-gray-600">
              Chọn lớp để xem submissions và quản lý bài tập
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng lớp học</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalClasses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lớp đang hoạt động</p>
                  <p className="text-3xl font-bold text-green-600">
                    {activeClasses}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Môn học</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {uniqueSubjects}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Năm học</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {uniqueYears.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên lớp, môn học, mã lớp..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả học kỳ</SelectItem>
                  <SelectItem value="1">Học kỳ 1</SelectItem>
                  <SelectItem value="2">Học kỳ 2</SelectItem>
                  <SelectItem value="3">Học kỳ 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả năm học</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="bg-white text-black border-gray-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(classItem => (
            <Card
              key={classItem.id}
              className="bg-white hover:shadow-lg transition-all duration-200 border-0 shadow-md"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {classItem.name}
                  </CardTitle>
                  <Badge
                    className={
                      classItem.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {classItem.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Môn học:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {classItem.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Học kỳ:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {classItem.semester} - {classItem.academicYear}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">LOC để đậu:</span>
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      {classItem.locToPass?.toLocaleString?.() ?? '-'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Mã lớp:</span>
                    <span className="text-sm font-mono text-gray-600">
                      {classItem.id}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50"
                  onClick={() => handleViewSubmission(classItem.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem Submissions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy lớp học nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
