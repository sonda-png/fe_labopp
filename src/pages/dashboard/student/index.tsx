import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Code,
  FileText,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  BookOpen,
  Award,
  GraduationCap,
  CheckCircle,
  Star,
  Users,
  BarChart3,
} from 'lucide-react'

const studentData = {
  name: 'Nguyen Van An',
  studentId: 'HE173456',
  semester: 'Fall 2024',
  totalLOC: 12450,
  targetLOC: 15000,
  completedAssignments: 8,
  totalAssignments: 12,
  rank: 15,
  totalStudents: 245,
  gpa: 3.2,
  passRate: 83,
}

const subjects = [
  {
    id: 1,
    name: 'PRF192 - Programming Fundamentals',
    currentLOC: 3200,
    targetLOC: 4000,
    progress: 80,
    assignments: { completed: 3, total: 4 },
    grade: 'A',
    status: 'active',
  },
  {
    id: 2,
    name: 'PRO192 - Object-Oriented Programming',
    currentLOC: 4500,
    targetLOC: 5000,
    progress: 90,
    assignments: { completed: 3, total: 3 },
    grade: 'A+',
    status: 'completed',
  },
  {
    id: 3,
    name: 'LAB211 - OOP Lab',
    currentLOC: 2800,
    targetLOC: 3500,
    progress: 80,
    assignments: { completed: 2, total: 3 },
    grade: 'B+',
    status: 'active',
  },
  {
    id: 4,
    name: 'DBI202 - Database',
    currentLOC: 1950,
    targetLOC: 2500,
    progress: 78,
    assignments: { completed: 1, total: 2 },
    grade: 'B',
    status: 'active',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'assignment_submitted',
    message: 'Submitted Assignment 3 - PRF192',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'grade_received',
    message: 'Received grade for Assignment 2 - LAB211: A',
    time: '1 day ago',
    icon: Trophy,
    color: 'text-orange-600',
  },
  {
    id: 3,
    type: 'deadline_reminder',
    message: 'Assignment 4 - PRO192 due soon',
    time: '2 days ago',
    icon: Clock,
    color: 'text-red-600',
  },
]

const achievements = [
  {
    icon: Trophy,
    title: 'Top 20',
    description: 'Ranked in top 20 of class',
    earned: true,
  },
  {
    icon: Code,
    title: '10k LOC',
    description: 'Reached 10,000 lines of code',
    earned: true,
  },
  {
    icon: Star,
    title: 'Perfect Score',
    description: 'Achieved perfect score',
    earned: false,
  },
  {
    icon: Target,
    title: 'Goal Achiever',
    description: 'Completed all targets',
    earned: false,
  },
]

export const StudentDashboard = () => {
  const progressPercentage =
    (studentData.totalLOC / studentData.targetLOC) * 100
  const assignmentProgress =
    (studentData.completedAssignments / studentData.totalAssignments) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {studentData.name}!
            </h1>
            <p className="text-gray-600">
              {studentData.studentId} • {studentData.semester}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">
            GPA: {studentData.gpa}
          </p>
          <p className="text-sm text-gray-600">
            Pass Rate: {studentData.passRate}%
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total LOC</p>
                <p className="text-3xl font-bold text-gray-900">
                  {studentData.totalLOC.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  / {studentData.targetLOC.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Code className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </Progress>
              <p className="text-xs text-gray-500 mt-1">
                {progressPercentage.toFixed(1)}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {studentData.completedAssignments}
                </p>
                <p className="text-sm text-gray-500">
                  / {studentData.totalAssignments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={assignmentProgress} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${assignmentProgress}%` }}
                />
              </Progress>
              <p className="text-xs text-gray-500 mt-1">
                {assignmentProgress.toFixed(1)}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ranking</p>
                <p className="text-3xl font-bold text-gray-900">
                  #{studentData.rank}
                </p>
                <p className="text-sm text-gray-500">
                  / {studentData.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+3 positions this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {subjects.length}
                </p>
                <p className="text-sm text-gray-500">current subjects</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">1 subject completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects Progress */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Subject Progress</span>
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
                          {subject.currentLOC.toLocaleString()} /{' '}
                          {subject.targetLOC.toLocaleString()} LOC
                        </span>
                        <Badge
                          variant={
                            subject.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            subject.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-orange-500'
                          }
                        >
                          {subject.status === 'completed'
                            ? 'Completed'
                            : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        {subject.grade}
                      </p>
                      <p className="text-sm text-gray-600">
                        {subject.assignments.completed}/
                        {subject.assignments.total} assignments
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>LOC Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress
                      value={subject.progress}
                      className="h-2 bg-gray-200"
                    >
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </Progress>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-500" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg text-center ${
                      achievement.earned
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <achievement.icon
                      className={`h-6 w-6 mx-auto mb-2 ${
                        achievement.earned ? 'text-orange-500' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        achievement.earned ? 'text-orange-700' : 'text-gray-500'
                      }`}
                    >
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
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
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto p-4 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Submit New</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>View Statistics</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Rankings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard
