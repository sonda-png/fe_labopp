import { semestersQueries } from '@/api/actions/semesters/semesters.queries'
import { Semester } from '@/api/actions/semesters/semesters.types'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@/hooks'
import { Calendar, CheckCircle, Clock, Shield, Star } from 'lucide-react'
import { useMemo } from 'react'

/* 
    Overview Semester Class
*/
export const OverviewSemesterClass = () => {
  const { data: semestersData } = useQuery({
    ...semestersQueries.getAll(),
  })

  const getSemesterStatus = (semester: Semester) => {
    if (!semester.isActive) return 'inactive'
    const year = parseInt(semester.academicYear.split('-')[0])
    const currentYear = new Date().getFullYear()
    if (year === currentYear) return 'current'
    if (year < currentYear) return 'completed'
    return 'upcoming'
  }

  const stats = useMemo(() => {
    return {
      total: semestersData?.length,
      current: semestersData?.filter(s => getSemesterStatus(s) === 'current')
        .length,
      completed: semestersData?.filter(
        s => getSemesterStatus(s) === 'completed'
      ).length,
      upcoming: semestersData?.filter(s => getSemesterStatus(s) === 'upcoming')
        .length,
      active: semestersData?.filter(s => s.isActive).length,
    }
  }, [semestersData])

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Semester</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.current}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Star className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completed}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.upcoming}
              </p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
