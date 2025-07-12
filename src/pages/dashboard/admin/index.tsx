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
    message: 'Created new account for teacher Nguyen Van A',
    time: '2 minutes ago',
    severity: 'info',
  },
  {
    id: 2,
    type: 'system_alert',
    message: 'Warning: Storage usage at 78%',
    time: '15 minutes ago',
    severity: 'warning',
  },
  {
    id: 3,
    type: 'backup_complete',
    message: 'Data backup completed successfully',
    time: '1 hour ago',
    severity: 'success',
  },
  {
    id: 4,
    type: 'login_failed',
    message: 'Detected 5 failed login attempts from IP 192.168.1.100',
    time: '2 hours ago',
    severity: 'error',
  },
]

const quickActions = [
  {
    icon: UserPlus,
    label: 'Create Account',
    action: 'create-user',
    color: 'bg-orange-500',
  },
  {
    icon: Settings,
    label: 'System Config',
    action: 'system-config',
    color: 'bg-blue-500',
  },
  {
    icon: Database,
    label: 'Backup Data',
    action: 'backup',
    color: 'bg-green-500',
  },
  { icon: Shield, label: 'Security', action: 'security', color: 'bg-red-500' },
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
              System Administration and Monitoring
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
                ? 'Today'
                : period === 'week'
                  ? 'Week'
                  : 'Month'}
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
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +12% vs last month
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
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalStudents.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +8% vs last month
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
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalTeachers}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+3 this month</span>
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
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats.totalClasses}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5 new classes</span>
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
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    System Uptime
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
                    Server Load
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
                    Storage Usage
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
                <p className="text-sm text-gray-600">Users Online</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Performance</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">Good</p>
                <p className="text-sm text-gray-600">Security</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <span>Quick Actions</span>
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
            <span>Recent Activities</span>
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
                    ? 'Error'
                    : activity.severity === 'warning'
                      ? 'Warning'
                      : activity.severity === 'success'
                        ? 'Success'
                        : 'Info'}
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
