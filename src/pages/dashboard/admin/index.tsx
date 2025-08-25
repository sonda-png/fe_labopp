import { useEffect, useState } from 'react'
import { useQuery } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Crown,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { adminDashboardQueries } from '@/api/actions/admin-dashboard/admin-dashboard.queries'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'

const systemStats = {
  totalUsers: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalSubjects: 0,
  totalClasses: 0,
  systemUptime: 99.9,
  serverLoad: 67,
  storageUsed: 78,
  activeUsers: 0,
}

// Quick Actions removed

// Helper function to format timestamp
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  )

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
  return `${Math.floor(diffInMinutes / 1440)} days ago`
}

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'submission':
      return <BookOpen className="h-4 w-4" />
    case 'labassignment':
      return <School className="h-4 w-4" />
    case 'classslot':
      return <Users className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

// Helper function to get activity color
const getActivityColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'submission':
      return 'bg-blue-100 text-blue-600'
    case 'labassignment':
      return 'bg-green-100 text-green-600'
    case 'classslot':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)
  const pageSize = 7
  const activitiesPerSlide = 3

  const { data: timelineData, isLoading: isTimelineLoading } = useQuery({
    ...adminDashboardQueries.getRecentTimelinePaged({
      pageNumber: currentPage,
      pageSize: pageSize,
    }),
  })

  // Fetch accounts to compute totals
  const { data: accountsData } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  const totalUsers = (accountsData as any)?.length ?? 0
  const totalStudents = ((accountsData as any) ?? []).filter(
    (u: any) => String(u.roleName).toLowerCase() === 'student'
  ).length
  const totalTeachers = ((accountsData as any) ?? []).filter(
    (u: any) => String(u.roleName).toLowerCase() === 'teacher'
  ).length

  // Flatten activities from all timeline entries
  const allActivities =
    (timelineData as any)?.data?.reduce((acc: any[], entry: any) => {
      const activitiesWithDate = entry.activities.map((activity: any) => ({
        ...activity,
        date: entry.date,
      }))
      return [...acc, ...activitiesWithDate]
    }, []) || []

  // Calculate total slides
  const totalSlides = Math.ceil(allActivities.length / activitiesPerSlide)

  // Get current slide activities
  const currentActivities = allActivities.slice(
    currentSlide * activitiesPerSlide,
    currentSlide * activitiesPerSlide + activitiesPerSlide
  )

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

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
              System administration and activity monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
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
                  {totalStudents}
                </p>
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
                  {totalTeachers}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions removed */}

        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span>Recent Activities</span>
                </CardTitle>
                {totalSlides > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500">
                      {currentSlide + 1} / {totalSlides}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSlide}
                      disabled={currentSlide === totalSlides - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isTimelineLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg"
                    >
                      <div className="p-2 bg-gray-200 rounded-full animate-pulse">
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentActivities.length > 0 ? (
                <div className="space-y-3">
                  {currentActivities.map((activity: any, index: number) => (
                    <div
                      key={`${activity.date}-${index}`}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div
                        className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <span className="font-semibold">
                            {activity.actorName}
                          </span>{' '}
                          {activity.action.toLowerCase()}{' '}
                          <span className="text-blue-600">
                            {activity.target}
                          </span>
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs flex-shrink-0"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
