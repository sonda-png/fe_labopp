import { useQuery } from "@/hooks"
import { teacherStudentQueries } from "@/api/actions/teacher-student/teacher-student.queries"
import { authStore } from "@/stores/authStore"
import { teacherDashboardQueries } from "@/api/actions/teacher-dashboard/teacher-dashboard.queries"
import { teacherAssignmentQueries } from "@/api/actions/teacher-assignment/teacher-assignment.queries"

export const TestPage = () => {
  const { authValues } = authStore()

  const { data: teacherDashboardData } = useQuery({
    ...teacherDashboardQueries.classList(authValues.userId),
  })
  const { data: teacherAssignmentData } = useQuery({
    ...teacherAssignmentQueries.getAll('SE1732'),
  })
    const { data: students } = useQuery({
        ...teacherStudentQueries.getAll('SE1860'),
    })
    console.log(students)
    return <div>TestPage</div>
}
