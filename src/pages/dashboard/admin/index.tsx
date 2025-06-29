import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  School,
  BookOpen,
  Activity,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  Settings,
  Database,
  Shield,
  Server,
  Crown,
  BarChart3,
} from 'lucide-react'

const systemStats = {
  totalUsers: 2847,
  totalStudents: 2456,
  totalTeachers: 89,
  totalSubjects: 47,
  totalClasses: 156,
  systemUptime: 99.9,
  serverLoad: 67,
  storageUsed: 78,
  activeUsers: 1234,
}

const recentActivities = [
  {
    id: 1,
    type: 'user_created',
    message: 'Tạo tài khoản mới cho giảng viên Nguyễn Văn A',
    time: '2 phút trước',
    severity: 'info',
  },
  {
    id: 2,
    type: 'system_alert',
    message: 'Cảnh báo: Dung lượng lưu trữ đạt 78%',
    time: '15 phút trước',
    severity: 'warning',
  },
  {
    id: 3,
    type: 'backup_complete',
    message: 'Sao lưu dữ liệu hoàn tất thành công',
    time: '1 giờ trước',
    severity: 'success',
  },
  {
    id: 4,
    type: 'login_failed',
    message: 'Phát hiện 5 lần đăng nhập thất bại từ IP 192.168.1.100',
    time: '2 giờ trước',
    severity: 'error',
  },
]

const quickActions = [
  {
    icon: UserPlus,
    label: 'Tạo tài khoản',
    action: 'create-user',
    color: 'bg-orange-500',
  },
  {
    icon: Settings,
    label: 'Cấu hình hệ thống',
    action: 'system-config',
    color: 'bg-blue-500',
  },
  {
    icon: Database,
    label: 'Sao lưu dữ liệu',
    action: 'backup',
    color: 'bg-green-500',
  },
  { icon: Shield, label: 'Bảo mật', action: 'security', color: 'bg-red-500' },
]

export const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Quản trị hệ thống và giám sát hoạt động
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map(period => (
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
              {period === 'day'
                ? 'Hôm nay'
                : period === 'week'
                  ? 'Tuần'
                  : 'Tháng'}
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
                <p className="text-sm font-medium text-gray-600">
                  Tổng người dùng
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +12% so với tháng trước
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-8 w-8 text-orange-600" />
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
                  {systemStats.totalStudents.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +8% so với tháng trước
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <School className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giảng viên</p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalTeachers}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+3 trong tháng</span>
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
                <p className="text-sm font-medium text-gray-600">Lớp học</p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalClasses}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5 lớp mới</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-orange-500" />
              <span>Tình trạng hệ thống</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Uptime hệ thống
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {systemStats.systemUptime}%
                  </span>
                </div>
                <Progress
                  value={systemStats.systemUptime}
                  className="h-2 bg-gray-200"
                >
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${systemStats.systemUptime}%` }}
                  />
                </Progress>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tải server
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    {systemStats.serverLoad}%
                  </span>
                </div>
                <Progress
                  value={systemStats.serverLoad}
                  className="h-2 bg-gray-200"
                >
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${systemStats.serverLoad}%` }}
                  />
                </Progress>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Dung lượng lưu trữ
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {systemStats.storageUsed}%
                  </span>
                </div>
                <Progress
                  value={systemStats.storageUsed}
                  className="h-2 bg-gray-200"
                >
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${systemStats.storageUsed}%` }}
                  />
                </Progress>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {systemStats.activeUsers}
                </p>
                <p className="text-sm text-gray-600">Người dùng online</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Hiệu suất</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">Tốt</p>
                <p className="text-sm text-gray-600">Bảo mật</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <span>Thao tác nhanh</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-2 hover:border-orange-300 hover:bg-orange-50"
                >
                  <div className={`p-2 ${action.color} rounded-lg mr-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.severity === 'error'
                      ? 'bg-red-100 text-red-600'
                      : activity.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-600'
                        : activity.severity === 'success'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.severity === 'error'
                      ? 'destructive'
                      : activity.severity === 'warning'
                        ? 'secondary'
                        : activity.severity === 'success'
                          ? 'default'
                          : 'outline'
                  }
                  className={
                    activity.severity === 'success' ? 'bg-green-500' : ''
                  }
                >
                  {activity.severity === 'error'
                    ? 'Lỗi'
                    : activity.severity === 'warning'
                      ? 'Cảnh báo'
                      : activity.severity === 'success'
                        ? 'Thành công'
                        : 'Thông tin'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
