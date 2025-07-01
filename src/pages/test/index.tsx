import { useQuery } from '@/hooks'
import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { teacherDashboardQueries } from '@/api/actions/teacher-dashboard/teacher-dashboard.queries'
import { authStore } from '@/stores/authStore'

export const TestPage = () => {
  const { authValues } = authStore()

  const { data: teacherDashboardData } = useQuery({
    ...teacherDashboardQueries.classList(authValues.userId),
  })
  const { data: teacherAssignmentData } = useQuery({
    ...teacherAssignmentQueries.getAll('SE1732'),
  })

  return <div>Test</div>
}
