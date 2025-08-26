import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {
  Users,
  BookOpen,
  TrendingUp,
  Briefcase,
  School,
  UserCheck,
  CheckCircle,
} from 'lucide-react'
import { useQuery } from '@/hooks/useQuery/useQuery'
import { headSubjectDashboardQueries } from '@/api/actions/headsubject-dashboard/headsubject-dashboard.queries'

const headDataFake = {
  name: 'Head of Subject Dashboard',
  position: '',
  department: 'Faculty of Information Technology',
}

export const HeadSubjectDashboard = () => {
  // Lấy dữ liệu thật từ API
  const {
    data: overviewRes,
    isLoading: loadingOverview,
    isError: errorOverview,
  } = useQuery(headSubjectDashboardQueries.getOverview())
  const {
    data: statisticsRes,
    isLoading,
    isError,
  } = useQuery(headSubjectDashboardQueries.getAssignmentStatisticsAll())
  const subjects = statisticsRes ?? []

  if (loadingOverview) {
    return <div className="p-8 text-center text-lg">Loading overview...</div>
  }
  if (errorOverview || !overviewRes) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load overview.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading subject statistics...
      </div>
    )
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load subject statistics.
      </div>
    )
  }

  const headData = {
    ...headDataFake,
    totalTeachers: overviewRes.totalTeachers,
    totalClasses: overviewRes.totalClasses,
    totalStudents: overviewRes.totalStudents,
    totalSubjects: 0, // Nếu API có trường này thì lấy, không thì để 0 hoặc bỏ
  }


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

              {headData.name}!

            </h1>
            <p className="text-gray-600">{headData.position}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalTeachers}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalClasses}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Subject Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <div
                  key={subject.classId}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {subject.className}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {subject.totalStudents} Students •{' '}
                          {subject.studentsPassed} Passed
                        </span>
                        <Badge
                          variant={
                            subject.passRate < 50 ? 'destructive' : 'default'
                          }
                          className={
                            subject.passRate >= 85
                              ? 'bg-green-500'
                              : subject.passRate >= 75
                                ? 'bg-orange-500'
                                : ''
                          }
                        >
                          {subject.passRate < 50 ? 'Needs Attention' : 'Normal'}
                        </Badge>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default HeadSubjectDashboard
