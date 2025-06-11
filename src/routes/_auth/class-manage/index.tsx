import ClassManagement from '../../../pages/class-manage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/class-manage/')({
  component: ClassManagement,
})


