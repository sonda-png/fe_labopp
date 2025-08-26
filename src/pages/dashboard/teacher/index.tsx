import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Clock, UserCheck } from 'lucide-react'
import { useQuery } from '@/hooks'
import { teacherDashboardQueries } from '@/api/actions/teacher-dashboard/teacher-dashboard.queries'
import { TeacherClass } from '@/api/actions/teacher-dashboard/teacher-dashboard.type'
import { authStore } from '@/stores/authStore'
import { DashboardTeacher } from '@/components/features/dashboard/teacher/dashboard-data'

export const TeacherDashboard = () => {
  const teacherId = authStore.getState().authValues.userId
  console.log('teacherId:', teacherId)
  const { data, isLoading } = useQuery<TeacherClass[]>(
    teacherDashboardQueries.classList(teacherId)
  )
  console.log('API data:', data)

  // Calculate stats from class list
  const totalClasses = data?.length || 0
  // const totalStudents = 0 // You may want to sum students from another API or extend TeacherClass
  // const activeAssignments = 0 // Placeholder, update if you have this info
  // const pendingGrades = 0 // Placeholder, update if you have this info

  // For class details modal/expand, prepare state
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null)

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4">
      {/* Nếu đã chọn class thì show dashboard */}
      {selectedClass ? (
        <DashboardTeacher
          classId={selectedClass.id}
          onBack={() => setSelectedClass(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, Teacher!
                </h1>
                <p className="text-gray-600">ID: {teacherId}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-white text-black border border-gray-200 hover:bg-gray-100">
                <FileText className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {isLoading ? '...' : totalClasses}
                    </p>
                    <p className="text-sm text-gray-500">currently teaching</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BookOpen className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* You can add more cards for totalStudents, activeAssignments, pendingGrades if you have data */}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Classes Overview */}
            <Card className="lg:col-span-2 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <span>Class Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading && <div>Loading classes...</div>}
                  {!isLoading && data?.length === 0 && (
                    <div>No classes found.</div>
                  )}
                  {!isLoading &&
                    data?.map((classItem: TeacherClass) => {
                      let statusBg = ''
                      let statusText = ''
                      if (classItem.isActive) {
                        statusBg = 'bg-green-100'
                        statusText = 'text-green-800'
                      } else {
                        statusBg = 'bg-red-100'
                        statusText = 'text-red-800'
                      }
                      return (
                        <div
                          key={classItem.id}
                          className="flex items-center justify-between p-5 rounded-xl shadow border bg-gray-50 hover:bg-white transition cursor-pointer"
                          onClick={() => setSelectedClass(classItem)}
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-1">
                              {classItem.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {classItem.subject}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">
                                Semester: {classItem.semester} | Year:{' '}
                                {classItem.academicYear}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusText}`}
                              >
                                {classItem.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-orange-600 font-bold text-xl">
                              LOC to pass: {classItem.locToPass}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks - Placeholder, you can refactor this section as needed */}
            <Card className="shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Pending Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 bg-yellow-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          No pending tasks.
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </>
      )}
    </div>
  )
}

export default TeacherDashboard
