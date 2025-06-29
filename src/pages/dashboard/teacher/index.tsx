import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  UserCheck,
  BarChart3,
  Target,
} from 'lucide-react'

const teacherData = {
  name: 'TS. Nguyễn Thị Lan',
  employeeId: 'GV001245',
  department: 'Công nghệ thông tin',
  totalClasses: 6,
  totalStudents: 234,
  activeAssignments: 8,
  pendingGrades: 45,
}

const classes = [
  {
    id: 1,
    name: 'SE1702 - PRF192',
    subject: 'Programming Fundamentals',
    students: 42,
    assignments: { total: 4, graded: 3, pending: 1 },
    avgLOC: 3250,
    passRate: 85,
    status: 'active',
  },
  {
    id: 2,
    name: 'SE1703 - PRO192',
    subject: 'Object-Oriented Programming',
    students: 38,
    assignments: { total: 3, graded: 3, pending: 0 },
    avgLOC: 4100,
    passRate: 92,
    status: 'completed',
  },
  {
    id: 3,
    name: 'SE1704 - LAB211',
    subject: 'OOP Lab',
    students: 35,
    assignments: { total: 3, graded: 2, pending: 1 },
    avgLOC: 2890,
    passRate: 78,
    status: 'active',
  },
]

const pendingTasks = [
  {
    id: 1,
    type: 'grading',
    title: 'Chấm bài Assignment 4 - SE1702',
    count: 15,
    deadline: '2 ngày',
    priority: 'high',
  },
  {
    id: 2,
    type: 'assignment',
    title: 'Tạo Assignment 5 - SE1704',
    count: 1,
    deadline: '5 ngày',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'feedback',
    title: 'Phản hồi báo cáo tiến độ',
    count: 8,
    deadline: '1 tuần',
    priority: 'low',
  },
]

export const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xin chào, {teacherData.name}!
            </h1>
            <p className="text-gray-600">
              {teacherData.employeeId} • {teacherData.department}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <FileText className="h-4 w-4 mr-2" />
            Tạo bài tập mới
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lớp học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teacherData.totalClasses}
                </p>
                <p className="text-sm text-gray-500">đang giảng dạy</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sinh viên</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teacherData.totalStudents}
                </p>
                <p className="text-sm text-gray-500">tổng số</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bài tập</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teacherData.activeAssignments}
                </p>
                <p className="text-sm text-gray-500">đang hoạt động</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Chờ chấm điểm
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {teacherData.pendingGrades}
                </p>
                <p className="text-sm text-gray-500">bài nộp</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Overview */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Tổng quan lớp học</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map(classItem => (
                <div
                  key={classItem.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {classItem.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {classItem.subject}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {classItem.students} sinh viên
                        </span>
                        <Badge
                          variant={
                            classItem.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            classItem.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-orange-500'
                          }
                        >
                          {classItem.status === 'completed'
                            ? 'Hoàn thành'
                            : 'Đang dạy'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        {classItem.passRate}%
                      </p>
                      <p className="text-sm text-gray-600">Tỷ lệ đậu</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {classItem.avgLOC.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Avg LOC</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {classItem.assignments.graded}
                      </p>
                      <p className="text-xs text-gray-600">Đã chấm</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">
                        {classItem.assignments.pending}
                      </p>
                      <p className="text-xs text-gray-600">Chờ chấm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>Công việc cần làm</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {task.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Hạn: {task.deadline}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'destructive'
                          : task.priority === 'medium'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        task.priority === 'medium' ? 'bg-orange-500' : ''
                      }
                    >
                      {task.priority === 'high'
                        ? 'Khẩn'
                        : task.priority === 'medium'
                          ? 'Vừa'
                          : 'Thấp'}
                    </Badge>
                  </div>
                  {task.count > 1 && (
                    <p className="text-sm text-orange-600">{task.count} mục</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Thao tác nhanh</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto p-4 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Tạo bài tập</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <CheckCircle className="h-6 w-6" />
              <span>Chấm điểm</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Báo cáo</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Lịch dạy</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherDashboard
