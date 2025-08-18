import { toast } from 'react-toastify'

export const getNavigateByRole = (role: string) => {
  switch (role) {
    case 'Admin':
      return '/dashboard/admin'
    case 'Teacher':
      return '/dashboard/teacher'
    case 'Student':
      return '/dashboard/student'
    case 'Head Subject':
      return '/dashboard/head-subject'
    default:
      toast.error('Something went wrong, please contact admin to login')
  }
}
