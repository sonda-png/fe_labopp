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
  CheckCircle,
} from 'lucide-react';
import { useQuery } from '@/hooks/useQuery/useQuery';
import { headSubjectDashboardQueries } from '@/api/actions/headsubject-dashboard/headsubject-dashboard.queries';


const headDataFake = {
  name: 'PGS.TS. Trần Văn Minh',
  position: 'Head of Software Engineering Department',
  department: 'Faculty of Information Technology',
};

export const HeadSubjectDashboard = () => {
  // Lấy dữ liệu thật từ API
  const { data: overviewRes, isLoading: loadingOverview, isError: errorOverview } = useQuery(headSubjectDashboardQueries.getOverview());
  const { data: statisticsRes, isLoading, isError } = useQuery(headSubjectDashboardQueries.getAssignmentStatisticsAll());
  const subjects = statisticsRes ?? [];

  if (loadingOverview) {
    return <div className="p-8 text-center text-lg">Loading overview...</div>;
  }
  if (errorOverview || !overviewRes) {
    return <div className="p-8 text-center text-red-500">Failed to load overview.</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center text-lg">Loading subject statistics...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load subject statistics.</div>;
  }

  const headData = {
    ...headDataFake,
    totalTeachers: overviewRes.totalTeachers,
    totalClasses: overviewRes.totalClasses,
    totalStudents: overviewRes.totalStudents,
    totalSubjects: 0, // Nếu API có trường này thì lấy, không thì để 0 hoặc bỏ
  };



const teacherPerformance = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    subjects: ['PRF192', 'PRO192'],
    classes: 4,
    students: 156,
    avgPassRate: 91,
    rating: 'excellent',
  },
  {
    id: 2,
    name: 'MSc. David Brown',
    subjects: ['LAB211', 'DBI202'],
    classes: 3,
    students: 118,
    avgPassRate: 85,
    rating: 'good',
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    subjects: ['PRF192', 'LAB211'],
    classes: 3,
    students: 125,
    avgPassRate: 78,
    rating: 'average',
  },
]

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
              Hello, {headData.name}!
            </h1>
            <p className="text-gray-600">{headData.position}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalTeachers}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2 this year</span>
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
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalClasses}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5 new classes</span>
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
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalStudents}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +12% this semester
                  </span>
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
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {headData.totalSubjects}
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Active</span>
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
              <span>Subject Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                          {subject.totalStudents} Students • {subject.studentsPassed} Passed
                        </span>
                        <Badge
                          variant={subject.passRate < 50 ? 'destructive' : 'default'}
                          className={subject.passRate >= 85 ? 'bg-green-500' : subject.passRate >= 75 ? 'bg-orange-500' : ''}
                        >
                          {subject.passRate < 50 ? 'Needs Attention' : 'Normal'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-orange-600 mr-2">
                          {subject.passRate}%
                        </p>
                        {subject.passRate >= 75 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Pass Rate</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <Progress
                      value={subject.passRate}
                      className="h-2 bg-gray-200"
                    >
                      <div
                        className={`h-full rounded-full ${
                          subject.passRate >= 85
                            ? 'bg-green-500'
                            : subject.passRate >= 75
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.passRate}%` }}
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
          {/* Top Teachers */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-500" />
                <span>Teacher Performance</span>
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
                          {teacher.subjects.join(', ')} • {teacher.students}{' '}
                          Students
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
                            ? 'Excellent'
                            : teacher.rating === 'good'
                              ? 'Good'
                              : 'Average'}
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
            <span>Management Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto p-4 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Summary Report</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Manage Teachers</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Data Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Planning</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HeadSubjectDashboard
