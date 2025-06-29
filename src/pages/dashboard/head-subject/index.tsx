import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Briefcase,
  BarChart3,
  Target,
  School,
  UserCheck,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

const headData = {
  name: 'PGS.TS. Trần Văn Minh',
  position: 'Trưởng bộ môn Công nghệ phần mềm',
  department: 'Khoa Công nghệ thông tin',
  totalTeachers: 12,
  totalClasses: 28,
  totalStudents: 856,
  totalSubjects: 8,
}

const subjects = [
  {
    id: 1,
    name: 'PRF192 - Programming Fundamentals',
    teachers: 3,
    classes: 6,
    students: 245,
    avgPassRate: 82,
    trend: 'up',
    status: 'active',
  },
  {
    id: 2,
    name: 'PRO192 - Object-Oriented Programming',
    teachers: 2,
    classes: 4,
    students: 156,
    avgPassRate: 89,
    trend: 'up',
    status: 'active',
  },
  {
    id: 3,
    name: 'LAB211 - OOP Lab',
    teachers: 2,
    classes: 5,
    students: 195,
    avgPassRate: 75,
    trend: 'down',
    status: 'needs_attention',
  },
  {
    id: 4,
    name: 'DBI202 - Database Introduction',
    teachers: 3,
    classes: 7,
    students: 260,
    avgPassRate: 87,
    trend: 'up',
    status: 'active',
  },
]

const teacherPerformance = [
  {
    id: 1,
    name: 'TS. Nguyễn Thị Lan',
    subjects: ['PRF192', 'PRO192'],
    classes: 4,
    students: 156,
    avgPassRate: 91,
    rating: 'excellent',
  },
  {
    id: 2,
    name: 'ThS. Lê Văn Nam',
    subjects: ['LAB211', 'DBI202'],
    classes: 3,
    students: 118,
    avgPassRate: 85,
    rating: 'good',
  },
  {
    id: 3,
    name: 'TS. Phạm Thị Hoa',
    subjects: ['PRF192', 'LAB211'],
    classes: 3,
    students: 125,
    avgPassRate: 78,
    rating: 'average',
  },
]

const alerts = [
  {
    id: 1,
    type: 'performance',
    message: 'Tỷ lệ đậu LAB211 giảm 5% so với kỳ trước',
    severity: 'warning',
    time: '2 giờ trước',
  },
  {
    id: 2,
    type: 'deadline',
    message: 'Báo cáo cuối kỳ cần nộp trong 3 ngày',
    severity: 'info',
    time: '1 ngày trước',
  },
  {
    id: 3,
    type: 'resource',
    message: 'Cần phân bổ thêm giảng viên cho PRF192',
    severity: 'warning',
    time: '2 ngày trước',
  },
]

export const HeadSubjectDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xin chào, {headData.name}!
            </h1>
            <p className="text-gray-600">{headData.position}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {['semester', 'month', 'week'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={
                selectedPeriod === period
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              }
            >
              {period === 'semester'
                ? 'Học kỳ'
                : period === 'month'
                  ? 'Tháng'
                  : 'Tuần'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giảng viên</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalTeachers}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2 năm này</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lớp học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalClasses}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5 lớp mới</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sinh viên</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalStudents}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% kỳ này</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Môn học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalSubjects}
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Đang hoạt động</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <School className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Hiệu quả các môn học</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map(subject => (
                <div
                  key={subject.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {subject.name}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {subject.teachers} GV • {subject.classes} lớp •{' '}
                          {subject.students} SV
                        </span>
                        <Badge
                          variant={
                            subject.status === 'needs_attention'
                              ? 'destructive'
                              : 'default'
                          }
                          className={
                            subject.status === 'active' ? 'bg-green-500' : ''
                          }
                        >
                          {subject.status === 'needs_attention'
                            ? 'Cần chú ý'
                            : 'Bình thường'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-orange-600 mr-2">
                          {subject.avgPassRate}%
                        </p>
                        {subject.trend === 'up' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Tỷ lệ đậu</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <Progress
                      value={subject.avgPassRate}
                      className="h-2 bg-gray-200"
                    >
                      <div
                        className={`h-full rounded-full ${
                          subject.avgPassRate >= 85
                            ? 'bg-green-500'
                            : subject.avgPassRate >= 75
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.avgPassRate}%` }}
                      />
                    </Progress>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Teacher Performance */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Thông báo quan trọng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <Badge
                        variant={
                          alert.severity === 'warning'
                            ? 'secondary'
                            : alert.severity === 'info'
                              ? 'outline'
                              : 'destructive'
                        }
                        className={
                          alert.severity === 'warning' ? 'bg-orange-500' : ''
                        }
                      >
                        {alert.severity === 'warning'
                          ? 'Cảnh báo'
                          : alert.severity === 'info'
                            ? 'Thông tin'
                            : 'Khẩn cấp'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Teachers */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-500" />
                <span>Hiệu quả giảng viên</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teacherPerformance.map(teacher => (
                  <div
                    key={teacher.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {teacher.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {teacher.subjects.join(', ')} • {teacher.students} SV
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {teacher.avgPassRate}%
                        </p>
                        <Badge
                          variant={
                            teacher.rating === 'excellent'
                              ? 'default'
                              : teacher.rating === 'good'
                                ? 'secondary'
                                : 'outline'
                          }
                          className={
                            teacher.rating === 'excellent'
                              ? 'bg-green-500'
                              : teacher.rating === 'good'
                                ? 'bg-orange-500'
                                : ''
                          }
                        >
                          {teacher.rating === 'excellent'
                            ? 'Xuất sắc'
                            : teacher.rating === 'good'
                              ? 'Tốt'
                              : 'Trung bình'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Thao tác quản lý</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto p-4 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Báo cáo tổng hợp</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Quản lý GV</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Phân tích dữ liệu</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Lập kế hoạch</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HeadSubjectDashboard
