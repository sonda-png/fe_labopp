import { TeacherAssignment } from '@/api/actions/teacher-assignment/teacher-assignment.type'

export const getAssignmentStatus = (assignment: TeacherAssignment) => {
  if (assignment.status === 'Pending') return 'Pending'

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null
  const now = new Date()

  if (dueDate && now > dueDate) return 'completed'
  return 'active'
}

export const calculatePassRate = (assignment: TeacherAssignment) => {
  if (!assignment.totalSubmissions || assignment.totalSubmissions === 0)
    return 0
  return Math.round(
    (assignment.passedCount / assignment.totalSubmissions) * 100
  )
}
