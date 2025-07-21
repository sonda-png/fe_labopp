import TeacherSubmissionClassList from '../../../pages/teacher-submission'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/teacher-submission/')({
  component: TeacherSubmissionClassList,
})
