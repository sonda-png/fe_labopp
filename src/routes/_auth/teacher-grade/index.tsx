import TeacherGradingSystem from '../../../pages/teacher-grade'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/teacher-grade/')({
  component: TeacherGradingSystem,
})
